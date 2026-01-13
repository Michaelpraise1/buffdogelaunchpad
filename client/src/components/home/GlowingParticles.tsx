const GlowingParticles = ({ count = 30 }) => (
  <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
    {[...Array(count)].map((_, i) => {
      // Randomize horizontal drift: left, center, right
      const driftX = ["-15vw", "0", "15vw"][Math.floor(Math.random() * 3)];

      return (
        <span
          key={i}
          className="absolute opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${10 + Math.random() * 40}px`,
            width: `${3 + Math.random() * 3}px`,
            height: `${3 + Math.random() * 3}px`,
            background: "rgba(255,255,255,0.6)",
            filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.8)) blur(1.4px)",
            borderRadius: "50%",
            animation: `glowParticle 14s linear infinite`,
            animationDelay: `${Math.random() * 14}s`,
            transformOrigin: "center center",
            // Custom property to control horizontal drift dynamically
            // @ts-ignore
            "--drift-x": driftX,
          }}
        />
      );
    })}

    {/* Glow particle keyframes with directional drift */}
    <style>
      {`
      @keyframes glowParticle {
        0% {
          transform: translate(0, 0);
          opacity: 0.75;
          filter: drop-shadow(0 0 5px rgba(255,255,255,0.8)) blur(1.4px);
        }
        70% {
          opacity: 0.75;
          filter: drop-shadow(0 0 12px rgba(255,255,255,1)) blur(1px);
        }
        100% {
          transform: translate(var(--drift-x), 90vh);
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)) blur(1.8px);
        }
      }
    `}
    </style>
  </div>
);

export default GlowingParticles;
