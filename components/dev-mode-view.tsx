import React from "react";
import Link from "next/link";

export function DevModeView() {
  return (
    <main className="dev-mode-page">
      <Link href="/" className="dev-mode-back-link">
        Back to home
      </Link>

      <div className="dev-mode-frame">
        <img className="dev-mode-image" src="/dev-mode/city.png" alt="City view" />
      </div>
    </main>
  );
}
