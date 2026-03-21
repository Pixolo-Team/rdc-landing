export type HighlightDataItem = {
  title: string;
  description: string;
  icon: string;
  alt: string;
};

export const highlightsSectionContent = {
  eyebrow: "Galaxy AI Navigator Labs",
  title: "Event Highlights",
  highlights: [
    {
      title: "Official Galaxy AI Certificate",
      description: "Become a certified navigator after the masterclass.",
      icon: "certificate",
      alt: "Certificate icon",
    },
    {
      title: "Real-life AI skills",
      description: "Practical workflows for work, study, and creativity.",
      icon: "sparkle",
      alt: "Spark icon",
    },
    {
      title: "Hands-on S26 Ultra experience",
      description: "Get early access to the newest flagship hardware.",
      icon: "mobile-logo",
      alt: "Phone icon",
    },
    {
      title: "Exclusive offers + discounts",
      description: "Attendee-only benefits on Galaxy ecosystem devices.",
      icon: "offer-logo",
      alt: "Discount coupon icon",
    },
  ] satisfies HighlightDataItem[],
};
