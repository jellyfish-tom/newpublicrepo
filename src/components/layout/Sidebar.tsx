import { CleengLogo } from "./CleengLogo";
import { SidebarButton, type SidebarItem } from "./SidebarButton";

const NAV_ITEMS: ReadonlyArray<SidebarItem> = [
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "customers", label: "Customers", icon: "users" },
  { id: "billing", label: "Billing", icon: "tag", href: "/", active: true },
  { id: "monitor", label: "Monitor", icon: "pulse" },
  { id: "insights", label: "Insights", icon: "search" },
  { id: "messages", label: "Messages", icon: "chat" },
];

export function Sidebar() {
  return (
    <aside
      aria-label="Primary navigation"
      className="hidden md:flex sticky top-0 h-screen w-16 shrink-0 flex-col items-center justify-between bg-slate-950 py-5 text-slate-400"
    >
      <div className="flex flex-col items-center gap-5">
        <CleengLogo />
        <nav className="mt-4 flex flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarButton key={item.id} item={item} />
          ))}
        </nav>
      </div>
      <SidebarButton item={{ id: "settings", label: "Settings", icon: "cog" }} />
    </aside>
  );
}
