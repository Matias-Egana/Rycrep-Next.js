import { proxyApiRequest } from "@/lib/server/backend-proxy";

export async function GET(request: Request) {
  return proxyApiRequest(request, "/cms/csrf/");
}
