import type { Metadata } from "next";

import { DevModeView } from "@/components/dev-mode-view";

export const metadata: Metadata = {
  title: "Dev Mode | Nelson Lin",
  description: "A full-screen city image view.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevModePage() {
  return <DevModeView />;
}
