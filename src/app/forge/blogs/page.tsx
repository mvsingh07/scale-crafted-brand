"use client";

import dynamic from "next/dynamic";

const BlogsEditor = dynamic(() => import("@/views/forge/BlogsEditor"), { ssr: false });

export default BlogsEditor;
