"use client"

import { useState, useEffect } from "react"
import { Snowfall } from "./snowfall"

interface LetterProps {
  title: string
  date: string
  content: string
}

export default function Letter({ title, date, content }: LetterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleEnvelopeClick = () => {
    setIsAnimating(true)
    // Get the APNG element
    const apng = document.querySelector('#animated-envelope') as HTMLImageElement
    if (apng) {
      // Reset the image to force animation restart
      apng.src = apng.src;
    }
    // Show letter while envelope is still visible
    setTimeout(() => {
      setIsOpen(true)
    }, 1800) // Show letter while envelope animation is still playing
    
    // Reset animation state after envelope fades out
    setTimeout(() => {
      setIsAnimating(false)
    }, 3500)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
      <Snowfall />

      <div className="relative z-10 w-full max-w-5xl px-4">
        <div
          className={`cursor-pointer transition-all duration-300 ${
            isAnimating ? 'animate-envelope-open' : 'hover:scale-105'
          } ${isOpen ? 'opacity-0 transition-opacity duration-1000' : ''}`}
          onClick={handleEnvelopeClick}
        >
          <div className="relative">
            {/* Static Envelope Image */}
            <img 
              src="/static-envelope.png" 
              alt="Envelope"
              className={`w-full max-w-3xl mx-auto ${isAnimating ? 'hidden' : 'block'}`}
            />
            
            {/* Animated Envelope Image (APNG) */}
            <img 
              id="animated-envelope"
              src="/animated-envelope.png"
              alt="Envelope opening"
              className={`w-full max-w-3xl mx-auto ${!isAnimating ? 'hidden' : 'block'}`}
            />
          </div>
        </div>
        {isOpen && (
          <div className="absolute w-full max-w-2xl left-1/2 -translate-x-1/2 top-1/2">
            <div className="animate-slide-up bg-card rounded-lg shadow-2xl border-2 border-border overflow-hidden">
              {/* Letter Header */}
              <div className="bg-secondary/50 p-6 md:p-8 border-b border-border">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-sans text-card-foreground">{title}</h1>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsAnimating(false)
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close letter"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Letter Content - Scrollable */}
              <div className="p-6 md:p-10 max-h-[60vh] overflow-y-auto">
                <div className="prose prose-lg max-w-none font-sans text-card-foreground">
                  <p className="text-sm text-muted-foreground mb-6">{date}</p>
                  <div className="whitespace-pre-wrap">{content}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
