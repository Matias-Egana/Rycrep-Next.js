import {
  proxyApiRequest,
  proxyCmsMutationRequest,
} from "@/lib/server/backend-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return proxyApiRequest(request, `/cms/products${url.search}`);
}

export async function POST(request: Request) {
  return proxyCmsMutationRequest(request, "/cms/products");
}
