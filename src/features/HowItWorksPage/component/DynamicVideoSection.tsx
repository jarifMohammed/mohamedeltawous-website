"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  Info,
  PlayCircle,
} from "lucide-react";

const MOCK_VIDEOS = [
  {
    id: "1",
    title: "Second Sight Platform Overview",
    description:
      "Discover how our Strategic Decision platform guides you from uncertainty to high-conviction decision making, testing multiple futures.",
    date: "Oct 24, 2023",
    src: "/videos/SecondSight.webm",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Scenario Planning Masterclass",
    description:
      "Learn the fundamentals of scenario planning and how to apply them to identify hidden growth opportunities in your business.",
    date: "Nov 12, 2023",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Wind Tunneling Strategies",
    description:
      "A deep dive into testing your strategic moves against multiple simulated futures to ensure resilience and adaptability.",
    date: "Dec 05, 2023",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800",
  },
];

export function DynamicVideoSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Muted by default for auto-play friendliness
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeVideo = MOCK_VIDEOS[activeVideoIndex];

  // Handle video change and loading
  useEffect(() => {
    // Simulate slight network delay for the placeholder animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay might be blocked by browser
            setIsPlaying(false);
          });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [activeVideoIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 mt-12 mb-16">
      {/* Video Player Container */}
      <div className="relative w-full aspect-[16/9] md:aspect-[16/9] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group border border-gray-100 hover:border-gray-200 transition-colors duration-500">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10"
            >
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </motion.div>
          ) : (
            <motion.div
              key={activeVideo.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={activeVideo.src}
                muted={isMuted}
                playsInline
                controls={false}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-6 z-20">
          <div className="pointer-events-auto flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-all hover:scale-105 shadow-lg backdrop-blur-sm"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 md:w-7 md:h-7" />
              ) : (
                <Play className="w-6 h-6 md:w-7 md:h-7 ml-1" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-md border border-white/10"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Big Play Button Overlay for when paused */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none z-10 transition-opacity duration-500">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-2xl shadow-black/50 border border-white/20">
              <Play className="w-10 h-10 md:w-12 md:h-12 ml-2 opacity-90" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
