"use client"

import { useState } from "react"
import { Snowfall } from "./snowfall"

interface LetterProps {
  title: string
  date: string
  content: string
}

export default function Letter({ title, date, content }: LetterProps) {
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
                    <p className="text-muted-foreground text-sm md:text-base mb-4 font-sans">
                      {"You have received a letter"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 font-sans italic">{"Click to open"}</p>
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
                  <h1 className="text-2xl md:text-3xl font-sans text-card-foreground">{title}</h1>
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
