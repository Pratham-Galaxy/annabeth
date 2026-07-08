import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { audio } from '../lib/audio';
import { TEAM } from '../config/team';
import { SceneShell, ContinueButton } from '../components/ui/Overlay';
import { SceneHeader } from '../components/ui/SceneHeader';

export function DriverLicence({ onDone, progress: _progress }: { onDone: () => void; progress: number }) {
  const downloadPdf = () => {
    audio.ding();
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Background
    doc.setFillColor(8, 9, 11);
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setDrawColor(225, 6, 0);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, 267, 180);
    doc.setLineWidth(0.5);
    doc.setDrawColor(212, 175, 55);
    doc.rect(18, 18, 261, 174);

    // Header
    doc.setTextColor(225, 6, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('FRIENDSHIP MOTORSPORT FEDERATION', 148.5, 38, { align: 'center' });

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SUPER LICENCE · CLASS: UNLIMITED', 148.5, 47, { align: 'center' });

    // Divider
    doc.setDrawColor(108, 118, 128);
    doc.setLineWidth(0.3);
    doc.line(30, 55, 267, 55);

    // Photo placeholder box
    doc.setDrawColor(255, 255, 255);
    doc.setFillColor(28, 32, 36);
    doc.roundedRect(30, 65, 50, 60, 2, 2, 'FD');
    doc.setTextColor(109, 118, 128);
    doc.setFontSize(8);
    doc.text('PHOTO', 55, 98, { align: 'center' });

    // Fields
    const fields = [
      { label: 'DRIVER NAME', value: TEAM.driver },
      { label: 'NICKNAME', value: TEAM.nickname },
      { label: 'TEAM', value: TEAM.teamName },
      { label: 'RACE ENGINEER', value: TEAM.engineer },
      { label: 'LICENCE CLASS', value: 'UNLIMITED' },
      { label: 'VALID UNTIL', value: 'FOREVER' },
    ];

    let y = 72;
    fields.forEach((f) => {
      doc.setTextColor(109, 118, 128);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(f.label, 90, y);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(f.value, 90, y + 6);

      doc.setDrawColor(58, 64, 71);
      doc.setLineWidth(0.2);
      doc.line(90, y + 9, 260, y + 9);
      y += 16;
    });

    // Footer
    doc.setDrawColor(225, 6, 0);
    doc.setLineWidth(1);
    doc.line(30, 170, 267, 170);

    doc.setTextColor(109, 118, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Issued by the Friendship Motorsport Federation. This licence has no expiry.', 148.5, 180, { align: 'center' });
    doc.text('The bearer is recognised as Friendship World Champion.', 148.5, 185, { align: 'center' });

    // Seal
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.circle(240, 160, 10, 'S');
    doc.setFontSize(6);
    doc.setTextColor(212, 175, 55);
    doc.text('FMF', 240, 161, { align: 'center' });
    doc.text('SEAL', 240, 165, { align: 'center' });

    doc.save(`Besto-Pesto-Super-Licence.pdf`);
  };

  return (
    <SceneShell>
      <SceneHeader corner="Parc Ferme" title="Driver Licence" tag="Official Document" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-[12vh]">
        {/* Licence card */}
        <motion.div
          initial={{ opacity: 0, rotateY: 20, y: 30 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative max-w-2xl w-full"
          style={{ transformPerspective: 1000 }}
        >
          <div className="relative bg-gradient-to-br from-carbon-800 to-carbon-950 rounded-2xl p-8 border-2 border-racing-red/40 shadow-2xl overflow-hidden">
            {/* Holographic strip */}
            <div className="absolute top-0 right-0 w-32 h-full opacity-10"
              style={{ background: 'linear-gradient(135deg, transparent, #e10600, #ffd700, #00d46a, transparent)' }}
            />
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
              <span className="font-display text-[120px] text-white">FMF</span>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl text-racing-red tracking-wide">FRIENDSHIP MOTORSPORT FEDERATION</h3>
                  <p className="font-telemetry text-racing-gold text-xs tracking-widest uppercase">Super Licence · Class Unlimited</p>
                </div>
              </div>

              <div className="flex gap-6">
                {/* Photo placeholder */}
                <div className="w-28 h-32 bg-carbon-700 rounded-lg border border-carbon-600 flex items-center justify-center flex-shrink-0">
                  <span className="font-telemetry text-carbon-500 text-xs uppercase">Photo</span>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-3">
                  {[
                    { label: 'Driver', value: TEAM.driver },
                    { label: 'Nickname', value: TEAM.nickname },
                    { label: 'Team', value: TEAM.teamName },
                    { label: 'Engineer', value: TEAM.engineer },
                    { label: 'Licence Class', value: 'Unlimited' },
                    { label: 'Valid Until', value: 'Forever' },
                  ].map((f) => (
                    <div key={f.label} className="border-b border-carbon-700 pb-1">
                      <span className="font-telemetry text-[9px] text-carbon-500 uppercase tracking-widest">{f.label}</span>
                      <p className="font-display text-lg text-carbon-100 leading-tight">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seal */}
              <div className="absolute bottom-0 right-2">
                <div className="w-16 h-16 rounded-full border-2 border-racing-gold flex flex-col items-center justify-center">
                  <span className="font-display text-racing-gold text-sm">FMF</span>
                  <span className="font-telemetry text-racing-gold text-[8px] uppercase">Seal</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={downloadPdf}
          className="mt-8 px-8 py-3.5 font-display text-lg tracking-wider text-carbon-950 bg-racing-gold rounded-lg hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-shadow no-select flex items-center gap-2"
        >
          <Download size={20} /> DOWNLOAD AS PDF
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <ContinueButton onClick={onDone} label="Final Lap" />
        </motion.div>
      </div>
    </SceneShell>
  );
}
