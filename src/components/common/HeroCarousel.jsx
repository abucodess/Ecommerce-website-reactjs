import video from "../../assets/video/last.mp4";
import mobile from '../../assets/video/mobilevideo.mp4'
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroCarousel() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background video */}
      <video
        src={video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover hidden md:block"
      />
      <video
        src={mobile}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover block md:hidden"
      />

      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />


      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-6 pb-24 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-3xl text-white">
            <p className="mb-2 ml-2  text-xs font-medium uppercase tracking-[0.35em] text-white/70">
              NEW SEASON
            </p>

            <h1 className="text-4xl font-bold tracking-tight  sm:text-5xl md:text-6xl lg:text-7xl">
              STEP INTO YOUR NEXT
            </h1>

            <p className="mt-5 max-w-xl text-sm text-white/70 sm:text-base md:text-lg">
              Premium footwear. Built for every step.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="group mt-8 flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-gray-200"
            >
              SHOP NOW
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;