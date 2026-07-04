import InviteScenarioPage from "@/features/newScenario/component/InviteScenarioPage";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <InviteScenarioPage token={token} />;
}
