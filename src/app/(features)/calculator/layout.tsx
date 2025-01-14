// calculator/layout.tsx
import React from "react";

export default function CalculatorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
