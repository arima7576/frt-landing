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

export interface TeamMember {
  index: string;
  name: string;
  role?: string;
  discipline: string;
  summary: string;
  education: string;
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
  { label: 'Process', href: '#process', sectionId: 'process' },
  { label: 'Team', href: '#team', sectionId: 'team' },
  { label: 'About', href: '#perspective', sectionId: 'perspective' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export const HERO_CONTENT = {
  eyebrow: 'Independent Quantitative Research & Applied AI',
  headline: 'Finding the Edge\nin Complexity.',
  supporting:
    'Independent quantitative research and applied AI, transforming complex data into rigorous insights, intelligent tools, and practical solutions.',
  primaryCta: {
    label: 'Explore Our Work',
    href: '#what-we-do',
  },
  manifesto:
    'Fluid Research & Technologies Limited (FRT) is an independent quantitative research and applied AI company. Combining mathematics, statistics, financial research, data science, and AI, we turn deep research into practical tools, clear insights, and durable solutions.',
  domains: [
    { index: '01', label: 'Quantitative Research' },
    { index: '02', label: 'Applied AI & Data Science' },
    { index: '03', label: 'Business Intelligence & Analytical Solutions' },
  ],
} as const;

export const PERSPECTIVE_CONTENT = {
  eyebrow: '01 / About FRT',
  headline: 'Independent Research.\nApplied Intelligence.\nPractical Solutions.',
  lead: 'Fluid Research & Technologies Limited (FRT) is an independent quantitative research and applied AI company built to investigate complex systems from first principles.',
  paragraphs: [
    'We bring together mathematics, statistics, financial research, data science, and artificial intelligence within a single disciplined research practice—looking beyond conventional surface metrics where real structural patterns are often overlooked.',
    'Rather than keeping analysis confined to theory, FRT translates complex research into practical tools, reliable insights, and operational solutions for demanding analytical problems.',
  ],
  tenets: [
    {
      index: '01',
      title: 'Mathematical Rigour',
      body: 'Every investigation begins with formal structure, examining how systems behave under real constraints rather than relying on surface heuristics.',
    },
    {
      index: '02',
      title: 'Signal Over Noise',
      body: 'High-dimensional datasets generate abundant coincidence. Our work centres on isolating relationships that hold up out of sample.',
    },
    {
      index: '03',
      title: 'Practical Translation',
      body: 'Research only creates value when it becomes usable. We build clear analytical software, decision-support tools, and actionable frameworks.',
    },
  ] satisfies PerspectiveTenet[],
} as const;

export const DISCIPLINES_CONTENT = {
  eyebrow: '02 / Research & Capabilities',
  headline: 'Investigated from every angle.\nBuilt for precision.',
  subhead:
    'Our capabilities span three interconnected areas—uniting quantitative market research, applied AI engineering, and bespoke business intelligence.',
  areas: [
    {
      index: '01',
      id: 'quantitative-research',
      title: 'Quantitative Research',
      domainTag: 'Financial Markets & Mathematical Modelling',
      summary:
        'Capabilities in systematic financial research, mathematical modelling, and rigorous empirical analysis across complex market environments.',
      methodologyNote:
        'Structured around falsifiable hypotheses, statistical precision, and careful attention to regime behaviour and risk.',
      focusAreas: [
        'Financial market research',
        'Statistical modelling',
        'Systematic strategy research',
        'Market structure and inefficiency analysis',
        'Risk and portfolio analytics',
      ],
    },
    {
      index: '02',
      id: 'applied-ai-data-science',
      title: 'Applied AI & Data Science',
      domainTag: 'Machine Learning & Analytical Software',
      summary:
        'Capabilities in designing and engineering machine learning models, predictive pipelines, and practical AI-powered analytical software.',
      methodologyNote:
        'Built for interpretability, stability under noisy inputs, and seamless integration into analytical workflows.',
      focusAreas: [
        'Machine learning',
        'Predictive modelling',
        'AI-powered analytical tools',
        'Data processing and analysis',
        'Intelligent automation',
      ],
    },
    {
      index: '03',
      id: 'business-intelligence-solutions',
      title: 'Business Intelligence & Analytical Solutions',
      domainTag: 'Decision Support & Consulting',
      summary:
        'Capabilities focused on turning complex operational and commercial data into tailored analytical systems, reporting, and decision clarity.',
      methodologyNote:
        'Designed to help organisations isolate true performance drivers, uncover overlooked opportunities, and act on clear evidence.',
      focusAreas: [
        'Bespoke analytical solutions',
        'Business data intelligence',
        'Research-led consulting',
        'Advanced reporting and analytics',
        'Data-driven decision support',
      ],
    },
  ] satisfies DisciplineArea[],
} as const;

export const PROCESS_CONTENT = {
  eyebrow: '03 / Research Process',
  headline: 'From Observation\nto Evidence.',
  subhead:
    'Ideas carry no authority until they survive empirical scrutiny. Our five-stage methodology keeps curiosity anchored to falsifiable evidence.',
  stages: [
    {
      index: '01',
      id: 'observe',
      title: 'Observe',
      summary: 'Interrogate raw data distributions, market microstructure, and system dynamics.',
      detail:
        'We examine primary datasets and underlying mechanics directly—identifying structural anomalies, regime shifts, and subtle frictions that aggregated summaries routinely obscure.',
      artifactLabel: 'Empirical Audit & Anomaly Discovery',
      pillSpan: 'narrow',
    },
    {
      index: '02',
      id: 'hypothesize',
      title: 'Hypothesize',
      summary: 'Formulate explicit, falsifiable mechanisms grounded in domain structure.',
      detail:
        'Observations are distilled into precise causal or statistical propositions: defining why an inefficiency or relationship should exist, its boundary conditions, and clear refutation criteria.',
      artifactLabel: 'Falsifiable Mechanism Framing',
      pillSpan: 'medium',
    },
    {
      index: '03',
      id: 'model',
      title: 'Model',
      summary: 'Formalise hypotheses into parsimonious mathematical and computational architectures.',
      detail:
        'We construct statistical, stochastic, or machine-learning specifications optimised for structural stability, parameter economy, and resistance to high-dimensional overfitting.',
      artifactLabel: 'Mathematical & Algorithmic Specification',
      pillSpan: 'wide',
    },
    {
      index: '04',
      id: 'test',
      title: 'Test',
      summary: 'Subject models to out-of-sample evaluation, stress perturbation, and friction checks.',
      detail:
        'Candidate models undergo walk-forward testing, sensitivity sweeps, and adversarial diagnostics designed to uncover data leakage, survivorship bias, or fragile assumptions.',
      artifactLabel: 'Out-of-Sample & Stress Diagnostics',
      pillSpan: 'medium',
    },
    {
      index: '05',
      id: 'validate',
      title: 'Validate',
      summary: 'Audit robustness across edge cases and non-stationary regimes before deployment.',
      detail:
        'Before any model informs an analytical system or strategy, assumptions are challenged against distribution shifts, execution realities, and statistical significance thresholds.',
      artifactLabel: 'Structural Audit & Robustness Review',
      pillSpan: 'wide',
    },
  ] satisfies ProcessStage[],
} as const;

export const TEAM_CONTENT = {
  eyebrow: '04 / Team',
  headline: 'Experience-Led.\nMultidisciplinary Depth.',
  subhead:
    'A multidisciplinary research and engineering team combining trading experience, financial research, applied machine learning, complex systems, and mathematical rigour.',
  members: [
    {
      index: '01',
      name: 'Siavash Khajjat',
      discipline: 'Quantitative Research & Machine Learning',
      summary:
        'Works across quantitative research, machine learning, data science, and model validation—applying statistical and systems-engineering discipline to empirical testing.',
      education:
        'MSc Statistics with Data Science, University of Warwick · BEng Avionics Systems (First Class Honours), University of Liverpool',
    },
    {
      index: '02',
      name: 'Khashayar Rahimi',
      discipline: 'Quantitative Analysis & Applied AI',
      summary:
        'Focuses on quantitative analysis, financial calculus, applied machine learning, and AI research—translating formal mathematical methods into practical computational models.',
      education:
        'MSc Mathematics (Geometric Algebra & Topology), Amirkabir University of Technology · BSc Pure Mathematics, Shahid Beheshti University',
    },
    {
      index: '03',
      name: 'Ghazaleh Asgari',
      discipline: 'Mathematics & Quantitative Research',
      summary:
        'Brings specialist mathematical expertise and deep research foundations across pure mathematics and physics, supporting quantitative research and trading analysis.',
      education:
        'PhD Mathematics, University of Reading · MSc Mathematics, ETH Zurich · MSc & BSc Physics, Sharif University of Technology',
    },
    {
      index: '04',
      name: 'Ali Hosseinzadeh',
      discipline: 'Complex Systems & Systematic Risk',
      summary:
        'Researches complex systems, financial physics, financial bubble networks, and systematic risk analysis—examining structural fragility and interconnected market behaviour.',
      education:
        'PhD Econophysics, Shahid Beheshti University · MSc Mathematical Physics, Kharazmi University',
    },
    {
      index: '05',
      name: 'Aria Heydari',
      role: 'Founder',
      discipline: 'Trading & Financial Markets Research',
      summary:
        'Brings nine years of trading and financial research experience alongside background as an investment banking analyst, spanning ETFs, commodities, derivatives, foreign exchange, and digital finance.',
      education: "Master's in Finance and Economics",
    },
  ] satisfies TeamMember[],
} as const;

export const PHILOSOPHY_CONTENT = {
  eyebrow: '05 / Ethos',
  headline: 'Curiosity Is the Starting Point.\nEvidence Is the Standard.',
  lead: 'Sound research requires the independence to question consensus—and the intellectual honesty to discard a promising idea when the evidence disagrees.',
  body: 'FRT operates with quiet concentration rather than spectacle. Whether investigating financial dynamics or engineering analytical tools for commercial partners, our standard remains consistent: state assumptions clearly, measure uncertainty honestly, and build systems that hold up under scrutiny.',
  axioms: [
    'First Principles',
    'Falsifiability',
    'Out-of-Sample Rigour',
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
        'We document assumptions openly, interrogate failure modes, and never blur exploratory hypotheses with validated findings.',
    },
    {
      index: '02',
      title: 'Independent Thinking',
      description:
        'Consensus models converge on shared blind spots. We examine overlooked variables and structural relationships from first principles.',
    },
    {
      index: '03',
      title: 'Rigorous Experimentation',
      description:
        'Experimental discipline outweighs model scale. Every result is audited against leakage, selection bias, and parameter fragility.',
    },
    {
      index: '04',
      title: 'Continuous Learning',
      description:
        'Markets and operational environments evolve continuously; our mathematical methods, software tooling, and perspectives evolve with them.',
    },
  ] satisfies PhilosophyPrinciple[],
} as const;

export const HORIZON_CONTENT = {
  eyebrow: '06 / Future Direction',
  headline: 'Built for\nLong-Term Depth.',
  intro:
    'Alongside our core research and technology activities, FRT maintains a measured long-term roadmap for internal quantitative strategy validation.',
  columns: [
    {
      tag: 'Core Activities',
      status: 'Active',
      title: 'Quantitative Research, Applied AI & Analytical Solutions',
      description:
        'FRT’s primary focus sits across quantitative market research, machine learning and AI-powered analytical software, and research-led business intelligence solutions.',
      items: [
        'Independent mathematical and statistical research across markets and complex data',
        'Design and engineering of bespoke AI-powered analytical tools and automation',
        'Commercial analytics, decision support, and research-led consulting',
      ],
    },
    {
      tag: 'Complementary Future Research',
      status: 'Long-Term',
      title: 'Proprietary Quantitative Strategy Testing',
      description:
        'As our internal research infrastructure matures, selected quantitative strategies may be researched and tested using the company’s own capital.',
      items: [
        'Complementary to FRT’s core research, applied AI, and analytical technology activities',
        'Internal capital testing reserved strictly for models passing rigorous empirical validation',
        'Focused on long-term scientific depth and disciplined real-world evaluation',
      ],
    },
  ] satisfies HorizonColumn[],
} as const;

export const CONTACT_CONTENT = {
  eyebrow: '07 / Contact',
  headline: 'Discuss a Project\nor Research Enquiry.',
  supporting:
    'We welcome commercial enquiries, technical challenges, and research conversations where rigorous quantitative thinking and applied AI can create clarity.',
  ctaLabel: 'Start an Enquiry',
  enquiryTopics: [
    'Research collaborations',
    'Business analytics projects',
    'Applied AI development',
    'Quantitative research',
    'Strategic partnerships',
  ] as const,
} as const;
