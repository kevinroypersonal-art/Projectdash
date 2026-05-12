"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider, useTheme } from "next-themes";

function ThemedClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: isDark ? "#ffffff" : "#0a0a0a",
          colorBackground: isDark ? "#0a0a0a" : "#fafafa",
          colorInputBackground: isDark ? "#141414" : "#f4f4f5",
          colorInputText: isDark ? "#fafafa" : "#0a0a0a",
          colorText: isDark ? "#fafafa" : "#0a0a0a",
          colorTextSecondary: isDark ? "#a1a1a1" : "#525252",
          fontFamily: "var(--font-inter-tight)",
          borderRadius: "0",
        },
        elements: {
          card: "border border-[color:var(--color-border)] bg-[color:var(--color-surface)]",
          formButtonPrimary:
            "bg-[color:var(--color-fg)] text-[color:var(--color-bg)] hover:opacity-90 font-mono uppercase tracking-[0.16em] text-xs rounded-none",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemedClerkProvider>{children}</ThemedClerkProvider>
    </ThemeProvider>
  );
}
