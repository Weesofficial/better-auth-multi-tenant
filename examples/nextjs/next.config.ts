import type { NextConfig } from "next";

const config: NextConfig = {
  // better-sqlite3 is a native module; keep it out of the server bundle.
  serverExternalPackages: ["better-sqlite3"],
  // This example lives inside the package's repository, whose root has a
  // lockfile and a `src/proxy.ts`. Without this Next.js picks the repository
  // root as the project and treats that file as its own proxy.
  turbopack: { root: import.meta.dirname },
};

export default config;
