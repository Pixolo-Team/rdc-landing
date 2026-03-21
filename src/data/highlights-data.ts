export type HighlightDataItem = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export const highlightsSectionContent = {
  eyebrow: "Galaxy AI Navigator Labs",
  title: "Event Highlights",
  highlights: [
    {
      title: "Official Galaxy AI Certificate",
      description: "Become a certified navigator after the masterclass.",
      image: "/images/certificate.svg",
      alt: "Certificate icon",
    },
    {
      title: "Real-life AI skills",
      description: "Practical workflows for work, study, and creativity.",
      image: "/images/sparkle.svg",
      alt: "Spark icon",
    },
    {
      title: "Hands-on S26 Ultra experience",
      description: "Get early access to the newest flagship hardware.",
      image: "/images/mobile-logo.svg",
      alt: "Phone icon",
    },
    {
      title: "Exclusive offers + discounts",
      description: "Attendee-only benefits on Galaxy ecosystem devices.",
      image: "/images/offer-logo.svg",
      alt: "Discount coupon icon",
    },
  ] satisfies HighlightDataItem[],
};
