import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Send, Image, FileText, Zap } from 'lucide-react';

interface SneakPeek {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Admin() {
  const [peeks, setPeeks] = useState<SneakPeek[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function fetchPeeks() {
    try {
      const res = await fetch(`${API_BASE}/api/sneak-peeks`);
      const data = await res.json();
      setPeeks(data);
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchPeeks();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/sneak-peeks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', message: data.error ?? 'Something went wrong' });
      } else {
        setResult({
          type: 'success',
          message: `Sneak peek posted! Emails sent to ${data.emailsSent} subscriber${data.emailsSent !== 1 ? 's' : ''}.`,
        });
        setTitle('');
        setDescription('');
        setImageUrl('');
        fetchPeeks();
      }
    } catch {
      setResult({ type: 'error', message: 'Network error — is the API server running?' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-8 py-4 flex items-center gap-4">
        <a href="/" className="font-bangers text-2xl text-white tracking-widest">
          ShadowPixel <span className="text-primary">ADMIN</span>
        </a>
        <span className="text-muted-foreground text-xs uppercase tracking-widest">/ Sneak Peeks</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Post Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="border-b border-border px-8 py-5 flex items-center gap-3">
            <Zap size={20} className="text-primary" />
            <h2 className="font-bangers text-2xl tracking-widest text-white">Post New Sneak Peek</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                <FileText size={13} /> Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. First Gameplay Footage"
                data-testid="input-title"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                <FileText size={13} /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe what subscribers will see..."
                data-testid="input-description"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                <Image size={13} /> Image URL <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                data-testid="input-image-url"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {result && (
              <div
                className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                  result.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-primary/10 border border-primary/30 text-primary'
                }`}
                data-testid={`status-${result.type}`}
              >
                {result.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid="button-post-sneak-peek"
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-lg transition-all hover:bg-[#ff5555] hover:shadow-[0_5px_20px_rgba(255,60,60,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {loading ? 'Sending...' : 'Post & Email Subscribers'}
            </button>
          </form>
        </motion.div>

        {/* Past Sneak Peeks */}
        <div>
          <h3 className="font-bangers text-2xl tracking-widest text-white mb-6 flex items-center gap-2">
            <PlusCircle size={20} className="text-cyan" /> Past Sneak Peeks
          </h3>
          {peeks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No sneak peeks posted yet.</p>
          ) : (
            <div className="space-y-4">
              {peeks.map((peek) => (
                <div key={peek.id} className="bg-card border border-border rounded-xl p-6" data-testid={`sneak-peek-${peek.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">{peek.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{peek.description}</p>
                      {peek.imageUrl && (
                        <a href={peek.imageUrl} target="_blank" rel="noopener noreferrer" className="text-cyan text-xs mt-2 inline-block hover:underline">
                          View Image →
                        </a>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap shrink-0">
                      {new Date(peek.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
