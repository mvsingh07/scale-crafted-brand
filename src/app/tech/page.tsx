import { getProfileData } from "@/lib/server/profile";
import { TechContent } from "@/components/site/TechContent";

const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "manvir";

export default async function TechPage() {
  const data = await getProfileData(OWNER);
  return <TechContent data={data} />;
}
