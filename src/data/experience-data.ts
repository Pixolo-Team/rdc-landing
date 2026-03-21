export type ExperienceCardData = {
  eyebrow?: string;
  title?: string;
  description?: string;
  icon: string;
  iconAlt?: string;
  iconWidth: number;
  iconHeight: number;
};

export const experienceCards: ExperienceCardData[] = [
  {
    eyebrow: "Study smarter",
    title: "AI Notes & Summarizer",
    description:
      'Transition from theoretical curiosity to practical mastery. Our labs are designed to bridge the gap between "knowing about AI" and "knowing how to lead with AI."',
    icon: "/images/calendar.svg",
    iconAlt: "",
    iconWidth: 48,
    iconHeight: 48,
  },
  {
    eyebrow: "Break language barriers",
    title: "Live Translate",
    description:
      "Break down barriers with real-time translation during calls and face-to-face meetings. Speak any language instantly.",
    icon: "/images/translate.svg",
    iconAlt: "Translation feature icon",
    iconWidth: 44,
    iconHeight: 44,
  },
  {
    eyebrow: "Edit like magic",
    title: "AI Photo Assist",
    description:
      "Move objects, remove distractions, and remaster your creative portfolio with generative AI-powered editing tools.",
    icon: "/images/photo-assist.svg",
    iconAlt: "Photo assist feature icon",
    iconWidth: 44,
    iconHeight: 44,
  },
  {
    eyebrow: "Work faster",
    title: "AI Productivity",
    description:
      "Draft emails, build professional resumes, and generate presentation outlines in seconds. Work smarter, not harder.",
    icon: "/images/productivity-logo.svg",
    iconAlt: "Productivity feature icon",
    iconWidth: 44,
    iconHeight: 44,
  },
];
