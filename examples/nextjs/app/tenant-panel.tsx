"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Props = {
  slug: string;
  others: string[];
  user: { email: string; tenantId: string } | null;
};

export function TenantPanel({ slug, others, user }: Props) {
  const [email, setEmail] = useState(`demo@${slug}.test`);
  const [password, setPassword] = useState("correct-horse-battery");
  const [message, setMessage] = useState<string | null>(null);
  const [replay, setReplay] = useState<string | null>(null);

  async function signUp() {
    const { error } = await authClient.signUp.email({ email, password, name: email });
    if (error) setMessage(`${error.code ?? error.status}: ${error.message}`);
    else location.reload();
  }

  async function signIn() {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) setMessage(`${error.code ?? error.status}: ${error.message}`);
    else location.reload();
  }

  async function replayOn(target: string) {
    const res = await fetch(`/api/replay?tenant=${target}`, { method: "POST" });
    setReplay(JSON.stringify(await res.json(), null, 2));
  }

  if (!user) {
    return (
      <section>
        <h2>Sign in to {slug}</h2>
        <p>An account and its session belong to this tenant only.</p>
        <p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} /> {" "}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </p>
        <button onClick={signUp}>Sign up</button> <button onClick={signIn}>Sign in</button>
        {message && <p style={{ color: "#b42318" }}>{message}</p>}
      </section>
    );
  }

  return (
    <section>
      <h2>Signed in</h2>
      <p>
        {user.email}. This session is bound to <code>{user.tenantId}</code>.
      </p>
      <h3>Try to use this session on another tenant</h3>
      <p>
        Browsers keep the cookie on this subdomain, so this replays it server side, the way a stolen
        cookie would be used.
      </p>
      <p>
        <button onClick={() => replayOn(slug)}>Replay on {slug} (own tenant)</button>{" "}
        {others.map((o) => (
          <button key={o} onClick={() => replayOn(o)}>
            Replay on {o}
          </button>
        ))}
      </p>
      {replay && (
        <pre style={{ background: "#f4f4f6", padding: 12, borderRadius: 6, overflowX: "auto" }}>
          {replay}
        </pre>
      )}
      <button onClick={() => authClient.signOut().then(() => location.reload())}>Sign out</button>
    </section>
  );
}
