import { Request, Response } from 'express';

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'EV Revolution' | 'Hypercars' | 'Industry Insights' | 'Tech & Autonomy';
  author: string;
  readTime: string;
  publishedAt: string;
  summary: string;
  content: string;
  imageUrl: string;
}

const ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Solid-State Battery Breakthrough Unlocks 600-Mile Range in 10-Minute Charge',
    subtitle: 'Next-generation solid-state chemistry promises to make range anxiety a relic of automotive history.',
    category: 'EV Revolution',
    author: 'Elena Vance, Senior Automotive Editor',
    readTime: '4 min read',
    publishedAt: '2026-10-24T08:00:00Z',
    summary: 'Automotive research consortiums announce commercial production readiness for high-energy density solid electrolyte battery cells.',
    content:
      'The automotive industry stands on the precipice of its most transformative milestone since the invention of the assembly line. Breakthrough testing reveals that solid-state electrolyte cells have achieved 1,200 charge cycles with less than 2% degradation while cutting charging latency down to a brisk 10 minutes from 10% to 80% SOC.',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f7ce'
  },
  {
    id: 'news-2',
    title: 'The Hypercar Renaissance: How Hybrid V8s Are Outperforming Pure Electrics on Track',
    subtitle: 'Top-tier engineering houses blend synthetic e-fuels with lightweight hybrid powertrains for sensory euphoria.',
    category: 'Hypercars',
    author: 'Marcus Sterling, Track Test Specialist',
    readTime: '6 min read',
    publishedAt: '2026-10-22T14:30:00Z',
    summary: 'Nürburgring lap records tumble as hypercar manufacturers introduce carbon-chassis hybrids revving to 10,000 RPM.',
    content:
      'While pure electric torque delivers uncontested straight-line drag sprint supremacy, track enthusiasts and racing purists are driving a fierce resurgence in ultra-lightweight hybrid hypercars. Utilizing carbon-composite monocoques, aero downforce generating over 1,000 kg at 150 mph, and instant electric torque fill across gear changes, these machines deliver unmatched lap endurance and spine-tingling acoustic theatre.',
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a'
  },
  {
    id: 'news-3',
    title: 'Luxury Automotive Architecture: The Shift Towards Software-Defined Cockpits',
    subtitle: 'Micro-LED glass displays, real-time telemetry AI, and spatial acoustic soundscapes redefine interior luxury.',
    category: 'Tech & Autonomy',
    author: 'Aria Chen, Mobility Technologist',
    readTime: '5 min read',
    publishedAt: '2026-10-20T11:15:00Z',
    summary: 'Inside the ultra-modern cabins of 2026: how custom neural networks adapt vehicle suspension, lighting, and performance profiles in real time.',
    content:
      'Automotive luxury is no longer solely judged by wood veneers and hand-stitched leather. Today, the world’s leading marques compete on cognitive elegance. Deep learning neural processors embedded in the chassis read the road surface millimeters ahead with LiDAR, adjust magnetic dampers in 5 milliseconds, and project holographic navigation onto the windshield.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
  },
  {
    id: 'news-4',
    title: 'Classic Meets Modern: The Soaring Value of Limited-Run Analog Sports Cars',
    subtitle: 'Why manual transmissions and naturally aspirated engines are becoming the ultimate luxury store of value.',
    category: 'Industry Insights',
    author: 'David Thorne, Classic & Exotic Market Analyst',
    readTime: '3 min read',
    publishedAt: '2026-10-18T09:45:00Z',
    summary: 'Collector vehicle auction houses report record premiums for limited production run vehicles featuring analog driver engagement.',
    content:
      'As autonomous systems and electric drivetrains become the standard for daily commutes, high-revving naturally aspirated engines mated to mechanical gated manual gearboxes have transitioned into blue-chip automotive art. Dealerships and private collectors report unprecedented demand for low-mileage modern classics.',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c'
  }
];

export const getNewsArticles = (req: Request, res: Response): void => {
  res.status(200).json({
    count: ARTICLES.length,
    articles: ARTICLES
  });
};
