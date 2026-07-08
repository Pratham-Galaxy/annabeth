import { motion } from 'framer-motion';

export function SceneHeader({
  corner,
  title,
  tag,
}: {
  corner: string;
  title: string;
  tag?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-[10vh] left-0 right-0 z-10 text-center pointer-events-none no-select"
    >
      <div className="font-telemetry text-racing-red text-xs tracking-[0.4em] uppercase mb-1">
        {corner}
      </div>
      <h2 className="font-display text-4xl md:text-6xl text-carbon-100 leading-none">{title}</h2>
      {tag && (
        <div className="mt-2 inline-block px-3 py-0.5 bg-carbon-800 border border-carbon-600 rounded-full font-telemetry text-[10px] tracking-widest text-carbon-300 uppercase">
          {tag}
        </div>
      )}
    </motion.div>
  );
}

export function CornerBadge({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-6 rounded-full transition-colors ${
            i <= index ? 'bg-racing-red' : 'bg-carbon-700'
          }`}
        />
      ))}
    </div>
  );
}
