"use client";

import { useContext } from "react";
import { IdentityCtx } from "./identity-provider";

export { IdentityProvider } from "./identity-provider";

export function useIdentity() {
  const identity = useContext(IdentityCtx);
  return { identity, loading: identity === null };
}
