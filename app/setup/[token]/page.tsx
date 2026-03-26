import { SetupAdminForm } from "@/components/site/cms/setup-admin-form";

export default async function SetupAdminPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <SetupAdminForm token={token} />;
}
