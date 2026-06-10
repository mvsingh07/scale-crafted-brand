"use client";

import dynamic from "next/dynamic";

const ProjectsEditor = dynamic(() => import("@/views/forge/ProjectsEditor"), { ssr: false });

export default ProjectsEditor;
