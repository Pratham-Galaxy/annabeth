import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, Send, Gavel, History, Settings } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);
  const [notifStatus, setNotifStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

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
    setNotifStatus('idle');
    audio.radioStatic(0.4);

    const verdict = COMPLAINT_VERDICTS[Math.floor(Math.random() * COMPLAINT_VERDICTS.length)];
    const complaintText = text.trim();

    if (supabase) {
      const { error: insertError } = await supabase.from('complaints').insert({
        driver_name: TEAM.driver,
        complaint: complaintText,
        verdict,
      });
      if (insertError) {
        setError('The stewards are reviewing the paperwork. Try again.');
        setSubmitting(false);
        return;
      }

      // Fire email notification to engineer (non-blocking — don't fail the complaint if email fails)
      setNotifStatus('sending');
      try {
        const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-complaint-email`;
        const res = await fetch(fnUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            complaint: complaintText,
            verdict,
            driverName: TEAM.driver,
          }),
        });
        setNotifStatus(res.ok ? 'sent' : 'failed');
      } catch {
        setNotifStatus('failed');
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-racing-yellow">
                <AlertTriangle size={20} />
                <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
                  Official Complaint Form · v3.4
                </span>
              </div>
              <button
                onClick={() => {
                  audio.click();
                  setShowSettings((s) => !s);
                }}
                className="flex items-center gap-1.5 font-telemetry text-[10px] text-carbon-500 hover:text-racing-yellow tracking-widest uppercase transition-colors no-select"
                title="Engineer notification settings"
              >
                <Settings size={14} /> Notify
              </button>
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
            {notifStatus === 'sent' && (
              <p className="mt-3 text-racing-green font-telemetry text-xs flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-racing-green animate-pulse" />
                Engineer notified via email.
              </p>
            )}
            {notifStatus === 'failed' && (
              <p className="mt-3 text-carbon-500 font-telemetry text-xs">
                Complaint saved, but email notification could not be delivered.
              </p>
            )}
            {notifStatus === 'sending' && (
              <p className="mt-3 text-racing-yellow font-telemetry text-xs animate-pulse">
                Transmitting to engineer...
              </p>
            )}
            {!supabaseReady && (
              <p className="mt-3 text-carbon-600 font-telemetry text-[11px]">
                Demo mode: submissions saved locally this session.
              </p>
            )}
          </motion.div>

          {/* Email settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <EmailSettingsPanel />
              </motion.div>
            )}
          </AnimatePresence>

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

function EmailSettingsPanel() {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadEmail();
  }, []);

  const loadEmail = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('app_settings')
      .select('complaint_email')
      .eq('id', 1)
      .maybeSingle();
    if (data?.complaint_email) setEmail(data.complaint_email);
  };

  const save = async () => {
    if (!supabase || !email.trim()) return;
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase
      .from('app_settings')
      .update({ complaint_email: email.trim(), updated_at: new Date().toISOString() })
      .eq('id', 1);
    if (updateError) {
      setError('Could not save email.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="hud-panel p-5 border-racing-yellow/30">
      <div className="flex items-center gap-2 mb-1 text-racing-yellow">
        <Settings size={16} />
        <span className="font-telemetry text-xs tracking-[0.3em] uppercase">Engineer Email</span>
      </div>
      <p className="font-body text-xs text-carbon-500 mb-3">
        Enter your email. Every complaint she files gets sent here automatically.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-carbon-950 border border-carbon-700 rounded-lg px-3 py-2 font-body text-carbon-100 text-sm placeholder-carbon-600 focus:border-racing-yellow focus:outline-none transition-colors"
        />
        <button
          onClick={save}
          disabled={!email.trim() || saving}
          className="px-4 py-2 bg-racing-yellow text-carbon-950 rounded-lg font-telemetry text-xs tracking-wider uppercase no-select disabled:opacity-40 hover:bg-pinstripe-goldLight transition-colors"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
      {error && <p className="mt-2 text-racing-red font-telemetry text-xs">{error}</p>}
      <p className="mt-2 text-carbon-600 font-telemetry text-[10px]">
        First submission triggers a one-time FormSubmit confirmation email. Click confirm to activate.
      </p>
    </div>
  );
}
