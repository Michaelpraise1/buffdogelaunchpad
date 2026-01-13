import GlowingParticles from "./GlowingParticles";
import InfiniteText from "./InfiniteText";

const HeroSection = () => {
  return (
    <div className="w-full min-h-[60vh] pt-[100px]">
      <GlowingParticles />
      <div className="w-full flex items-center justify-center px-4">
        <button className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-gray-900 font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out border-2 border-yellow-300 hover:border-yellow-200 animate-pulse-glow hover:animate-none">
          <span className="relative z-10 group-hover:animate-shake">
            Start Your Cult
          </span>

          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

          {/* Shaking images container */}
          <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 lg:-bottom-5 left-1/2 transform -translate-x-1/2 w-full h-6 sm:h-8 md:h-10 lg:h-12  flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <img
              src="/images/r.png"
              alt="cult"
              className="w-6 sm:w-7 md:w-8 lg:w-9 xl:w-10 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:animate-bounce group-hover:animate-shake"
              style={{ animationDelay: "0ms" }}
            />
            <img
              src="/images/l.png"
              alt="cult"
              className="w-6 sm:w-7 md:w-8 lg:w-9 xl:w-10 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:animate-bounce group-hover:animate-shake"
              style={{ animationDelay: "150ms" }}
            />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl group-hover:bg-yellow-400/40 transition-all duration-300"></div>

          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-full bg-white/30 scale-0 group-active:scale-100 transition-transform duration-150 ease-out"></div>
        </button>
      </div>
      <div className="flex mx-auto w-full mt-[100px] max-w-[1300px] items-center justify-center px-[20px]">
        <img
          src="/images/banner.png"
          alt="hero"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <InfiniteText />
    </div>
  );
};

export default HeroSection;
