export type ExperienceCardData = {
  eyebrow?: string;
  title?: string;
  icon: string;
  iconAlt?: string;
  iconWidth: number;
  iconHeight: number;
};

export const experienceCards: ExperienceCardData[] = [
  {
    eyebrow: "Privacy",
    title: "World's first privacy display on mobile",
    icon: "/icons/UserLockPrivacy.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Camera",
    title: "Best camera system",
    icon: "/icons/BackCamera2.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Photo Assist",
    title: "Quick & Easy studio level edits.",
    icon: "/icons/photo-assist.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Creative Studio",
    title: "From photos to stickers in a tap",
    icon: "/icons/EditImagePhoto.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Nighthography Video",
    title: "Clear & bright, even at night.",
    icon: "/icons/MoonStars.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Now nudge & Now brief",
    title: "Real-time insgihts, track daily tasks",
    icon: "/icons/ListToDoTasksChecklist.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
];
