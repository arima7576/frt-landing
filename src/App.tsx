import React, { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ManifestoBand } from './components/ManifestoBand';
import { Perspective } from './components/Perspective';
import { Disciplines } from './components/Disciplines';
import { ResearchProcess } from './components/ResearchProcess';
import { Team } from './components/Team';
import { Philosophy } from './components/Philosophy';
import { Horizon } from './components/Horizon';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useActiveSection } from './hooks/useActiveSection';

const OBSERVED_SECTIONS = ['perspective', 'what-we-do', 'process', 'team', 'contact'] as const;

export const App: React.FC = () => {
  const activeSection = useActiveSection(OBSERVED_SECTIONS);
  const [contactOpen, setContactOpen] = useState(false);

  const openAndScrollToContact = useCallback(() => {
    setContactOpen(true);
    const target = document.getElementById('contact');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="architectural-rails" aria-hidden="true">
        <div className="architectural-rails__inner">
          <div className="architectural-rails__frame">
            <div className="architectural-rails__mid" />
          </div>
        </div>
      </div>

      <Navbar activeSection={activeSection} onStartConversation={openAndScrollToContact} />

      <main id="main-content">
        <Hero />
        <ManifestoBand />
        <Perspective />
        <Disciplines />
        <ResearchProcess />
        <Team />
        <Philosophy />
        <Horizon />
        <Contact isOpen={contactOpen} onOpen={() => setContactOpen(true)} />
      </main>

      <Footer />
    </>
  );
};

export default App;
