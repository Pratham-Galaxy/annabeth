import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Radio, Send, Mic, Square, Trash2, Upload, Volume2, Settings } from 'lucide-react';
import { audio } from '../lib/audio';
import { supabase, supabaseReady } from '../lib/supabase';
import { TEAM } from '../config/team';
import { SceneShell, ContinueButton, RadioStaticOverlay } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';
import { useVoiceRecorder } from '../lib/useVoiceRecorder';

type RadioMsg = {
  id: string;
  message: string;
  created_at: string;
};

type EngineerClip = {
  id: string;
  trigger: string;
  label: string;
  storage_path: string;
};

const QUICK_MESSAGES = [
  'Box box box!',
  'Engineer, you are the worst.',
  'I am P1 and you know it.',
  'Copy that, Besto.',
  'DRS please, I am bored.',
];

const CLIP_SUGGESTIONS = QUICK_MESSAGES.map((q) => ({
  trigger: q,
  label: q.replace(/[!.]/g, '').trim(),
}));

const BUCKET = 'radio-clips';

function publicUrl(path: string): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function TeamRadio({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<RadioMsg[]>([]);
  const [staticActive, setStaticActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clips, setClips] = useState<EngineerClip[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [playingClip, setPlayingClip] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const recorder = useVoiceRecorder();
  const [recordingFor, setRecordingFor] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void loadMessages();
    void loadClips();
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

  const loadClips = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('engineer_audio')
      .select('id, trigger, label, storage_path')
      .order('created_at', { ascending: true });
    if (data) setClips(data as EngineerClip[]);
  };

  const findClipFor = (msg: string): EngineerClip | null => {
    const normalized = msg.trim().toLowerCase();
    return clips.find((c) => c.trigger.trim().toLowerCase() === normalized) ?? null;
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

    // Play engineer voice clip if one matches
    const clip = findClipFor(content);
    if (clip) {
      const url = publicUrl(clip.storage_path);
      setPlayingClip(clip.id);
      setStaticActive(true);
      audio.radioStatic(0.3);
      setTimeout(() => {
        void audio.playUrl(url).then(() => {
          setStaticActive(false);
          setPlayingClip(null);
        });
      }, 600);
    }
  };

  const startRecording = async (clipTrigger: string) => {
    setRecordingFor(clipTrigger);
    await recorder.start();
  };

  const stopAndSave = async (clipTrigger: string, label: string) => {
    const blob = await recorder.stop();
    setRecordingFor(null);
    if (!blob.size || !supabase) {
      recorder.reset();
      return;
    }

    setUploading(true);
    const fileName = `${label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.webm`;
    const path = `engineer/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: blob.type, upsert: true });

    if (uploadError) {
      setError('Upload failed. Try again.');
      setUploading(false);
      recorder.reset();
      return;
    }

    // Delete existing clip for this trigger, then insert new one
    const existing = clips.find((c) => c.trigger === clipTrigger);
    if (existing) {
      await supabase.from('engineer_audio').delete().eq('id', existing.id);
      await supabase.storage.from(BUCKET).remove([existing.storage_path]);
    }

    const { error: dbError } = await supabase.from('engineer_audio').insert({
      trigger: clipTrigger,
      label,
      storage_path: path,
    });

    if (dbError) {
      setError('Failed to save clip record.');
    }

    setUploading(false);
    recorder.reset();
    void loadClips();
  };

  const deleteClip = async (clip: EngineerClip) => {
    if (!supabase) return;
    await supabase.storage.from(BUCKET).remove([clip.storage_path]);
    await supabase.from('engineer_audio').delete().eq('id', clip.id);
    void loadClips();
  };

  const previewClip = (clip: EngineerClip) => {
    setPlayingClip(clip.id);
    void audio.playUrl(publicUrl(clip.storage_path)).then(() => {
      setPlayingClip(null);
    });
  };

  const triggerHasClip = (trigger: string) =>
    clips.some((c) => c.trigger.trim().toLowerCase() === trigger.trim().toLowerCase());

  return (
    <SceneShell>
      <RadioStaticOverlay active={staticActive} />
      <SceneHeader corner="Pit Wall Channel" title="Team Radio" tag="Driver → Engineer" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        <div className="max-w-xl w-full">
          {/* Radio device frame */}
          <div className="hud-panel scanlines p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-racing-red">
                <Radio className="animate-pulse" size={20} />
                <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
                  Channel 1 · Encrypted
                </span>
              </div>
              <button
                onClick={() => {
                  audio.click();
                  setShowAdmin((s) => !s);
                }}
                className="flex items-center gap-1.5 font-telemetry text-[10px] text-carbon-500 hover:text-racing-yellow tracking-widest uppercase transition-colors no-select"
                title="Engineer clip management"
              >
                <Settings size={14} /> Engineer
              </button>
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
                {messages.map((m) => {
                  const clip = findClipFor(m.message);
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col items-end"
                    >
                      <div className="bg-racing-red/20 border border-racing-red/40 rounded-lg px-3 py-2 max-w-[80%]">
                        <p className="font-body text-sm text-carbon-100">{m.message}</p>
                      </div>
                      {clip && (
                        <div className="flex items-center gap-1 mt-1 mr-1">
                          <Volume2 size={10} className="text-racing-green animate-pulse" />
                          <span className="font-telemetry text-[8px] text-racing-green tracking-wider uppercase">
                            Engineer replied
                          </span>
                        </div>
                      )}
                      <span className="font-telemetry text-[9px] text-carbon-600 mt-0.5">
                        {new Date(m.created_at).toLocaleTimeString()}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Quick messages */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_MESSAGES.map((q) => {
                const hasClip = triggerHasClip(q);
                return (
                  <button
                    key={q}
                    onClick={() => {
                      audio.click();
                      void send(q);
                    }}
                    className="px-3 py-1.5 bg-carbon-800 border rounded-full font-telemetry text-[11px] text-carbon-300 hover:border-racing-red hover:text-racing-red transition-colors no-select flex items-center gap-1"
                    style={{ borderColor: hasClip ? 'rgba(0,212,106,0.4)' : undefined }}
                  >
                    {hasClip && <Volume2 size={10} className="text-racing-green" />}
                    {q}
                  </button>
                );
              })}
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

          {/* Engineer Clip Admin Panel */}
          <AnimatePresence>
            {showAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="hud-panel p-5 border-racing-yellow/30">
                  <div className="flex items-center gap-2 mb-1 text-racing-yellow">
                    <Mic size={18} />
                    <span className="font-telemetry text-xs tracking-[0.3em] uppercase">
                      Engineer Voice Clips
                    </span>
                  </div>
                  <p className="font-body text-xs text-carbon-500 mb-4">
                    Record your voice for each trigger. When the driver sends that message, your clip plays as the engineer's reply.
                  </p>

                  {recorder.error && (
                    <p className="text-racing-red font-telemetry text-xs mb-3">{recorder.error}</p>
                  )}
                  {uploading && (
                    <p className="text-racing-yellow font-telemetry text-xs mb-3 animate-pulse">
                      Uploading clip...
                    </p>
                  )}

                  <div className="space-y-2.5">
                    {CLIP_SUGGESTIONS.map((s) => {
                      const clip = clips.find(
                        (c) => c.trigger.trim().toLowerCase() === s.trigger.trim().toLowerCase()
                      );
                      const isRecording = recordingFor === s.trigger && recorder.state === 'recording';
                      return (
                        <div
                          key={s.trigger}
                          className="flex items-center gap-3 bg-carbon-950 border border-carbon-800 rounded-lg p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-telemetry text-sm text-carbon-200 truncate">{s.trigger}</p>
                            <p className="font-telemetry text-[10px] text-carbon-600">
                              {clip ? 'Clip recorded' : 'No clip yet'}
                            </p>
                          </div>

                          {clip && (
                            <button
                              onClick={() => previewClip(clip)}
                              disabled={playingClip === clip.id}
                              className="p-2 text-racing-green hover:text-racing-green/80 transition-colors no-select disabled:opacity-50"
                              title="Preview"
                            >
                              <Volume2 size={16} className={playingClip === clip.id ? 'animate-pulse' : ''} />
                            </button>
                          )}

                          {isRecording ? (
                            <button
                              onClick={() => stopAndSave(s.trigger, s.label)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-racing-red text-white rounded-lg font-telemetry text-xs tracking-wider uppercase no-select hover:bg-racing-redDark transition-colors"
                            >
                              <Square size={14} fill="white" /> Stop
                            </button>
                          ) : (
                            <button
                              onClick={() => startRecording(s.trigger)}
                              disabled={recorder.state === 'recording' || uploading}
                              className="flex items-center gap-1.5 px-3 py-2 bg-carbon-800 border border-carbon-700 text-carbon-200 rounded-lg font-telemetry text-xs tracking-wider uppercase no-select hover:border-racing-red hover:text-racing-red transition-colors disabled:opacity-40"
                            >
                              <Mic size={14} /> Record
                            </button>
                          )}

                          {clip && (
                            <button
                              onClick={() => deleteClip(clip)}
                              className="p-2 text-carbon-600 hover:text-racing-red transition-colors no-select"
                              title="Delete clip"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom clip upload */}
                  <CustomClipUpload onUploaded={loadClips} existingClips={clips} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <ContinueButton onClick={onDone} label="Trophy Room" />
        </div>
      </div>
    </SceneShell>
  );
}

function CustomClipUpload({
  onUploaded,
  existingClips,
}: {
  onUploaded: () => void;
  existingClips: EngineerClip[];
}) {
  const [customTrigger, setCustomTrigger] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const trigger = customTrigger.trim() || file.name.replace(/\.[^.]+$/, '');
    if (!supabase) return;
    setUploading(true);
    const path = `engineer/custom_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      return;
    }

    const existing = existingClips.find(
      (c) => c.trigger.trim().toLowerCase() === trigger.toLowerCase()
    );
    if (existing) {
      await supabase.from('engineer_audio').delete().eq('id', existing.id);
      await supabase.storage.from(BUCKET).remove([existing.storage_path]);
    }

    await supabase.from('engineer_audio').insert({
      trigger,
      label: trigger,
      storage_path: path,
    });
    setUploading(false);
    setCustomTrigger('');
    onUploaded();
  };

  return (
    <div className="mt-4 pt-4 border-t border-carbon-800">
      <p className="font-telemetry text-[10px] text-carbon-500 tracking-widest uppercase mb-2">
        Upload custom clip
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={customTrigger}
          onChange={(e) => setCustomTrigger(e.target.value)}
          placeholder="Trigger phrase (optional)"
          maxLength={80}
          className="flex-1 bg-carbon-950 border border-carbon-700 rounded-lg px-3 py-2 font-body text-carbon-100 text-sm placeholder-carbon-600 focus:border-racing-yellow focus:outline-none transition-colors"
        />
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = '';
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-carbon-800 border border-carbon-700 text-carbon-200 rounded-lg font-telemetry text-xs tracking-wider uppercase no-select hover:border-racing-yellow hover:text-racing-yellow transition-colors disabled:opacity-40"
        >
          <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
