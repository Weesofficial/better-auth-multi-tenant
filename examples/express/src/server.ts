import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth.js";

const app = express();

// Mount before any body parser: Better Auth reads the raw request body itself.
app.all("/api/auth/*splat", toNodeHandler(auth));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`express: http://acme.localhost:${port}  http://globex.localhost:${port}`));
