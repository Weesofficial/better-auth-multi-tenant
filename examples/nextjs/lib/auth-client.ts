import { createAuthClient } from "better-auth/react";
import { multiTenantClient } from "better-auth-multi-tenant/client";

// No baseURL: requests go to whichever tenant host the page is on.
export const authClient = createAuthClient({ plugins: [multiTenantClient()] });
