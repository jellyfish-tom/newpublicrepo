import { useId, type ReactNode, type SVGProps } from "react";
import { cn } from "@/lib/cn";

export type IconName =
  | "chart"
  | "users"
  | "tag"
  | "pulse"
  | "search"
  | "chat"
  | "cog"
  | "cleeng"
  | "chevron-down"
  | "download";

type IconSize = "xs" | "sm" | "md" | "lg";

interface BaseIconProps extends Omit<SVGProps<SVGSVGElement>, "children" | "title"> {
  name: IconName;
  size?: IconSize;
  strokeWidth?: number;
}

type IconProps =
  | (BaseIconProps & {
      decorative?: true;
      title?: never;
    })
  | (BaseIconProps & {
      decorative: false;
      title: string;
    });

const SIZE_CLASSES: Record<IconSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const ICON_PATHS: Record<IconName, ReactNode> = {
  chart: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  tag: (
    <>
      <path d="M20.59 13.41 13 21a2 2 0 0 1-2.83 0L3 13.83V3h10.83L21 10.17a2 2 0 0 1-.41 3.24Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  chat: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  cleeng: (
    <>
      <path d="M19 7a8 8 0 1 0 0 10" />
      <path d="M5 12h10" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
};

export function Icon(props: IconProps) {
  const { title: titleProp, decorative: decorativeProp, ...iconProps } = props;
  const { name, size = "md", strokeWidth = 2, className, ...svgProps } = iconProps;
  const generatedTitleId = useId();
  const isDecorativeIcon = decorativeProp !== false;
  const normalizedTitle = (titleProp ?? "").trim();
  const accessibleTitle = isDecorativeIcon ? undefined : normalizedTitle || name;
  const titleId = accessibleTitle ? generatedTitleId : undefined;
  const fallbackTitle = accessibleTitle ?? name;
  const ariaHidden = isDecorativeIcon ? true : undefined;

  return (
    <svg
      role={accessibleTitle ? "img" : undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      aria-labelledby={titleId}
      focusable="false"
      className={cn(SIZE_CLASSES[size], className)}
      {...svgProps}
    >
      <title id={titleId}>{fallbackTitle}</title>
      {ICON_PATHS[name]}
    </svg>
  );
}
