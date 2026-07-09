import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { audio } from '../lib/audio';
import { TEAM } from '../config/team';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

const FIELDS = [
  { label: 'Driver', value: TEAM.driver },
  { label: 'Nickname', value: TEAM.nickname },
  { label: 'Team', value: TEAM.teamName },
  { label: 'Race Engineer', value: TEAM.engineer },
  { label: 'Licence Class', value: 'Unlimited' },
  { label: 'Valid Until', value: 'Forever' },
];

export function DriverLicence({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const downloadPdf = () => {
    audio.ding();
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Background
    doc.setFillColor(8, 9, 11);
    doc.rect(0, 0, 297, 210, 'F');

    // Single thin border — no double frame
    doc.setDrawColor(232, 18, 28);
    doc.setLineWidth(0.6);
    doc.rect(16, 16, 265, 178);

    // Left accent bar
    doc.setFillColor(232, 18, 28);
    doc.rect(16, 16, 1.4, 178, 'F');

    // Eyebrow + header
    doc.setTextColor(109, 118, 128);
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.text('OFFICIAL DOCUMENT · PARC FERME', 30, 32);

    doc.setTextColor(244, 244, 248);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('FRIENDSHIP MOTORSPORT FEDERATION', 30, 44);

    doc.setTextColor(232, 18, 28);
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.text('SUPER LICENCE · CLASS: UNLIMITED', 30, 51);

    // Divider
    doc.setDrawColor(35, 35, 47);
    doc.setLineWidth(0.3);
    doc.line(30, 58, 267, 58);

    // Photo placeholder box
    doc.setDrawColor(58, 64, 71);
    doc.setFillColor(20, 20, 31);
    doc.roundedRect(30, 68, 48, 58, 1, 1, 'FD');
    doc.setTextColor(109, 118, 128);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.text('PHOTO', 54, 99, { align: 'center' });

    // Fields
    let y = 74;
    FIELDS.forEach((f) => {
      doc.setTextColor(109, 118, 128);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.text(f.label.toUpperCase(), 92, y);

      doc.setTextColor(244, 244, 248);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(f.value, 92, y + 6);

      doc.setDrawColor(28, 28, 38);
      doc.setLineWidth(0.2);
      doc.line(92, y + 9, 262, y + 9);
      y += 15.5;
    });

    // Footer
    doc.setDrawColor(35, 35, 47);
    doc.setLineWidth(0.3);
    doc.line(30, 172, 267, 172);

    doc.setTextColor(109, 118, 128);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.text('Issued by the Friendship Motorsport Federation · This licence has no expiry.', 30, 180);
    doc.text('LIC-0001 · BEARER RECOGNISED AS FRIENDSHIP WORLD CHAMPION', 30, 186);

    doc.save(`Besto-Pesto-Super-Licence.pdf`);
  };

  return (
    <SceneShell>
      <SceneHeader corner="Parc Ferme" title="Driver Licence" tag="Official Document" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        {/* Licence card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="hud-panel bg-carbon-950/95 max-w-xl w-full p-7 relative overflow-hidden border-l-[3px] border-racing-red"
        >
          {/* status pill */}
          <div className="absolute top-6 right-7 flex items-center gap-2 font-telemetry text-[9px] tracking-widest uppercase text-racing-green">
            <span className="w-1.5 h-1.5 rounded-full bg-racing-green animate-pulse" />
            Valid · Unlimited
          </div>

          <div className="font-telemetry text-[9px] tracking-[0.25em] uppercase text-carbon-500 mb-2">
            Official Document · Parc Fermé
          </div>
          <h3 className="font-display text-xl text-carbon-50 tracking-wide leading-tight max-w-[80%]">
            Friendship Motorsport Federation
          </h3>
          <p className="font-telemetry text-racing-red text-[10px] tracking-widest uppercase mt-1 mb-5">
            Super Licence · Class Unlimited
          </p>

          <div className="border-t border-carbon-800 pt-5 flex gap-6">
            {/* Photo placeholder */}
            <div className="w-24 h-28 bg-carbon-900 border border-carbon-800 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="font-telemetry text-carbon-600 text-[9px] tracking-widest uppercase">Photo</span>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-2.5">
              {FIELDS.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between border-b border-carbon-800 pb-1.5">
                  <span className="font-telemetry text-[9px] text-carbon-500 uppercase tracking-widest">
                    {f.label}
                  </span>
                  <span className="font-display text-base text-carbon-100">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-carbon-800 mt-5 pt-3 flex items-center justify-between">
            <p className="font-telemetry text-[9px] text-carbon-600 tracking-wide">
              Issued by the FMF · no expiry
            </p>
            <p className="font-telemetry text-[9px] text-carbon-600 tracking-widest uppercase">LIC-0001</p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={downloadPdf}
          className="mt-7 px-7 py-3 font-telemetry text-xs tracking-[0.2em] uppercase text-carbon-100 bg-carbon-900 border border-racing-red/50 rounded-md hover:border-racing-red hover:shadow-[0_0_18px_rgba(232,18,28,0.25)] transition-all no-select flex items-center gap-2.5"
        >
          <Download size={15} /> Download as PDF
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <ContinueButton onClick={onDone} label="Final Lap" />
        </motion.div>
      </div>
    </SceneShell>
  );
}