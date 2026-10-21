import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "./lib/auth";

export const handle: Handle = ({ event, resolve }) => svelteKitHandler({ auth, event, resolve, building });
