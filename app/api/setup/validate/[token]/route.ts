import { proxyMediaRequest } from "@/lib/server/backend-proxy";

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  return proxyMediaRequest(request, `/api/setup/validate/${token}`);
}
