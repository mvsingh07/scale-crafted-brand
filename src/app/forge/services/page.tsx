"use client";

import dynamic from "next/dynamic";

const ServicesEditor = dynamic(() => import("@/views/forge/ServicesEditor"), { ssr: false });

export default ServicesEditor;
