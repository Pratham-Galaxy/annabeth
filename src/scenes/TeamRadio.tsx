import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Radio, Send } from 'lucide-react';
import { audio } from '../lib/audio';
import { supabase, supabaseReady } from '../lib/supabase';
import { TEAM } from '../config/team';
import { SceneShell, ContinueButton, RadioStaticOverlay } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

type RadioMsg = {
  id: string;
  message: string;
  created_at: string;
};

const QUICK_MESSAGES = [
  'Box box box!',
  'Engineer, you are the worst.',
  'I am P1 and you know it.',
  'Copy that, Besto.',
  'DRS please, I am bored.',
];

export function TeamRadio({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<RadioMsg[]>([]);
  const [staticActive, setStaticActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadMessages();
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const loadMessages = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('team_radio')
      .select('id, message, created_at')
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) setMessages(data as RadioMsg[]);
  };

  const send = async (msg?: string) => {
    const content = (msg ?? text).trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);
    setStaticActive(true);
    audio.radioStatic(0.5);
    audio.radioBeep();

    if (supabase) {
      const { error: insertError } = await supabase.from('team_radio').insert({
        driver_name: TEAM.driver,
        message: content,
      });
      if (insertError) {
        setError('Radio signal lost. Try again.');
        setStaticActive(false);
        setSending(false);
        return;
      }
    }

    setText('');
    setStaticActive(false);
    setSending(false);
    audio.radioBeep();
    void loadMessages();
  };

  return (
    <SceneShell>
      <RadioStaticOverlay active={staticActive} />
      <SceneHeader corner="Pit Wall Channel" title="Team Radio" tag="Driver → Engineer" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        <div className="max-w-xl w-full">
          {/* Radio device frame */}
          <div className="hud-panel scanlines p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-racing-red">
              <Radio className="animate-pulse" size={20} />
              <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
                Channel 1 · Encrypted
              </span>
            </div>

            {/* Signal bars */}
            <div className="flex items-end gap-1 h-5 mb-4">
              {[0.3, 0.5, 0.7, 1].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: staticActive ? [0.3, 1, 0.3] : 0.8 }}
                  transition={{ duration: 0.3, repeat: staticActive ? Infinity : 0 }}
                  className="w-1.5 bg-racing-green rounded-sm"
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>

            {/* Message log */}
            <div
              ref={listRef}
              className="h-52 overflow-y-auto bg-carbon-950 rounded-lg p-3 space-y-2 mb-4 border border-carbon-800"
            >
              {messages.length === 0 && (
                <p className="font-telemetry text-carbon-600 text-sm text-center py-8">
                  No transmissions yet. Radio is clear.
                </p>
              )}
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-end"
                  >
                    <div className="bg-racing-red/20 border border-racing-red/40 rounded-lg px-3 py-2 max-w-[80%]">
                      <p className="font-body text-sm text-carbon-100">{m.message}</p>
                    </div>
                    <span className="font-telemetry text-[9px] text-carbon-600 mt-0.5">
                      {new Date(m.created_at).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick messages */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_MESSAGES.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    audio.click();
                    void send(q);
                  }}
                  className="px-3 py-1.5 bg-carbon-800 border border-carbon-700 rounded-full font-telemetry text-[11px] text-carbon-300 hover:border-racing-red hover:text-racing-red transition-colors no-select"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                maxLength={120}
                disabled={sending}
                placeholder="Type your radio message..."
                className="flex-1 bg-carbon-950 border border-carbon-700 rounded-lg px-4 py-2.5 font-body text-carbon-100 text-sm placeholder-carbon-600 focus:border-racing-red focus:outline-none transition-colors"
              />
              <button
                onClick={() => send()}
                disabled={!text.trim() || sending}
                className="px-4 py-2.5 bg-racing-red text-white rounded-lg disabled:opacity-40 hover:bg-racing-redDark transition-colors no-select"
              >
                <Send size={18} />
              </button>
            </div>
            {error && <p className="mt-2 text-racing-red font-telemetry text-sm">{error}</p>}
            {!supabaseReady && (
              <p className="mt-2 text-carbon-600 font-telemetry text-[11px]">
                Demo mode: messages saved locally this session.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ContinueButton onClick={onDone} label="Trophy Room" />
        </div>
      </div>
    </SceneShell>
  );
}
