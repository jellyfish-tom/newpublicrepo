import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export interface SidebarItem {
  id: string;
  label: string;
  icon: IconName;
  href?: string;
  active?: boolean;
}

interface SidebarButtonProps {
  item: SidebarItem;
}

const BASE_CLASSES =
  "flex h-10 w-10 items-center justify-center rounded-xl transition-[transform,background-color,color]";
const INTERACTIVE_CLASSES =
  "cursor-pointer hover:bg-slate-800 hover:text-white focus-ring active:scale-95";
const ACTIVE_CLASSES = "bg-slate-800 text-white";
const DISABLED_CLASSES = "cursor-not-allowed opacity-50";

export function SidebarButton({ item }: SidebarButtonProps) {
  const activeClassName = item.active ? ACTIVE_CLASSES : undefined;

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={item.active ? "page" : undefined}
        className={cn(BASE_CLASSES, INTERACTIVE_CLASSES, activeClassName)}
      >
        <Icon name={item.icon} />
      </Link>
    );
  }

  return (
    <span
      aria-label={`${item.label} (coming soon)`}
      aria-disabled="true"
      className={cn(BASE_CLASSES, DISABLED_CLASSES, activeClassName)}
    >
      <Icon name={item.icon} />
    </span>
  );
}
