"use client";
import dynamic from "next/dynamic";

const ForgeDashboard = dynamic(() => import("@/views/forge/Dashboard"), { ssr: false });

export default ForgeDashboard;
