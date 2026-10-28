/** Every data type used by the banner. Edit data here and the UI follows. */

/** Keys of the icon registry in components/Icon.tsx (each maps to a lucide-react icon) */
export type IconName =
  | "heart"
  | "users"
  | "hand-heart"
  | "book"
  | "food"
  | "home"
  | "globe"
  | "graduation-cap";

export type ButtonVariant = "primary" | "outline";

export interface BannerImage {
  /** Path in /public (e.g. "/hero.jpg") or a full https URL */
  src: string;
  alt: string;
}

export interface BannerHeading {
  /** First, light-weight line */
  light: string;
  /** Second, bold line */
  bold: string;
}

export interface BannerButton {
  id: string;
  label: string;
  href: string;
  variant: ButtonVariant;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  link: { label: string; href: string };
}

export interface BannerData {
  heading: BannerHeading;
  tagline: string;
  description: string;
  image?: BannerImage;
  buttons: BannerButton[];
  services: ServiceItem[];
}

/** Shape of the JSON returned by /api/banner (or your CMS) */
export interface BannerApiResponse {
  data: BannerData;
  updatedAt: string; // ISO date
}