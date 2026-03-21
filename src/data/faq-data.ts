export type FaqDataItem = {
  title: string;
  description: string;
  open?: boolean;
};

export const faqSectionContent = {
  eyebrow: "Q & A",
  title: "Frequently Asked Questions",
  faqItemList: [
    {
      title: "Do I need to know Copilot already?",
      description:
        "No. It’s beginner-friendly and shows practical ways to use Copilot.",
    },
    {
      title: "Will I receive a certificate?",
      description:
        "Yes - AI-Ready Certificate (Microsoft Copilot Edition) co-branded with The AI School will be awarded after attending the masterclass.",
    },
    {
      title: "Is it free?",
      description: "Yes - it’s free to attend. Seats are limited.",
    },
    {
      title: "What is the Masterclass Confirmation Number?",
      description:
        "A unique number issued after your booking is verified. It appears in your confirmation email.",
    },
    {
      title: "How do the Reliance Digital Referral Discount codes work?",
      description:
        "After booking, you’ll get two discount codes by email - single-use each. You and a friend can redeem one code each for exclusive offers and deals online or in-store.",
    },
    {
      title: "What ID should I carry for the masterclass?",
      description: "A valid student ID or government-issued photo ID.",
    },
    {
      title: "How is my data used?",
      description:
        "Your information is used for registration, session operations, and issuing certificates/discounts per our privacy policy.",
    },
  ] satisfies FaqDataItem[],
};
