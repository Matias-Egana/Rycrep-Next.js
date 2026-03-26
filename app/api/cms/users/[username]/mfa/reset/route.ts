import { proxyCmsMutationRequest } from "@/lib/server/backend-proxy";

export async function POST(
  request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  return proxyCmsMutationRequest(
    request,
    `/cms/users/${encodeURIComponent(username)}/mfa/reset`
  );
}
