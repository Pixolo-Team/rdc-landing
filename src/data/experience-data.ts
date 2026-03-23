export type ExperienceCardData = {
  eyebrow?: string;
  title?: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
};

export const experienceCards: ExperienceCardData[] = [
  {
    eyebrow: "Privacy",
    title: "World's first privacy display on mobile",
    icon: "UserLockPrivacy",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Camera",
    title: "Best camera system",
    icon: "BackCamera2",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Photo Assist",
    title: "Quick & Easy studio level edits.",
    icon: "photo-assist",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Creative Studio",
    title: "From photos to stickers in a tap",
    icon: "EditImagePhoto",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Nighthography Video",
    title: "Clear & bright, even at night.",
    icon: "MoonStars",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Now nudge & Now brief",
    title: "Real-time insights, track daily tasks",
    icon: "ListToDoTasksChecklist",
    iconWidth: 48,
    iconHeight: 48,
  },
];
