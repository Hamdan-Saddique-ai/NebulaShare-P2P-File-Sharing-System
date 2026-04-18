export default function MarqueeRibbon() {
  const text = 'P2P FILE SHARING • DROP AND SEND • NO SERVERS NEEDED • SECURE TRANSFERS • ';
  const repeated = text.repeat(4);

  return (
    <div className="relative w-full overflow-hidden py-6 opacity-60">
      {/* Fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #0A0A0A 0%, transparent 100%)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #0A0A0A 100%)' }}
      />

      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-sm font-bold tracking-[0.1em] uppercase text-white/40 mr-0">
          {repeated}
        </span>
        <span className="text-sm font-bold tracking-[0.1em] uppercase text-white/40">
          {repeated}
        </span>
      </div>
    </div>
  );
}
