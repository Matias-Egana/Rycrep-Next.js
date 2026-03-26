import { proxyCmsMutationRequest } from "@/lib/server/backend-proxy";

export async function POST(request: Request) {
  return proxyCmsMutationRequest(request, "/cms/auth/mfa/enable");
}
