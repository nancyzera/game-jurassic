import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();



const App = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showMusicIcon, setShowMusicIcon] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, show icon
          setShowMusicIcon(true);
        });
      }
    }
  }, []);

  const handleMusicIconClick = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
      setShowMusicIcon(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Background music audio element */}
        <audio
          ref={audioRef}
          src="/background-music/create advanture audio for  jurassic gam.mp3"
          autoPlay
          loop
          hidden
        />
        {showMusicIcon && (
          <div
            onClick={handleMusicIconClick}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1000,
              cursor: "pointer",
              background: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Play background music"
          >
            {/* Music note SVG icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
        )}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
