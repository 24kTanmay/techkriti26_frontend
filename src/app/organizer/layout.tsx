import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Techkriti '26 | Organizer Portal",
  description: "Organizer Command Center for TechKriti '26 — IIT Kanpur",
};

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
