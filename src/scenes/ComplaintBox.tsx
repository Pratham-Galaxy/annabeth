import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, Send, Gavel, History } from 'lucide-react';
import { audio } from '../lib/audio';
import { COMPLAINT_VERDICTS } from '../config/content';
import { supabase, supabaseReady } from '../lib/supabase';
import { TEAM } from '../config/team';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

type Complaint = {
  id: string;
  complaint: string;
  verdict: string | null;
  created_at: string;
};

export function ComplaintBox({ onDone, progress: _progress, tyreColor: _tyreColor = '#e10600' }: { onDone: () => void; progress: number; tyreColor?: string }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ verdict: string } | null>(null);
  const [history, setHistory] = useState<Complaint[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('complaints')
      .select('id, complaint, verdict, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setHistory(data as Complaint[]);
  };

  const submit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    audio.radioStatic(0.4);

    const verdict = COMPLAINT_VERDICTS[Math.floor(Math.random() * COMPLAINT_VERDICTS.length)];

    if (supabase) {
      const { error: insertError } = await supabase.from('complaints').insert({
        driver_name: TEAM.driver,
        complaint: text.trim(),
        verdict,
      });
      if (insertError) {
        setError('The stewards are reviewing the paperwork. Try again.');
        setSubmitting(false);
        return;
      }
    }

    audio.ding();
    setResult({ verdict });
    setText('');
    setSubmitting(false);
    void loadHistory();
  };

  return (
    <SceneShell>
      <SceneHeader corner="FIA Stewards" title="Complaint Box" tag="File a Report" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        <div className="max-w-xl w-full">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hud-panel p-6 mb-4"
          >
            <div className="flex items-center gap-2 mb-4 text-racing-yellow">
              <AlertTriangle size={20} />
              <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
                Official Complaint Form · v3.4
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={500}
              disabled={submitting}
              placeholder="Describe your grievance against the Race Engineer. Be as dramatic as possible. The stewards take this very seriously."
              className="w-full bg-carbon-950 border border-carbon-700 rounded-lg p-4 font-body text-carbon-100 text-sm placeholder-carbon-600 focus:border-racing-red focus:outline-none resize-none transition-colors"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="font-telemetry text-[10px] text-carbon-600">{text.length}/500</span>
              <button
                onClick={submit}
                disabled={!text.trim() || submitting}
                className="px-6 py-2.5 font-display text-base tracking-wider bg-racing-red text-white rounded-lg disabled:opacity-40 hover:bg-racing-redDark transition-colors no-select flex items-center gap-2"
              >
                <Send size={16} /> {submitting ? 'SUBMITTING...' : 'FILE COMPLAINT'}
              </button>
            </div>
            {error && <p className="mt-3 text-racing-red font-telemetry text-sm">{error}</p>}
            {!supabaseReady && (
              <p className="mt-3 text-carbon-600 font-telemetry text-[11px]">
                Demo mode: submissions saved locally this session.
              </p>
            )}
          </motion.div>

          {/* Verdict */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="hud-panel p-6 mb-4 border-racing-yellow/40"
              >
                <div className="flex items-center gap-2 mb-2 text-racing-yellow">
                  <Gavel size={20} />
                  <span className="font-telemetry text-xs tracking-widest uppercase">Verdict</span>
                </div>
                <p className="font-display text-2xl text-carbon-100">{result.verdict}</p>
                <p className="font-telemetry text-racing-green text-sm mt-2">Complaint Received.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History toggle */}
          <button
            onClick={() => {
              audio.click();
              setShowHistory((s) => !s);
            }}
            className="flex items-center gap-2 font-telemetry text-carbon-400 hover:text-racing-red text-sm tracking-widest uppercase transition-colors mb-3 no-select"
          >
            <History size={16} /> {showHistory ? 'Hide' : 'Show'} Complaint History ({history.length})
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {history.length === 0 && (
                  <p className="font-telemetry text-carbon-600 text-sm">No complaints filed yet.</p>
                )}
                {history.map((c) => (
                  <div key={c.id} className="hud-panel p-4">
                    <p className="font-body text-sm text-carbon-200">{c.complaint}</p>
                    <p className="font-telemetry text-[11px] text-racing-yellow mt-2 uppercase tracking-wide">
                      Verdict: {c.verdict}
                    </p>
                    <p className="font-telemetry text-[10px] text-carbon-600 mt-1">
                      {new Date(c.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <ContinueButton onClick={onDone} label="Team Radio" />
        </div>
      </div>
    </SceneShell>
  );
}
