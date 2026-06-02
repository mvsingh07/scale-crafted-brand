import { Suspense } from "react";
import ForgeLogin from "@/views/forge/Login";

export default function ForgeLoginPage() {
  return (
    <Suspense>
      <ForgeLogin />
    </Suspense>
  );
}
