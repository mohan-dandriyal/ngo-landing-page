

export type VolunteerHighlight = {
  id: number;
  number: string;
  title: string;
  description: string;
};

export type VolunteerStat = {
  id: number;
  value: number;
  suffix: string;
  label: string;
};

export type VolunteerContent = {
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  imageBadge: {
    value: string;
    label: string;
  };
  highlights: VolunteerHighlight[];
  stats: VolunteerStat[];
  cta: {
    label: string;
    href: string;
  };
  secondaryLink: {
    label: string;
    href: string;
  };
  note: string;
};
