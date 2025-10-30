"use client"

import type React from "react"

import { useState } from "react"
import { Snowfall } from "@/components/snowfall"
import { useRouter } from "next/navigation"
import { useLetters } from "@/hooks/use-letters"
import { useAuth } from "@/hooks/use-auth"

export default function NewLetterPage() {
  const router = useRouter()
  const { addLetter } = useLetters()
  const { isAdmin, login } = useAuth()
  const [key, setKey] = useState("")
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  )
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLetter = addLetter({ title, date, content })
    console.log("Created letter:", newLetter)

    // Navigate back to home
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)]">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-sans text-foreground mb-4">Compose a Letter</h1>
          </div>

          {!isAdmin ? (
            /* Auth Form Card */
            <div className="bg-card rounded-lg shadow-2xl border-2 border-border overflow-hidden">
              <div className="p-6 md:p-10 space-y-6">
                <div>
                  <label htmlFor="key" className="block text-sm font-medium text-black mb-2">
                    Enter Santa's Secret Password
                  </label>
                  <input
                    type="password"
                    id="key"
                    value={key}
                    onChange={(e) => {
                      setKey(e.target.value)
                      setError("")
                    }}
                    placeholder="Santa's Secret Password"
                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-lg text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-sans"
                  />
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    if (!login(key)) {
                      setError("Invalid key! Are you really Santa?")
                    }
                  }}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-lg"
                >
                  Unlock Letter Writing
                </button>
              </div>
            </div>
          ) : (
            /* Form Card */
            <div className="bg-card rounded-lg shadow-2xl border-2 border-border overflow-hidden hidden">
              <form onSubmit={handleSubmit}>
                <div className="p-6 md:p-10 space-y-6">
                  {/* Form fields */}
                </div>
              </form>
            </div>
          )}
          <div>
          </div>
          <div className="bg-card rounded-lg shadow-2xl border-2 border-border overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Form Header */}
              <div className="bg-secondary/50 p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                  <h2 className="text-xl font-sans text-card-foreground">New Letter</h2>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-10 space-y-6">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                    Letter Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-lg text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-sans text-lg"
                  />
                </div>

                {/* Date Field */}
                {/* <div>
                  <label htmlFor="date" className="block text-sm font-medium text-card-foreground mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="December 25th, 2025"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-lg text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div> */}

                {/* Content Field */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-card-foreground mb-2">
                    Letter Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Dear Elf..."
                    required
                    rows={12}
                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-lg text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-sans leading-relaxed resize-none"
                  />
                </div>

                {/* Character Count */}
                <div className="text-right text-sm text-muted-foreground">{content.length} characters</div>
              </div>

              {/* Form Actions */}
              <div className="bg-secondary/30 p-6 border-t border-border flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-background border-2 border-border text-white hover:text-white rounded-lg hover:bg-background/90 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-lg"
                >
                  Create Letter
                </button>
              </div>
            </form>
          </div>

          {/* Decorative Seal */}
          <div className="flex justify-center mt-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
              <div className="absolute inset-0 bg-accent rounded-full shadow-lg" />
              <div className="absolute inset-2 bg-accent/80 rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 text-accent-foreground"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
