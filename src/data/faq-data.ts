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
      title: "Who is this experience for?",
      description:
        "This is designed for students and young professionals who want to start using AI in their daily life — no technical background required. If you use your phone for studying, content, or productivity, you’ll get value from this.",
    },
    {
      title: "Do I need any prior knowledge of AI?",
      description:
        "No - The session is beginner-friendly and guided step-by-step by Galaxy AI experts. You’ll learn by actually using the features.",
    },
    {
      title: "What happens during the session?",
      description:
        "It’s a 60–90 minute hands-on experience where you: Try Galaxy AI features live on Samsung devices , Learn real use cases (notes, translation, editing, productivity), Get guided by experts in a small group setting. This isn’t a lecture — you’ll actively use the features yourself.",
    },
    {
      title: "Will I get a Samsung phone after the session?",
      description:
        "No — the devices are provided for hands-on use during the experience at the store. You’ll be able to explore and try all the Galaxy AI features live during the session. If you enjoy the experience, you’ll also get access to exclusive offers to purchase the device.",
    },
    {
      title: "What do you win Merchandise?",
      description: "S26 Ultra Merchandise on answering q&a",
    },
    {
      title: "Is this free to attend?",
      description:
        "Yes, the experience is completely free. Seats are limited to ensure everyone gets hands-on time, so registration is required.",
    },
    {
      title: "Where will the sessions be held?",
      description:
        "Sessions will take place at selected Reliance Digital stores across: Mumbai, Bangalore, Delhi, Chennai, Pune, Hyderabad, and Kolkata. You’ll be assigned the nearest store after registration.",
    },
    {
      title: "Will I get hands-on experience with the device?",
      description:
        "Yes — that’s the core of the experience. You’ll use Samsung Galaxy devices during the session and try the features yourself, not just watch a demo.",
    },
    {
      title: "What will I actually learn?",
      description:
        "You’ll learn how to use AI in real situations like: Turning lecture notes into summaries, Translating conversations in real time, Editing photos using AI, Writing emails, resumes, and content faster. These are practical skills you can start using immediately.",
    },
    {
      title: "Will I receive a certificate?",
      description:
        "Yes - You’ll receive an official Galaxy AI Certificate from Samsung and Reliance Digital after completing the experience.",
    },
    {
      title: "Is this a sales event?",
      description:
        "No — it’s designed as a learning experience. You’ll get to explore and understand how Galaxy AI works in real life. If you’re interested, there will be exclusive offers available — but there’s no obligation to purchase.",
    },
    {
      title: "Can I bring a friend?",
      description:
        "Yes — you can attend with a friend. There may also be referral benefits if your friend decides to purchase after the experience.",
    },
    {
      title: "What should I bring with me?",
      description:
        "Just yourself. All devices and materials will be provided at the store.",
    },
    {
      title: "How do I register?",
      description:
        "Click on Register Now, select your city, and choose your preferred slot. You’ll receive confirmation and further details via SMS or email.",
    },
  ] satisfies FaqDataItem[],
};
