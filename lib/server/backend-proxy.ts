import { API_BASE_URL, MEDIA_BASE_URL } from "@/lib/env";

type ProxyOptions = {
  baseUrl?: string;
  path: string;
  method?: string;
  body?: BodyInit;
  extraHeaders?: HeadersInit;
};

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function rewriteSetCookieForCurrentHost(cookieValue: string, requestUrl: string) {
  const currentUrl = new URL(requestUrl);
  const isLocalHttp =
    currentUrl.protocol === "http:" &&
    (currentUrl.hostname === "localhost" || currentUrl.hostname === "127.0.0.1");

  let rewritten = cookieValue
    .replace(/;\s*Domain=[^;]+/gi, "")
    .replace(/;\s*domain=[^;]+/gi, "");

  if (isLocalHttp) {
    rewritten = rewritten
      .replace(/^__Host-/i, "")
      .replace(/^__Secure-/i, "")
      .replace(/;\s*Secure/gi, "")
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
  }

  return rewritten;
}

function getResponseSetCookies(headers: Headers): string[] {
  const headersWithGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithGetSetCookie.getSetCookie === "function") {
    return headersWithGetSetCookie.getSetCookie();
  }

  const singleSetCookie = headers.get("set-cookie");
  return singleSetCookie ? [singleSetCookie] : [];
}

function buildForwardHeaders(request: Request, extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders ?? {});
  const forwardedHeaderNames = [
    "accept",
    "authorization",
    "content-type",
    "cookie",
    "user-agent",
    "x-csrf-token",
  ];

  for (const headerName of forwardedHeaderNames) {
    const value = request.headers.get(headerName);
    if (value && !headers.has(headerName)) {
      headers.set(headerName, value);
    }
  }

  return headers;
}

function mergeCookieHeaders(baseCookieHeader: string | null, setCookies: string[]) {
  const cookieMap = new Map<string, string>();

  for (const chunk of (baseCookieHeader ?? "").split(";")) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const name = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (name) {
      cookieMap.set(name, value);
    }
  }

  for (const setCookie of setCookies) {
    const assignment = setCookie.split(";", 1)[0]?.trim();
    if (!assignment) continue;

    const separatorIndex = assignment.indexOf("=");
    if (separatorIndex <= 0) continue;

    const name = assignment.slice(0, separatorIndex).trim();
    const value = assignment.slice(separatorIndex + 1).trim();
    if (name) {
      cookieMap.set(name, value);
    }
  }

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

async function readRequestBody(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const bodyBuffer = await request.arrayBuffer();
  return bodyBuffer.byteLength > 0 ? bodyBuffer : undefined;
}

async function proxyToBackend(request: Request, options: ProxyOptions) {
  const targetUrl = joinUrl(options.baseUrl ?? API_BASE_URL, options.path);
  const headers = buildForwardHeaders(request, options.extraHeaders);

  const response = await fetch(targetUrl, {
    method: options.method ?? request.method,
    headers,
    body: options.body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  const responseLocation = response.headers.get("location");

  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  if (responseLocation) {
    responseHeaders.set("location", responseLocation);
  }

  for (const cookieValue of getResponseSetCookies(response.headers)) {
    responseHeaders.append(
      "set-cookie",
      rewriteSetCookieForCurrentHost(cookieValue, request.url)
    );
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

async function bootstrapCmsCsrf(request: Request) {
  const csrfUrl = joinUrl(API_BASE_URL, "/cms/csrf/");
  const bootstrapHeaders = buildForwardHeaders(request);
  bootstrapHeaders.delete("content-type");
  bootstrapHeaders.delete("x-csrf-token");

  const csrfResponse = await fetch(csrfUrl, {
    method: "GET",
    headers: bootstrapHeaders,
    redirect: "manual",
  });

  const rawText = await csrfResponse.text();

  if (!csrfResponse.ok) {
    return {
      ok: false as const,
      response: new Response(rawText || "No se pudo obtener CSRF del backend.", {
        status: csrfResponse.status,
        headers: {
          "content-type":
            csrfResponse.headers.get("content-type") ?? "text/plain; charset=utf-8",
        },
      }),
    };
  }

  let data: { csrfToken?: string } = {};

  try {
    data = JSON.parse(rawText) as { csrfToken?: string };
  } catch {}

  if (!data.csrfToken) {
    return {
      ok: false as const,
      response: new Response("Respuesta CSRF invalida del backend.", {
        status: 502,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      }),
    };
  }

  return {
    ok: true as const,
    csrfToken: data.csrfToken,
    setCookies: getResponseSetCookies(csrfResponse.headers),
  };
}

export async function proxyCmsMutationRequest(
  request: Request,
  path: string,
  method?: string
) {
  const csrfBootstrap = await bootstrapCmsCsrf(request);
  if (!csrfBootstrap.ok) {
    return csrfBootstrap.response;
  }

  const body = await readRequestBody(request);
  const mergedCookieHeader = mergeCookieHeaders(
    request.headers.get("cookie"),
    csrfBootstrap.setCookies
  );

  return proxyToBackend(request, {
    path,
    method,
    body,
    extraHeaders: {
      cookie: mergedCookieHeader,
      "x-csrf-token": csrfBootstrap.csrfToken,
    },
  });
}

export async function proxyApiRequest(request: Request, path: string, method?: string) {
  const body = await readRequestBody(request);

  return proxyToBackend(request, {
    path,
    method,
    body,
  });
}

export async function proxyMediaRequest(request: Request, path: string, method?: string) {
  const body = await readRequestBody(request);

  return proxyToBackend(request, {
    baseUrl: MEDIA_BASE_URL,
    path,
    method,
    body,
  });
}
