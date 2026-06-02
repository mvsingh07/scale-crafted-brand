"use client";

import dynamic from "next/dynamic";

const ForgeEditProfile = dynamic(() => import("@/views/forge/EditProfile"), { ssr: false });

export default ForgeEditProfile;
