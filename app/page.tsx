"use client"
import { Snowfall } from "@/components/snowfall"
import Link from "next/link"
import { useLetters } from "@/hooks/use-letters"

interface LetterPreview {
  id: string
  title: string
  date: string
  preview: string
}

export default function HomePage() {
  const { letters, isLoaded } = useLetters()

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-sans text-foreground mb-4">Christmas Elf Jobs</h1>
        </div>

        {!isLoaded ? (
          <div className="text-center text-muted-foreground">Loading letters...</div>
        ) : letters.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-card rounded-lg shadow-xl p-12 border-2 border-border">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-xl font-sans text-card-foreground mb-2">No letters yet</h2>
              <p className="text-muted-foreground mb-6">Start writing your first letter to begin your collection</p>
              <Link href="/letter/new">
                <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-lg">
                  Write Your First Letter
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {letters.map((letter) => {
              const preview = letter.content 
                ? letter.content.substring(0, 150) + (letter.content.length > 150 ? "..." : "")
                : "No content available"

              return (
                <Link key={letter.id} href={`/letter/${letter.id}`}>
                  <div className="group cursor-pointer transition-transform hover:scale-105 duration-300">
                    <div className="relative">
                      {/* Letter Card */}
                      <div className="bg-card rounded-lg shadow-xl p-6 border-2 border-border h-64 flex flex-col">
                        <h2 className="text-xl font-sans text-card-foreground mb-2">{letter.title}</h2>
                        {/* <p className="text-sm text-muted-foreground mb-4">{letter.date}</p> */}
                        <p className="text-card-foreground/80 leading-relaxed flex-1 line-clamp-4">{preview}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-4">
                          <span>Click to open</span>
                          <svg
                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>


                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Floating Add Button */}
        <Link href="/letter/new">
          <button
            className="fixed bottom-4 md:bottom-8 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 duration-300 z-20"
            aria-label="Create new letter"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  )
}
