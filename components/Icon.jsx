import { icons } from "lucide-react";

/**
 * Thin wrapper over lucide-react — request an icon by PascalCase name
 * (e.g. <Icon name="LayoutDashboard" />). strokeWidth defaults to the kit's 2.
 */
export default function Icon({ name, size = 18, strokeWidth = 2, className, ...rest }) {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" {...rest} />;
}
