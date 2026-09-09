'use client';

import { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

const results = [
  ['2025', 'Championnat jeunesse du Québec · Rapid', '1st place', 'chess-rapid-2025-1st.jpg'],
  ['2025', 'Québec vs Ontario · Team tournament', '1st place', 'team-quebec-ontario-2025-1st.jpg'],
  ['2025', 'Championnat jeunesse du Québec', '2nd place', ''],
  ['2024', 'Championnat jeunesse du Québec · Rapid', '3rd place', 'chess-rapid-2024-3rd.jpg'],
  ['2024', 'Québec vs Ontario · Team tournament', '2nd place', ''],
  ['2024–25', 'Canadian Youth Chess Championship', 'Participant', 'cycc-2025.jpg'],
  ['2025', 'North American Youth Chess Championship', 'Participant', 'naycc-2025.jpg'],
];
const projects = [
  { name: 'LookLens', category: 'Hackathon', image: 'marihacks-ix-gemma.jpg', copy: 'Our team won Best Use of Google Gemma at MariHacks IX.', more: 'We built LookLens during a hackathon for high school and CEGEP students.', link: 'https://devpost.com/software/looklens' },
  { name: 'Expo-sciences', category: 'Science · 2025–2026', image: 'expo-sciences.jpg', copy: 'My science project for the SciMaTic program.', more: 'The work includes designing a prototype, testing it, and presenting the results.' },
  { name: 'Mathematics', category: 'Problem solving', image: 'optimath-finalist.jpg', copy: 'AQJM finalist, 2023–2025. Optimath finalist, 2025.', more: 'Awarded a certificate of distinction at Optimath.' },
];

export default function Home() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const scrollSections = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'));
    const travels = Array.from(document.querySelectorAll<HTMLElement>('[data-travel]'));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal')); 
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    resetScroll();
    window.addEventListener('pageshow', resetScroll);
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      scrollSections.forEach(el => {
        const rect = el.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - height)));
        el.style.setProperty('--progress', reduced.matches ? '0' : String(progress));
      });
      travels.forEach(el => {
        const rect = el.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
        el.style.setProperty('--travel', reduced.matches ? '.5' : String(progress));
        const entrance = Math.max(0, Math.min(1, (height - rect.top) / (height * .65)));
        el.style.setProperty('--entrance', reduced.matches ? '1' : String(entrance));
      });
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < height * .93) el.classList.add('visible');
      });
      const total = document.documentElement.scrollHeight - height;
      document.documentElement.style.setProperty('--read', `${total > 0 ? window.scrollY / total * 100 : 0}%`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('pageshow', resetScroll); history.scrollRestoration = previousRestoration; reduced.removeEventListener('change', schedule); };
  }, []);
  return <>
    <a className="skip-link" href="#about">Skip introduction</a>
    <header><a className="brand" href="#top">JCS</a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#community">Community</a></nav><a className="header-contact" href="#contact">Contact <ArrowUpRight size={16}/></a></header>
    <main>
      <section id="top" className="opening" data-scroll>
        <div className="opening-stage">
          <h1><span className="first-name">Jiacai</span><span className="last-name">Song</span></h1>
          <figure className="hero-portrait"><img src="/assets/hero-mountain.jpeg" alt="Jiacai in the mountains" fetchPriority="high"/></figure>
          <div className="intro-bottom"><p>Student at Sainte-Anne<br/>Interested in science and technology</p></div>
        </div>
      </section>
      <section className="about paper" id="about">
        <div className="about-layout"><h2 className="reveal">A little <i>about me</i></h2><div className="about-copy reveal"><p>I’m Jiacai, a Secondary 5 student at Collège Sainte-Anne de Lachine in Montreal.</p><p>I work on science and coding projects, play competitive chess, and volunteer locally.</p></div></div>
        <div className="interests" data-travel aria-label="Interests"><div><span>Technology</span><span>Science</span><span>Chess</span><span>Community</span></div></div>
      </section>
      <section className="work work-cinema" id="work">
        <div className="work-heading"><h2 className="reveal">Projects <i>& activities</i></h2></div>
        <div className="work-list">{projects.map((project, index) => <article className={'project-scroll project-scroll-' + index} data-scroll data-travel key={project.name}><div className="project-scene">
          <figure className="work-visual"><div className="photo-mat"><img src={'/assets/'+project.image} alt={project.name === 'LookLens' ? 'MariHacks IX winning team' : project.name} loading="lazy"/></div></figure>
          <div className="work-copy reveal"><h3>{project.name}</h3><p>{project.copy}</p><p className="secondary">{project.more}</p>{project.link && <a className="project-link" href={project.link} target="_blank" rel="noreferrer">View LookLens <ArrowUpRight size={20}/></a>}</div>
        </div></article>)}</div>
      </section>
      <section className="chess-section" id="chess" data-travel>
        <div className="chess-heading"><h2 className="reveal">Chess <i>results</i></h2><p className="reveal">Chess competitions & major tournaments</p></div>
        <div className="chess-gallery" data-travel>
          <figure className="chess-memory"><img src="/assets/chess-rapid-2024-3rd.jpg" alt="2024 Québec youth rapid chess podium" loading="lazy"/><figcaption><div className="print-heading"><strong>3rd place</strong><span>2024</span></div><span>Québec youth rapid</span></figcaption></figure>
          <figure className="chess-memory chess-memory-main"><img src="/assets/chess-rapid-2025-1st.jpg" alt="Full podium at the 2025 Québec youth rapid chess championship" loading="lazy"/><figcaption><div className="print-heading"><strong>1st place</strong><span>2025</span></div><span>Québec youth rapid</span></figcaption></figure>
          <figure className="chess-memory"><img src="/assets/team-quebec-ontario-2025-1st.jpg" alt="Québec team at the 2025 Québec versus Ontario tournament" loading="lazy"/><figcaption><div className="print-heading"><strong>1st place</strong><span>2025</span></div><span>Québec vs Ontario</span></figcaption></figure>
        </div>
        <div className="chess-album">{results.filter(result => result[2] === 'Participant').map(([year,name,,photo]) => <div className="album-entry" data-travel key={name}><figure className="album-print">
          <a href={'/assets/'+photo} target="_blank" rel="noreferrer" aria-label={'View photo: '+name}><img src={'/assets/'+photo} alt={name} loading="lazy"/></a>
          <figcaption><div className="print-heading"><strong>{name.startsWith('Canadian') ? 'CYCC' : 'NAYCC'}</strong><span>{year}</span></div><span>{name}</span><span className="print-location">{name.startsWith('Canadian') ? 'Vancouver' : 'Kingston'}</span></figcaption>
        </figure></div>)}</div>
      </section>
      <section className="community community-connected" id="community" data-travel>
        <div className="community-heading"><h2 className="reveal">Volunteering</h2><p className="reveal">At the MUHC and the Demi-marathon Lachine.</p></div>
        <div className="community-stories">
          <svg className="community-thread" viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M250 0 C50 150 50 330 400 340 S950 570 730 800"/></svg>
          <article className="community-story" data-travel><div className="community-logo" data-travel><img src="/assets/muhc.png" alt="McGill University Health Centre" loading="lazy"/></div><div className="community-copy reveal"><h3>McGill University Health Centre</h3><p>I volunteer at the MUHC, helping out in a hospital setting.</p></div></article>
          <article className="community-story" data-travel><div className="community-logo" data-travel><img src="/assets/lachine.png" alt="Demi-marathon Lachine" loading="lazy"/></div><div className="community-copy reveal"><h3>Demi-marathon Lachine</h3><p>I helped on site as a volunteer at the Demi-marathon Lachine.</p></div></article>
        </div>
      </section>
      <footer id="contact" data-travel><a className="hello" href="mailto:jiacai.song.qc@gmail.com">Contact<ArrowUpRight/></a><div className="footer-bottom"><a href="mailto:jiacai.song.qc@gmail.com">jiacai.song.qc@gmail.com</a><div><a href="https://github.com/skibidiJCS" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jiacai-song-96612a39b/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><span>JIACAI SONG © 2026</span></div><div className="footer-checks" aria-hidden="true"/></footer>
    </main>
  </>;
}
