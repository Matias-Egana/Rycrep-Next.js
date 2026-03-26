import { proxyCmsMutationRequest } from "@/lib/server/backend-proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyCmsMutationRequest(request, `/cms/products/${id}`);
}
