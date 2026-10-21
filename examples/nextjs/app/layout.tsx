import type { ReactNode } from "react";

export const metadata = { title: "better-auth-multi-tenant · Next.js example" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 720,
          margin: "48px auto",
          padding: "0 16px",
          lineHeight: 1.5,
          color: "#17171c",
        }}
      >
        {children}
      </body>
    </html>
  );
}
