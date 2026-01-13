const SCROLLER_ITEMS = [
  { text: "REWARDED EVEN IF YOU GET RUGGED", color: "text-orange-400" },
  { text: "STAKE IT TO RAKE IT", color: "text-gray-300" },
  { text: "THE PEOPLE'S PASSIVE PORTFOLIO TRACK", color: "text-yellow-400" },
];

const InfiniteScroller = () => (
  <div className="relative w-full mt-[30px] py-0 slider-bg flex items-center overflow-hidden min-h-[85px] shadow-xl">
    <div
      className="absolute left-0 top-0 h-full w-24 pointer-events-none z-10"
      style={{
        background:
          "linear-gradient(to right, rgba(17, 14, 20, 0.9) 0%, rgba(17, 14, 20, 0.7) 30%, rgba(17, 14, 20, 0.4) 60%, rgba(17, 14, 20, 0.1) 85%, transparent 100%)",
      }}
    />
    <div
      className="absolute left-0 top-0 h-full w-16 pointer-events-none z-15"
      style={{
        background:
          "linear-gradient(to right, rgba(17, 14, 20, 0.6) 0%, rgba(17, 14, 20, 0.3) 50%, transparent 100%)",
        filter: "blur(1px)",
      }}
    />

    {/* Right Blur Overlay - Enhanced foggy effect */}
    <div
      className="absolute right-0 top-0 h-full w-24 pointer-events-none z-10"
      style={{
        background:
          "linear-gradient(to left, rgba(17, 14, 20, 0.9) 0%, rgba(17, 14, 20, 0.7) 30%, rgba(17, 14, 20, 0.4) 60%, rgba(17, 14, 20, 0.1) 85%, transparent 100%)",
      }}
    />

    {/* Additional Right Fog Layer for more depth */}
    <div
      className="absolute right-0 top-0 h-full w-16 pointer-events-none z-15"
      style={{
        background:
          "linear-gradient(to left, rgba(17, 14, 20, 0.6) 0%, rgba(17, 14, 20, 0.3) 50%, transparent 100%)",
        filter: "blur(1px)",
      }}
    />

    {/* Buff Doge Image - Full height coverage */}
    <div className="relative z-20 flex items-center justify-center h-full pl-5 pr-6">
      <img
        src="/images/r.png"
        alt="Buff Doge"
        className="h-[90px] w-auto object-contain"
      />
    </div>

    {/* Infinite Scrolling Text */}
    <div className="relative flex-1 overflow-hidden h-full flex items-center">
      <div className="flex items-center gap-16 animate-[scrollText_18s_linear_infinite] whitespace-nowrap">
        {[...Array(3)].map((_, idxOuter) =>
          SCROLLER_ITEMS.map(({ text, color }, idxInner) => (
            <span
              key={`${idxOuter}-${idxInner}`}
              className={`font-light text-[18px] lg:text-[26px] ${color} uppercase tracking-wider`}
              //   style={{
              //     letterSpacing: "1px",
              //     textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              //   }}
            >
              {text}
            </span>
          ))
        )}
      </div>
    </div>

    {/* Enhanced Animation Keyframes */}
    <style>
      {`
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}
    </style>
  </div>
);

export default InfiniteScroller;
