import { getProfileData } from "@/lib/server/profile";
import { PortfolioContent } from "@/components/site/PortfolioContent";

const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "manvir";

export default async function PortfolioTechPage() {
  const data = await getProfileData(OWNER);
  return <PortfolioContent data={data} />;
}
