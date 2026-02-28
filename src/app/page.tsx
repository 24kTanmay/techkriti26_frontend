import HomeClient from '@/components/layout/HomeClient'

export default function Home() {
  // Static data - ideal for Server Component
  const summitImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&fm=webp", // Tech
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600&fm=webp", // AI
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600&fm=webp", // Rakshakriti
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&fm=webp", // MedTech
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&fm=webp", // Space
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600&fm=webp", // E-Conclave
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600&fm=webp", // Sustainability
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&fm=webp", // Industry 4.0
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&fm=webp", // Women Panel
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600&fm=webp"  // Vision 360
  ]

  const summitNames = [
    "Tech Summit",
    "AI Summit",
    "Rakshakriti",
    "MedTech",
    "Space",
    "E - Conclave",
    "Sustainability",
    "Industry 4.0",
    "Women Panel",
    "Vision 360 Policy Conclave"
  ];

  const summitBriefs = [
    "Engineering the future through disruptive innovations.",
    "Exploring the frontiers of artificial intelligence and machine learning.",
    "Strengthening national security through indigenous defense technology.",
    "Revolutionizing healthcare with advanced medical engineering.",
    "Scaling new heights in aerospace and interplanetary exploration.",
    "Igniting the entrepreneurial spirit of tomorrow's leaders.",
    "Crafting eco-friendly solutions for a greener planet.",
    "Mastering the smart manufacturing and automation revolution.",
    "Celebrating and empowering women leaders in the tech ecosystem.",
    "Shaping global policies through multifaceted dialogue."
  ];

  return (
    <HomeClient 
      summitImages={summitImages}
      summitNames={summitNames}
      summitBriefs={summitBriefs}
    />
  )
}