"use client"

import { useState, useEffect } from "react"
import { Snowfall } from "@/components/snowfall"
import { useLetters } from "@/hooks/use-letters"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function LetterPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { getLetter, deleteLetter, isLoaded } = useLetters()
  const { isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [letter, setLetter] = useState<ReturnType<typeof getLetter>>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this letter?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteLetter(id, localStorage.getItem('santa_auth') || '');
      router.push('/');
    } catch (error) {
      console.error('Failed to delete letter:', error);
      alert('Failed to delete letter');
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      const foundLetter = getLetter(id)
      setLetter(foundLetter)

      if (!foundLetter) {
        // Letter not found, redirect to home after a brief delay
        setTimeout(() => router.push("/"), 2000)
      }
    }
  }, [id, isLoaded, getLetter, router])

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
        <Snowfall />
        <div className="text-foreground text-lg">Loading...</div>
      </div>
    )
  }

  if (!letter) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
        <Snowfall />
        <div className="text-center">
          <h1 className="text-2xl font-sans text-foreground mb-4">Letter not found</h1>
          <p className="text-muted-foreground mb-6">Redirecting to home...</p>
          <Link href="/">
            <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-lg">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
      <Snowfall />

      {/* Navigation Buttons */}
      <div className="fixed top-8 left-8 flex gap-4 z-20">
        <Link href="/">
          <button
            className="w-12 h-12 bg-card/80 backdrop-blur-sm hover:bg-card text-card-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 duration-300 border-2 border-border"
            aria-label="Back to home"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        </Link>
        
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-12 h-12 bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 duration-300 border-2 border-red-600 disabled:opacity-50 disabled:hover:scale-100"
            aria-label="Delete letter"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        )}
      </div>

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
                      You have received a letter
                    </p>
                    <p className="text-xs text-muted-foreground/70 font-sans italic">Click to open</p>
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
                  <h1 className="text-2xl md:text-3xl font-sans text-card-foreground">{letter.title}</h1>
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
                  <p className="text-sm text-muted-foreground mb-6">{letter.date}</p>
                  <div className="whitespace-pre-wrap">{letter.content}</div>

                  <div className="whitespace-pre-wrap leading-relaxed">{letter.content}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
