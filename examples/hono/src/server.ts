import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./auth.js";

const app = new Hono();

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port });
console.log(`hono: http://acme.localhost:${port}  http://globex.localhost:${port}`);
