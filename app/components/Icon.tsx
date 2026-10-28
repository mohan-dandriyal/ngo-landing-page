import {
  
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

// Add any lucide icon here, then reference it by name in data/hero.json
export const iconMap: Record<string, LucideIcon> = {
//   Facebook,
//   Instagram,
//   Twitter,
//   Youtube,
  HeartHandshake,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? HeartHandshake;
}