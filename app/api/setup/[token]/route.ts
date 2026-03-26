import { proxyMediaRequest } from "@/lib/server/backend-proxy";

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  return proxyMediaRequest(request, `/setup/${token}`);
}
