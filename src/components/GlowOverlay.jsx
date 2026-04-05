const GLOW_STYLE = {
  background: "radial-gradient(500px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(239,68,68,0.15), transparent 40%)",
};

export default function GlowOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={GLOW_STYLE}
    />
  );
}
