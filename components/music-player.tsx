"use client"

import { useState, useRef, useEffect } from 'react'

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showStartButton, setShowStartButton] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = volume
          await audioRef.current.play()
          setIsPlaying(true)
          setShowStartButton(false)
        } catch (error) {
          console.log('Autoplay blocked - waiting for user interaction')
          setShowStartButton(true)
        }
      }
    }
    
    attemptAutoplay()
  }, [])

  const startMusic = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setShowStartButton(false)
      } catch (error) {
        console.error('Failed to start music:', error)
      }
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className="fixed bottom-4 md:bottom-8 left-4 md:left-8 z-50 bg-card/80 backdrop-blur-sm rounded-full shadow-lg border border-border flex items-center gap-3 h-14 md:h-16">
      <audio
        ref={audioRef}
        src="/christmas-music.mp3"
        loop
        onEnded={() => setIsPlaying(false)}
      />
      {showStartButton ? (
        <button
          onClick={startMusic}
          className="h-full px-6 rounded-full bg-accent flex items-center gap-2 text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          Start Christmas Music
        </button>
      ) : (
        <>
          <button
            onClick={togglePlay}
            className="w-12 h-12 md:w-13 md:h-13 ml-2 ft-padding-5px rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <div className="flex items-center gap-2 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground">
              <path d="M12 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
              <path d="M19 10v2" />
              <path d="M5 10v2" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-accent h-1"
            />
          </div>
        </>
      )}
    </div>
  )
}