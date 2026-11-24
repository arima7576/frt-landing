export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface PerspectiveTenet {
  index: string;
  title: string;
  body: string;
}

export interface DisciplineArea {
  index: string;
  id: string;
  title: string;
  domainTag: string;
  summary: string;
  methodologyNote: string;
  focusAreas: string[];
}

export interface ProcessStage {
  index: string;
  id: string;
  title: string;
  summary: string;
  detail: string;
  artifactLabel: string;
  pillSpan: 'narrow' | 'medium' | 'wide';
}

export interface PhilosophyPrinciple {
  index: string;
  title: string;
  description: string;
}

export interface HorizonColumn {
  tag: string;
  status: 'Active' | 'Long-Term';
  title: string;
  description: string;
  items: string[];
}

export const COMPANY_INFO = {
  legalName: 'Fluid Research & Technologies Limited',
  shortName: 'FRT',
  companyNumber: '17600312',
  jurisdiction: 'Registered in England & Wales',
  sicFocus: 'Software Development (62012) · Natural Sciences & Engineering R&D (72190)',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Research', href: '#what-we-do', sectionId: 'what-we-do' },
  { label: 'Intelligence', href: '#process', sectionId: 'process' },
  { label: 'About', href: '#philosophy', sectionId: 'philosophy' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export const HERO_CONTENT = {
  eyebrow: 'Independent Quantitative Research & Applied Intelligence',
  headline: 'Finding the Edge\nin Complexity.',
  supporting:
    'We investigate complex markets, uncover overlooked opportunities, and build intelligent systems through quantitative research, advanced mathematics, and AI.',
  primaryCta: {
    label: 'Explore Our Approach',
    href: '#perspective',
  },
  secondaryCta: {
    label: 'Work With FRT',
    href: '#contact',
  },
  manifesto:
    'Fluid Research & Technologies Limited (FRT) is an independent research and engineering group built for hard questions. Mathematicians, software engineers, and analysts studying complex markets and real-world data to separate durable structure from noise.',
  domains: [
    { index: '01', label: 'Quantitative Research' },
    { index: '02', label: 'Applied AI & Intelligence' },
    { index: '03', label: 'Business Analytics' },
  ],
} as const;

export const PERSPECTIVE_CONTENT = {
  eyebrow: '01 / Our Perspective',
  headline: 'Better Questions.\nDeeper Research.\nDifferent Outcomes.',
  lead: 'Meaningful opportunities rarely sit on the surface. When everyone models the same conventions, consensus becomes a blind spot.',
  paragraphs: [
    'FRT approaches markets and complex operational systems from first principles. Before reaching for sophisticated machinery, we examine structural mechanics, incentives, and subtle anomalies others smooth over.',
    'Mathematics, computation, and AI are only as sharp as the questions behind them. We pair disciplined skepticism with deep empirical curiosity.',
  ],
  tenets: [
    {
      index: '01',
      title: 'First Principles',
      body: 'We begin with how a system actually behaves under tension, not how textbook conventions summarize it.',
    },
    {
      index: '02',
      title: 'Signal Over Noise',
      body: 'Complex data produces endless false patterns. Our focus lies in isolating relationships that persist out of sample.',
    },
    {
      index: '03',
      title: 'Discipline Over Speed',
      body: 'Speed without rigor amplifies error. We test hypotheses slowly enough to discover where they break.',
    },
  ] satisfies PerspectiveTenet[],
} as const;

export const DISCIPLINES_CONTENT = {
  eyebrow: '02 / What We Do',
  headline: 'Investigated from every angle.\nBuilt for precision.',
  subhead:
    'Three connected disciplines spanning financial market research, applied machine intelligence, and analytical clarity.',
  areas: [
    {
      index: '01',
      id: 'quantitative-research',
      title: 'Quantitative Research',
      domainTag: 'Financial Markets & Systematic Strategy',
      summary:
        'We study financial markets, investigate inefficiencies, and develop systematic strategies grounded in mathematical and statistical research.',
      methodologyNote:
        'Every hypothesis is framed as a falsifiable model tested across changing regimes, market frictions, and structural boundaries.',
      focusAreas: [
        'Market structure & behavioral asymmetry',
        'Mathematical & statistical modelling',
        'Systematic strategy architecture',
      ],
    },
    {
      index: '02',
      id: 'applied-ai-intelligence',
      title: 'Applied AI & Intelligence',
      domainTag: 'Analytical Systems & Decision Software',
      summary:
        'We build intelligent tools and analytical systems that turn complex information into actionable understanding.',
      methodologyNote:
        'Engineered for clarity under uncertainty—combining computational rigor, interpretability, and clean human decision workflows.',
      focusAreas: [
        'Custom analytical software & inference pipelines',
        'Applied machine learning under noisy regimes',
        'Decision-support infrastructure',
      ],
    },
    {
      index: '03',
      id: 'business-analytics',
      title: 'Business Analytics',
      domainTag: 'Applied Data Analysis & Clarity',
      summary:
        'We help businesses uncover patterns, understand performance, identify opportunities, and make better-informed decisions through advanced data analysis.',
      methodologyNote:
        'Surface metrics obscure true leverage. We decompose operational performance down to the structural drivers that change outcomes.',
      focusAreas: [
        'Diagnostic performance decomposition',
        'Operational bottleneck & opportunity discovery',
        'Evidence-backed strategic guidance',
      ],
    },
  ] satisfies DisciplineArea[],
} as const;

export const PROCESS_CONTENT = {
  eyebrow: '03 / Our Research Process',
  headline: 'From Observation\nto Evidence.',
  subhead:
    'Ideas carry no authority until they survive empirical challenge. Our five-stage workflow keeps curiosity anchored to discipline.',
  stages: [
    {
      index: '01',
      id: 'observe',
      title: 'Observe',
      summary: 'Understand the environment and identify meaningful questions.',
      detail:
        'Every inquiry starts by examining raw data, structural frictions, and real system behavior closely enough to notice what aggregated summaries hide.',
      artifactLabel: 'Domain Mapping & Anomaly Detection',
      pillSpan: 'narrow',
    },
    {
      index: '02',
      id: 'hypothesize',
      title: 'Hypothesize',
      summary: 'Develop ideas and investigate potential opportunities.',
      detail:
        'Observations become crisp, falsifiable statements: why a relationship should hold, under what conditions it breaks, and what evidence would disprove it.',
      artifactLabel: 'Causal Framing & Falsifiable Claims',
      pillSpan: 'medium',
    },
    {
      index: '03',
      id: 'model',
      title: 'Model',
      summary: 'Translate hypotheses into mathematical and computational models.',
      detail:
        'We formalize intuition into parsimonious mathematical, statistical, or machine-learning structures built for stability over parameter complexity.',
      artifactLabel: 'Mathematical Formalization',
      pillSpan: 'wide',
    },
    {
      index: '04',
      id: 'test',
      title: 'Test',
      summary: 'Evaluate strategies using data and rigorous testing.',
      detail:
        'Models face out-of-sample evaluation, stress perturbations, and adversarial checks designed to expose overfitting and fragile assumptions.',
      artifactLabel: 'Out-of-Sample Stress Evaluation',
      pillSpan: 'medium',
    },
    {
      index: '05',
      id: 'validate',
      title: 'Validate',
      summary: 'Challenge assumptions and assess whether findings hold up.',
      detail:
        'Before any finding informs a system or strategy, we audit edge cases, structural breaks, and hidden biases to verify durability.',
      artifactLabel: 'Independent Audit & Structural Review',
      pillSpan: 'wide',
    },
  ] satisfies ProcessStage[],
} as const;

export const PHILOSOPHY_CONTENT = {
  eyebrow: '04 / The Thinking Behind FRT',
  headline: 'Curiosity Is the Starting Point.\nEvidence Is the Standard.',
  lead: 'Good research requires the imagination to question consensus—and the honesty to abandon your own best hypothesis when evidence disagrees.',
  body: 'FRT operates as an independent research laboratory and intelligence group. We avoid hype cycles, fabricated certainty, and marketing theater. Across financial research and applied analytics, our standard remains constant: know precisely what the data supports, state uncertainty plainly, and let proof outlast opinion.',
  axioms: [
    'First Principles',
    'Falsifiability',
    'Out-of-Sample Discipline',
    'Structural Asymmetry',
    'Signal Separation',
    'Intellectual Honesty',
    'Continuous Calibration',
  ] as const,
  principles: [
    {
      index: '01',
      title: 'Intellectual Honesty',
      description:
        'We document assumptions openly, interrogate failure modes, and never blur exploratory ideas with proven results.',
    },
    {
      index: '02',
      title: 'Independent Thinking',
      description:
        'Crowded models share blind spots. We investigate overlooked variables and non-obvious structural relationships.',
    },
    {
      index: '03',
      title: 'Rigorous Experimentation',
      description:
        'Experimental hygiene outweighs model scale. Every finding is audited against data leakage, selection bias, and fragility.',
    },
    {
      index: '04',
      title: 'Continuous Learning',
      description:
        'Markets and operating environments shift continuously; our mathematics, tooling, and mental models adapt in stride.',
    },
  ] satisfies PhilosophyPrinciple[],
} as const;

export const HORIZON_CONTENT = {
  eyebrow: '05 / Future Direction',
  headline: 'Built for\nLong-Term Depth.',
  intro:
    'We draw an explicit line between FRT’s current research operations and the proprietary testing phase we are building toward.',
  columns: [
    {
      tag: 'Current Operations',
      status: 'Active',
      title: 'Research, Intelligence Systems & Analytics',
      description:
        'Today, FRT focuses on independent quantitative research, building applied AI and analytical software, and supporting organizations on complex data problems.',
      items: [
        'Mathematical & statistical investigation across financial markets',
        'Architecture of custom applied AI tools and analytical pipelines',
        'Diagnostic data analysis and decision-support software for organizations',
      ],
    },
    {
      tag: 'Longer-Term Ambition',
      status: 'Long-Term',
      title: 'Proprietary Live-Market Testing',
      description:
        'As our research architecture and validation standards mature, FRT intends to evaluate selected internally developed strategies using solely our own capital under real market conditions.',
      items: [
        'Internal-capital testing reserved strictly for thoroughly validated models',
        'Disciplined transition from controlled simulation to live environments',
        'Not FCA-regulated — does not offer brokerage, investment advice, signals, or public funds',
      ],
    },
  ] satisfies HorizonColumn[],
} as const;

export const CONTACT_CONTENT = {
  eyebrow: '06 / Contact',
  headline: 'Have a Complex Problem\nWorth Exploring?',
  supporting:
    "We're interested in thoughtful conversations, challenging questions, and opportunities where deeper analysis can make a difference.",
  ctaLabel: 'Get in Touch',
  inquiryScopes: [
    'Applied AI & Intelligence Systems',
    'Business Analytics & Decision Support',
    'Quantitative Research Collaboration',
    'General / Exploratory Conversation',
  ] as const,
} as const;
