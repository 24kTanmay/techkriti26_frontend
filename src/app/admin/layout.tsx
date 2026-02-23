import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Techkriti '26 | Nexus Command",
  description: "Admin Command Center for TechKriti '26 — IIT Kanpur",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
