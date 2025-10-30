"use client"

import { useState } from "react"
import { Snowfall } from "./snowfall"

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
      <Snowfall />

      <div className="relative z-10 w-full max-w-2xl px-4">
        {!isOpen ? (
          <div
            className="cursor-pointer transition-transform hover:scale-105 duration-300"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              {/* Envelope */}
              <div className="bg-card rounded-lg shadow-2xl p-8 md:p-12 border-2 border-border">
                <div className="aspect-[3/2] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm md:text-base mb-4 font-serif">
                      {"You have received a letter"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 font-serif italic">{"Click to open"}</p>
                  </div>
                </div>
              </div>

              {/* Wax Seal */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <div className="absolute inset-0 bg-accent rounded-full shadow-lg" />
                  <div className="absolute inset-2 bg-accent/80 rounded-full flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8 md:w-10 md:h-10 text-accent-foreground"
                    >
                      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="bg-card rounded-lg shadow-2xl border-2 border-border overflow-hidden">
              {/* Letter Header */}
              <div className="bg-secondary/50 p-6 md:p-8 border-b border-border">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-serif text-card-foreground">{"A Letter For You"}</h1>
                  <button
                    onClick={() => setIsOpen(false)}
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
                <div className="prose prose-lg max-w-none font-serif text-card-foreground">
                  <p className="text-sm text-muted-foreground mb-6">{"December 25th, 2025"}</p>

                  <p className="mb-4 leading-relaxed">{"Dear Friend,"}</p>

                  <p className="mb-4 leading-relaxed">
                    {
                      "As snowflakes dance outside my window, I find myself reflecting on the warmth of cherished memories and the joy of meaningful connections. This letter comes to you with heartfelt wishes for peace, happiness, and wonder."
                    }
                  </p>

                  <p className="mb-4 leading-relaxed">
                    {
                      "In this season of reflection, I am reminded of how precious each moment truly is. The gentle fall of snow, the quiet stillness of winter nights, and the comfort of knowing that somewhere, someone is thinking of you with fondness and care."
                    }
                  </p>

                  <p className="mb-4 leading-relaxed">
                    {
                      "May your days be filled with the magic of simple pleasures—a warm cup of tea, the laughter of loved ones, the beauty of a winter landscape, and the promise of new beginnings that each snowfall brings."
                    }
                  </p>

                  <p className="mb-4 leading-relaxed">
                    {
                      "I hope this letter finds you well and brings a smile to your face. Know that you are thought of with great affection, and that the bond we share transcends distance and time, much like the eternal beauty of falling snow."
                    }
                  </p>

                  <p className="mb-4 leading-relaxed">
                    {
                      "As you read these words, imagine the soft glow of candlelight, the gentle whisper of winter wind, and the knowledge that you are valued beyond measure. May the coming days bring you joy, peace, and countless reasons to celebrate."
                    }
                  </p>

                  <p className="mb-4 leading-relaxed">{"With warmest regards and fondest wishes,"}</p>

                  <p className="italic text-muted-foreground mt-8">{"Your Friend"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
