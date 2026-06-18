import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Youtube, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link } from 'wouter';
import img1 from '@assets/06ec4f01-0017-4bc0-8377-2d6c7d4c614b_1781245310783.png';
import img2 from '@assets/1cf441dd-30c5-47a9-a3ba-c808e2a7a2c4_1781245310783.png';

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-green-400 text-sm font-semibold tracking-wide py-3">
        ✓ You're in. Watch your inbox for sneak peeks.
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL ADDRESS"
        required
        data-testid="input-newsletter-email"
        className="bg-background border border-border rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        data-testid="button-newsletter-subscribe"
        className="bg-primary text-white font-bold tracking-widest text-sm uppercase px-4 py-3 rounded-md border border-white/20 transition-all hover:bg-zinc-900 disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-primary text-xs">Something went wrong — try again.</p>
      )}
    </form>
  );
}

const projectImages = [
  { src: img2, caption: 'Captain Hollow Empire — Official Logo' },
  { src: img1, caption: 'Captain Hollow\'s Ottoman Empire — Original 1990 Print Ad' },
];

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + projectImages.length) % projectImages.length);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % projectImages.length);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prevImage, nextImage]);

  // Smooth scroll to anchor
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
            data-testid="lightbox-overlay"
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-10"
              onClick={closeLightbox}
              data-testid="lightbox-close"
            >
              <X size={32} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 font-bangers text-xl text-white/50 tracking-widest z-10">
              {lightboxIndex + 1} / {projectImages.length}
            </div>

            {/* Prev */}
            {projectImages.length > 1 && (
              <button
                className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                data-testid="lightbox-prev"
              >
                <ChevronLeft size={40} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[80vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={projectImages[lightboxIndex].src}
                alt={projectImages[lightboxIndex].caption}
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)]"
                data-testid="lightbox-image"
              />
              <p className="text-white/60 text-sm font-semibold tracking-wider uppercase text-center">
                {projectImages[lightboxIndex].caption}
              </p>
            </motion.div>

            {/* Next */}
            {projectImages.length > 1 && (
              <button
                className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                data-testid="lightbox-next"
              >
                <ChevronRight size={40} />
              </button>
            )}

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {projectImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${i === lightboxIndex ? 'border-primary scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                  data-testid={`lightbox-thumb-${i}`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-border py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" onClick={(e) => handleScroll(e, '#top')} className="logo group hover-glitch glow-accent transition-all duration-300">
            <div className="font-marker text-2xl md:text-3xl tracking-widest text-white glow-accent glow-accent-hover">
              ShadowPixel
              <span className="font-bangers text-3xl md:text-4xl tracking-[0.2em] block leading-none -mt-1">
                STUDIOS
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="relative text-muted-foreground hover:text-white font-semibold text-sm uppercase tracking-widest transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[85px] left-0 w-full bg-card border-b border-border z-40 overflow-hidden"
          >
            <ul className="flex flex-col py-6 px-6 gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="text-white font-bangers text-2xl uppercase tracking-widest block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="top" className="hero hero-gradient relative pt-[160px] pb-[120px] px-6 text-center overflow-hidden min-h-[90vh] flex items-center justify-center">
        <div className="hero-glows pointer-events-none" />
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.h1 
            variants={fadeUpVariant}
            className="font-marker text-6xl md:text-[5rem] lg:text-[7rem] text-white leading-[1.1] tracking-wider mb-0 hover-glitch cursor-default"
            style={{ textShadow: '3px 3px 0 #000' }}
          >
            ShadowPixel
          </motion.h1>
          <motion.h2 
            variants={fadeUpVariant}
            className="font-bangers text-7xl md:text-[7rem] lg:text-[9rem] text-white tracking-[0.2em] md:tracking-[0.3em] leading-none mb-8"
            style={{ textShadow: '3px 3px 0 #000' }}
          >
            STUDIOS
          </motion.h2>
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Indie game development studio defined by raw street-art energy and cutting-edge technology. We build bold, loud, and unapologetically creative experiences.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="#projects" onClick={(e) => handleScroll(e, '#projects')} className="group relative inline-block px-10 py-4 bg-primary text-white font-bold uppercase tracking-widest overflow-hidden border border-white/20 transition-transform duration-300 hover:-translate-y-1">
              <span className="relative z-10">Our Games</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_0.8s_forwards]" />
            </a>
            <a href="#about" onClick={(e) => handleScroll(e, '#about')} className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-background">
              Studio Manifest
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}>
          <h2 className="font-bangers text-5xl md:text-6xl text-center text-white tracking-[0.1em] uppercase mb-4">The Garage</h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">Where reality fractures and creativity bleeds.</p>
          <div className="w-20 h-1 bg-primary mx-auto mb-16" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="space-y-6">
            <h3 className="font-marker text-primary text-3xl md:text-4xl">We Don't Play Safe.</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Founded in the underground, ShadowPixel Studios is a rebellious collective of artists, coders, and storytellers. We believe games shouldn't just be played—they should leave a mark.
            </p>
            <div className="space-y-4 mt-8">
              {[
                { icon: "💀", text: "Visceral Storytelling" },
                { icon: "⚡", text: "Electric Atmosphere" },
                { icon: "🎮", text: "Unforgiving Gameplay" },
                { icon: "🎨", text: "Raw Street-Art Aesthetic" }
              ].map((val, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-card border-l-4 border-primary rounded-r-lg transition-transform duration-300 hover:translate-x-2 hover:bg-card/80">
                  <span className="text-2xl">{val.icon}</span>
                  <span className="font-bold tracking-wide">{val.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }} className="grid grid-cols-2 gap-6">
            {[
              { num: "1", label: "Active Project" },
              { num: "25+", label: "Team Members" },
              { num: "2024", label: "Founded" },
              { num: "∞", label: "Creative Energy" }
            ].map((stat, i) => (
              <div key={i} className="bg-card p-8 rounded-xl border border-border text-center transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="font-bangers text-5xl md:text-6xl text-primary tracking-wider leading-none mb-2">{stat.num}</div>
                <div className="text-muted-foreground text-sm uppercase tracking-[0.15em] font-semibold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 md:px-12 max-w-7xl mx-auto bg-[#0f0f0f]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}>
          <h2 className="font-bangers text-5xl md:text-6xl text-center text-white tracking-[0.1em] uppercase mb-4">Latest Drop</h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">Enter if you dare.</p>
          <div className="w-20 h-1 bg-primary mx-auto mb-16" />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl overflow-hidden border border-border transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] group">
            <div
              className="h-[350px] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2a0845] to-[#0a0a0a] cursor-pointer"
              onClick={() => openLightbox(0)}
              data-testid="project-image-area"
            >
              <span className="text-8xl grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 relative z-10">🚪</span>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.1%22/%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
              {/* View images hint */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 text-white/70 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <ZoomIn size={13} /> View Images
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">Psychological Horror</span>
              <h3 className="font-bangers text-4xl md:text-5xl text-white tracking-[0.05em] mb-4">THE ENDLESS ROOMS</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                A psychological horror experience where reality fractures with every door you open. Navigate an ever-shifting liminal space that feeds on your anxiety. The architecture is impossible. The silence is deafening. Don't look back.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="px-8 py-3 bg-transparent border-2 border-border text-white rounded-md font-semibold uppercase tracking-wider text-sm transition-all hover:bg-primary hover:border-primary"
                  onClick={() => openLightbox(0)}
                  data-testid="button-view-details"
                >
                  View Details
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-border text-white rounded-md font-semibold uppercase tracking-wider text-sm transition-all hover:bg-white hover:border-white hover:text-background">
                  Wishlist Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card pt-20 pb-10 px-6 md:px-12 border-t border-border mt-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-4">
            <h4 className="font-bangers text-2xl text-white tracking-widest mb-6">SHADOWPIXEL STUDIOS</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Independent game development from the underground. We make the games your mother warned you about.
            </p>
            <div className="flex gap-3">
              <a href="https://www.youtube.com/@ShadowPixelStudiosOwner" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-white transition-all hover:-translate-y-1" data-testid="link-youtube"><Youtube size={18} /></a>
              <a href="https://tiktok.com/@shadowpixelstudios" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-white transition-all hover:-translate-y-1" data-testid="link-tiktok"><SiTiktok size={16} /></a>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-bangers text-xl text-white tracking-widest mb-6">NAVIGATE</h4>
            <ul className="space-y-3">
              <li><a href="#about" onClick={(e) => handleScroll(e, '#about')} className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#projects" onClick={(e) => handleScroll(e, '#projects')} className="text-muted-foreground hover:text-primary text-sm transition-colors">Games</a></li>
              <li><a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bangers text-xl text-white tracking-widest mb-6">LEGAL</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Press Kit</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-bangers text-xl text-white tracking-widest mb-6">JOIN THE CULT</h4>
            <p className="text-muted-foreground text-sm mb-4">Subscribe for sneak peeks, beta access codes, and studio updates.</p>
            <NewsletterForm />
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground text-xs">&copy; {new Date().getFullYear()} ShadowPixel Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
