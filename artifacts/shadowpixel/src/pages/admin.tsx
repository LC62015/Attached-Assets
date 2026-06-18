import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Send, Newspaper, Gamepad2, Image, FileText,
  Trash2, Zap, Mail, LogOut, PlusCircle, ChevronRight
} from 'lucide-react';

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const PASS = '3456';

interface SneakPeek { id: number; title: string; description: string; imageUrl: string | null; createdAt: string; }
interface NewsItem { id: number; title: string; content: string; createdAt: string; }
interface Project { id: number; name: string; description: string; genre: string | null; status: string | null; imageUrl: string | null; createdAt: string; }
type Tab = 'blast' | 'news' | 'projects' | 'peeks';

function FieldInput({ label, icon, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {icon} {label}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
      />
    </div>
  );
}

function FieldTextarea({ label, icon, value, onChange, placeholder, rows = 4, required = false }: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; required?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {icon} {label}
      </label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows} required={required}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors resize-none"
      />
    </div>
  );
}

function StatusBanner({ result }: { result: { type: 'success' | 'error'; message: string } | null }) {
  if (!result) return null;
  return (
    <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${result.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-white/5 border border-white/20 text-white/70'}`}>
      {result.message}
    </div>
  );
}

function SubmitBtn({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel?: string }) {
  return (
    <button type="submit" disabled={loading}
      className="flex items-center gap-2 px-8 py-3 bg-white text-background font-bold uppercase tracking-widest text-sm rounded-lg transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed">
      <Send size={15} />
      {loading ? (loadingLabel ?? 'Working...') : label}
    </button>
  );
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem('garage_v1') === '1'; } catch { return false; }
  });
  const [pin, setPin] = useState('');
  const [pinErr, setPinErr] = useState(false);
  const [tab, setTab] = useState<Tab>('blast');

  const tryUnlock = () => {
    if (pin === PASS) {
      try { localStorage.setItem('garage_v1', '1'); } catch {}
      setUnlocked(true);
    } else {
      setPinErr(true);
      setPin('');
      setTimeout(() => setPinErr(false), 1500);
    }
  };

  const lock = () => {
    try { localStorage.removeItem('garage_v1'); } catch {}
    setUnlocked(false);
    setPin('');
  };

  if (!unlocked) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-6">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="font-bangers text-5xl text-white tracking-[0.2em] mb-1">THE GARAGE</h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">Enter passcode to continue</p>
          </div>

          <motion.div
            animate={pinErr ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.3 }}
            className={`bg-card border rounded-2xl p-8 ${pinErr ? 'border-white/40' : 'border-border'}`}
          >
            <div className="flex gap-3 justify-center mb-8">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length > i ? 'bg-white border-white' : 'bg-transparent border-white/30'}`} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} type="button"
                  onClick={() => pin.length < 4 && setPin(p => p + n)}
                  className="h-14 rounded-xl bg-background border border-border text-white text-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all active:scale-95">
                  {n}
                </button>
              ))}
              <button type="button"
                onClick={() => setPin('')}
                className="h-14 rounded-xl bg-background border border-border text-muted-foreground text-sm font-bold hover:bg-white/10 transition-all active:scale-95">
                CLR
              </button>
              <button type="button"
                onClick={() => pin.length < 4 && setPin(p => p + '0')}
                className="h-14 rounded-xl bg-background border border-border text-white text-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all active:scale-95">
                0
              </button>
              <button type="button"
                onClick={tryUnlock}
                className="h-14 rounded-xl bg-white text-background font-bold hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center">
                <ChevronRight size={22} />
              </button>
            </div>

            {pinErr && (
              <p className="text-center text-white/60 text-xs tracking-widest uppercase">Wrong passcode</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-bangers text-2xl text-white tracking-widest">SHADOWPIXEL</a>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="font-bangers text-xl text-white tracking-widest">THE GARAGE</span>
        </div>
        <button onClick={lock} className="flex items-center gap-2 text-muted-foreground hover:text-white text-xs uppercase tracking-widest transition-colors">
          <LogOut size={14} /> Lock
        </button>
      </nav>

      <div className="border-b border-border px-8">
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
          {([
            { id: 'blast', label: 'Email Blast', icon: <Mail size={14} /> },
            { id: 'news',  label: 'News',        icon: <Newspaper size={14} /> },
            { id: 'projects', label: 'Projects', icon: <Gamepad2 size={14} /> },
            { id: 'peeks', label: 'Sneak Peeks', icon: <Zap size={14} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${tab === t.id ? 'border-white text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {tab === 'blast' && <EmailBlastTab />}
            {tab === 'news' && <NewsTab />}
            {tab === 'projects' && <ProjectsTab />}
            {tab === 'peeks' && <SneakPeeksTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmailBlastTab() {
  const [subject, setSubject] = useState('');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/email-blast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, headline, body, imageUrl: imageUrl || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setResult({ type: 'error', message: data.error ?? 'Failed' }); }
      else { setResult({ type: 'success', message: `Sent to ${data.emailsSent} subscriber${data.emailsSent !== 1 ? 's' : ''}!` }); setSubject(''); setHeadline(''); setBody(''); setImageUrl(''); }
    } catch { setResult({ type: 'error', message: 'Network error' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bangers text-3xl text-white tracking-widest mb-1">Email Blast</h2>
        <p className="text-muted-foreground text-sm">Send a custom email to all subscribers right now.</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldInput label="Email Subject" icon={<Mail size={13} />} value={subject} onChange={setSubject} placeholder="e.g. The Endless Room — Big Update" required />
          <FieldInput label="Headline" icon={<FileText size={13} />} value={headline} onChange={setHeadline} placeholder="e.g. LAUNCH DATE REVEALED" required />
          <FieldTextarea label="Body" icon={<FileText size={13} />} value={body} onChange={setBody} placeholder="Write your message here..." rows={5} required />
          <FieldInput label="Image URL" icon={<Image size={13} />} value={imageUrl} onChange={setImageUrl} placeholder="https://... (optional)" type="url" />
          <StatusBanner result={result} />
          <SubmitBtn loading={loading} label="Send to All Subscribers" loadingLabel="Sending..." />
        </form>
      </div>
    </div>
  );
}

function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchNews = async () => {
    try { const r = await fetch(`${API_BASE}/api/news`); setItems(await r.json()); } catch {}
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) { setResult({ type: 'error', message: data.error ?? 'Failed' }); }
      else { setResult({ type: 'success', message: 'News post published!' }); setTitle(''); setContent(''); fetchNews(); }
    } catch { setResult({ type: 'error', message: 'Network error' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/news/${id}`, { method: 'DELETE' });
      fetchNews();
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bangers text-3xl text-white tracking-widest mb-1">News</h2>
        <p className="text-muted-foreground text-sm">Post studio news and updates visible on the website.</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldInput label="Title" icon={<FileText size={13} />} value={title} onChange={setTitle} placeholder="e.g. Development Update #3" required />
          <FieldTextarea label="Content" icon={<Newspaper size={13} />} value={content} onChange={setContent} placeholder="Write the news post content..." rows={5} required />
          <StatusBanner result={result} />
          <SubmitBtn loading={loading} label="Publish News Post" />
        </form>
      </div>
      <div>
        <h3 className="font-bangers text-xl tracking-widest text-white mb-4 flex items-center gap-2"><PlusCircle size={18} /> Published Posts ({items.length})</h3>
        {items.length === 0 ? <p className="text-muted-foreground text-sm">No news posts yet.</p> : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{item.content}</p>
                  <span className="text-muted-foreground text-xs mt-1 inline-block">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-white transition-colors shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsTab() {
  const [items, setItems] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('In Development');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProjects = async () => {
    try { const r = await fetch(`${API_BASE}/api/projects`); setItems(await r.json()); } catch {}
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, genre: genre || null, status, imageUrl: imageUrl || null }),
      });
      const data = await res.json();
      if (!res.ok) { setResult({ type: 'error', message: data.error ?? 'Failed' }); }
      else { setResult({ type: 'success', message: `Project "${data.name}" added!` }); setName(''); setDescription(''); setGenre(''); setStatus('In Development'); setImageUrl(''); fetchProjects(); }
    } catch { setResult({ type: 'error', message: 'Network error' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bangers text-3xl text-white tracking-widest mb-1">Projects</h2>
        <p className="text-muted-foreground text-sm">Add games to the Projects section of the website.</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldInput label="Game Name" icon={<Gamepad2 size={13} />} value={name} onChange={setName} placeholder="e.g. Project VOID" required />
          <FieldTextarea label="Description" icon={<FileText size={13} />} value={description} onChange={setDescription} placeholder="Describe the game..." required />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Genre" icon={<FileText size={13} />} value={genre} onChange={setGenre} placeholder="e.g. Horror, Platformer" />
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                <FileText size={13} /> Status
              </label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/40 transition-colors">
                <option>In Development</option>
                <option>Coming Soon</option>
                <option>Released</option>
                <option>On Hold</option>
              </select>
            </div>
          </div>
          <FieldInput label="Image URL" icon={<Image size={13} />} value={imageUrl} onChange={setImageUrl} placeholder="https://... (optional)" type="url" />
          <StatusBanner result={result} />
          <SubmitBtn loading={loading} label="Add Project" />
        </form>
      </div>
      <div>
        <h3 className="font-bangers text-xl tracking-widest text-white mb-4 flex items-center gap-2"><PlusCircle size={18} /> Current Projects ({items.length})</h3>
        {items.length === 0 ? <p className="text-muted-foreground text-sm">No projects added yet.</p> : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-white transition-colors shrink-0"><Trash2 size={15} /></button>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.genre && <span className="text-xs bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">{item.genre}</span>}
                  <span className="text-xs bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SneakPeeksTab() {
  const [peeks, setPeeks] = useState<SneakPeek[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPeeks = async () => {
    try { const r = await fetch(`${API_BASE}/api/sneak-peeks`); setPeeks(await r.json()); } catch {}
  };

  useEffect(() => { fetchPeeks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/sneak-peeks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageUrl: imageUrl || null }),
      });
      const data = await res.json();
      if (!res.ok) { setResult({ type: 'error', message: data.error ?? 'Failed' }); }
      else { setResult({ type: 'success', message: `Posted! Emails sent to ${data.emailsSent} subscriber${data.emailsSent !== 1 ? 's' : ''}.` }); setTitle(''); setDescription(''); setImageUrl(''); fetchPeeks(); }
    } catch { setResult({ type: 'error', message: 'Network error' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bangers text-3xl text-white tracking-widest mb-1">Sneak Peeks</h2>
        <p className="text-muted-foreground text-sm">Post a sneak peek and email all subscribers automatically.</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldInput label="Title" icon={<Zap size={13} />} value={title} onChange={setTitle} placeholder="e.g. First Gameplay Footage" required />
          <FieldTextarea label="Description" icon={<FileText size={13} />} value={description} onChange={setDescription} placeholder="Describe what subscribers will see..." required />
          <FieldInput label="Image URL" icon={<Image size={13} />} value={imageUrl} onChange={setImageUrl} placeholder="https://... (optional)" type="url" />
          <StatusBanner result={result} />
          <SubmitBtn loading={loading} label="Post & Email Subscribers" loadingLabel="Sending..." />
        </form>
      </div>
      <div>
        <h3 className="font-bangers text-xl tracking-widest text-white mb-4 flex items-center gap-2"><PlusCircle size={18} /> Past Sneak Peeks ({peeks.length})</h3>
        {peeks.length === 0 ? <p className="text-muted-foreground text-sm">No sneak peeks posted yet.</p> : (
          <div className="space-y-3">
            {peeks.map(peek => (
              <div key={peek.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white mb-1">{peek.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{peek.description}</p>
                    {peek.imageUrl && <a href={peek.imageUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 text-xs mt-1 inline-block hover:text-white transition-colors">View Image →</a>}
                  </div>
                  <span className="text-muted-foreground text-xs whitespace-nowrap shrink-0">{new Date(peek.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
