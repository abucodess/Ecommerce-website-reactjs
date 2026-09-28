import React, { useState } from "react";
import video from "../../assets/video/last.mp4";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
function HeroCarousel() {
  let [slide, setslide] = useState(0);
  let navigate = useNavigate()
  const slides = [
    {
      type: "video",
      src: video,
      title: "STEP INTO YOUR NEXT",
      button: "SHOP NOW",
    },
    {
      type: "image",
      src: "/images/nike-banner.jpg",
      title: "NIKE COLLECTION",
      button: "SHOP NIKE",
    },
    {
      type: "image",
      src: "/images/adidas-banner.jpg",
      title: "BUILT TO MOVE",
      button: "SHOP ADIDAS",
    },
  ];
  return (
    <section className=" h-screen overflow-hidden">
      <video
        src={video}
        autoPlay
        muted
        loop
        playsInline
        className="w-full  relative h-full object-cover"
      ></video>
      <div className="absolute bottom-6  px-5 py-2.5 cursor-pointer z-10 text-2xl font-bold bg-white rounded-2xl hover:bg-gray-300" onClick={()=>{navigate("/products")}}>
        shop now
      </div>
      
    </section>
  );
}

export default HeroCarousel;
