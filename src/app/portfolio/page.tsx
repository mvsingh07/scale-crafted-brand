import { getProfileData } from "@/lib/server/profile";
import { PortfolioContent } from "@/components/site/PortfolioContent";

const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

export default async function PortfolioPage() {
  const data = await getProfileData(OWNER);
  return <PortfolioContent data={data} />;
}
