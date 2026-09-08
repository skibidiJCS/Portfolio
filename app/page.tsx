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
  ['2025', 'North American Youth Chess Championship · Kingston', 'Participant', 'naycc-2025.jpg'],
];
const projects = [
  { name: 'LookLens', category: 'Hackathon', image: 'marihacks-ix-gemma.jpg', copy: 'Winner of Best Use of Google Gemma at MariHacks IX.', more: 'Built for Quebec’s first and largest hackathon for CEGEP and high school students.', link: 'https://devpost.com/software/looklens', label: 'Explore the project' },
  { name: 'Expo-sciences', category: 'Science · 2025–2026', image: 'expo-sciences.jpg', copy: 'From an idea to a technical solution.', more: 'SciMaTic project work in design, prototyping, testing, and presenting.' },
  { name: 'Mathematics', category: 'Problem solving', image: 'optimath-finalist.jpg', copy: 'AQJM finalist, 2023–2025. Optimath finalist, 2025.', more: 'Awarded a certificate of distinction at Optimath.' },
  { name: 'Dragon boat', category: 'Teamwork', image: 'dragon-boat.jpg', copy: '2nd and 3rd place in Montreal competitions.', more: 'Timing, endurance, and working together on the water.' },
];

export default function Home() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const scrollSections = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'));
    const travels = Array.from(document.querySelectorAll<HTMLElement>('[data-travel]'));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal')); 
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
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); };
  }, []);
  return <>
    <a className="skip-link" href="#about">Skip introduction</a>
    <header><a className="brand" href="#top">JCS</a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#community">Community</a></nav><a className="header-contact" href="#contact">Contact <ArrowUpRight size={16}/></a></header>
    <main>
      <section id="top" className="opening" data-scroll>
        <div className="opening-stage">
          <div className="intro-meta"><span>MONTRÉAL, QC</span></div>
          <h1><span className="first-name">Jiacai</span><span className="last-name">Song<span className="period">.</span></span></h1>
          <figure className="hero-portrait"><img src="/assets/hero-mountain.jpeg" alt="Jiacai in the mountains" fetchPriority="high"/></figure>
          <div className="intro-bottom"><p>Student at Sainte-Anne.<br/>Curious about what comes next.</p></div>
        </div>
      </section>
      <section className="about paper" id="about">
        <div className="about-layout"><h2 className="reveal">A little<br/><i>about me.</i></h2><div className="about-copy reveal"><p>I’m Jiacai, a Secondary 5 student at Collège Sainte-Anne de Lachine in Montreal.</p><p>I build things, compete in chess, and take on problems that make me think.</p></div></div>
        <div className="interests" data-travel aria-label="Interests"><div><span>Technology</span><span>Science</span><span>Chess</span><span>Community</span></div></div>
      </section>
      <section className="work" id="work">
        <div className="work-heading"><h2 className="reveal">Things I’ve<br/><i>been up to.</i></h2></div>
        <div className="work-list">{projects.map((project, index) => <article className={'work-story work-story-' + index} data-travel key={project.name}>
          <figure className="work-visual"><div className="photo-mat"><img src={'/assets/'+project.image} alt={project.name === 'LookLens' ? 'MariHacks IX winning team' : project.name} loading="lazy"/></div></figure>
          <div className="work-copy reveal"><span className="category">{project.category}</span><h3>{project.name}</h3><p>{project.copy}</p><p className="secondary">{project.more}</p>{project.link && <a className="project-link" href={project.link} target="_blank" rel="noreferrer">View LookLens <ArrowUpRight size={20}/></a>}</div>
        </article>)}</div>
      </section>
      <section className="chess-section" id="chess" data-travel>
        <div className="chess-heading"><h2 className="reveal">Across<br/><i>the board.</i></h2><p className="reveal">Chess competitions<br/>& major tournaments.</p></div>
        <div className="chess-gallery" data-travel>
          <figure className="chess-memory"><img src="/assets/chess-rapid-2024-3rd.jpg" alt="2024 Québec youth rapid chess podium" loading="lazy"/><figcaption><strong>3rd place</strong><span>Québec youth rapid · 2024</span></figcaption></figure>
          <figure className="chess-memory chess-memory-main"><img src="/assets/chess-rapid-2025-1st.jpg" alt="Full podium at the 2025 Québec youth rapid chess championship" loading="lazy"/><figcaption><strong>1st place</strong><span>Québec youth rapid · 2025</span></figcaption></figure>
          <figure className="chess-memory"><img src="/assets/team-quebec-ontario-2025-1st.jpg" alt="Québec team at the 2025 Québec versus Ontario tournament" loading="lazy"/><figcaption><strong>1st place</strong><span>Québec vs Ontario · 2025</span></figcaption></figure>
        </div>
        <div className="results">{results.map(([year,name,place,photo]) => <div className="result reveal" key={name+year}><span>{year}</span><h3>{name}</h3><strong>{place}</strong>{photo ? <a href={'/assets/'+photo} target="_blank" rel="noreferrer" aria-label={'View photo: '+name+' '+year}><ArrowUpRight size={19}/></a>:<span/>}</div>)}</div>
      </section>
      <section className="community" id="community" data-travel>
        <div className="community-heading"><h2 className="reveal">Showing up.<br/><i>Giving back.</i></h2><p className="reveal">Volunteering, in the hospital<br/>and out in the community.</p></div>
        <div className="community-stories">
          <article className="community-story" data-travel><div className="community-logo" data-travel><img src="/assets/muhc.png" alt="McGill University Health Centre" loading="lazy"/></div><div className="community-copy reveal"><span className="category">Healthcare</span><h3>McGill University<br/>Health Centre</h3><p>Contributing time in a healthcare environment where reliability matters.</p></div></article>
          <article className="community-story" data-travel><div className="community-logo" data-travel><img src="/assets/lachine.png" alt="Demi-marathon Lachine" loading="lazy"/></div><div className="community-copy reveal"><span className="category">Community sport</span><h3>Demi-marathon<br/>Lachine</h3><p>Supporting the event through on-site volunteering.</p></div></article>
        </div>
      </section>
      <footer id="contact" data-travel><a className="hello" href="mailto:jiacai.song.qc@gmail.com">Let’s talk.<ArrowUpRight/></a><div className="footer-bottom"><a href="mailto:jiacai.song.qc@gmail.com">jiacai.song.qc@gmail.com</a><div><a href="https://github.com/skibidiJCS" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jiacai-song-96612a39b/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><span>JIACAI SONG © 2026</span></div><div className="footer-checks" aria-hidden="true"/></footer>
    </main>
  </>;
}
