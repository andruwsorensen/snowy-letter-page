"use client"

import { useState, useEffect } from "react"
import { Snowfall } from "./snowfall"
import { useAuth } from "@/hooks/use-auth"
import { useLetters } from "@/hooks/use-letters"

interface LetterProps {
  id: string
  title: string
  date: string
  content: string
}

export default function Letter({ id, title, date, content }: LetterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedContent, setEditedContent] = useState(content)
  const [editedDate, setEditedDate] = useState(date)
  const [isSaving, setIsSaving] = useState(false)
  const { isAdmin } = useAuth()
  const { editLetter } = useLetters()

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
      // Focus the letter for keyboard navigation
      const letterElement = document.querySelector('[role="article"]') as HTMLElement
      if (letterElement) {
        letterElement.focus()
      }
    }, 1800) // Show letter while envelope animation is still playing
    
    // Reset animation state after envelope fades out
    setTimeout(() => {
      setIsAnimating(false)
    }, 3500)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const authKey = localStorage.getItem('santa_auth')
      if (!authKey) {
        alert('Not authorized')
        return
      }

      await editLetter(
        {
          id,
          title: editedTitle,
          content: editedContent,
          date: editedDate,
          createdAt: Date.now(), // This will be overwritten by the server
        },
        authKey
      )
      
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
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
              className={`w-full max-w-2xl mx-auto md:mt-[-300] mt-[-200] ${isAnimating ? 'hidden' : 'block'} custom-scrollbar`}
            />
            
            {/* Animated Envelope Image (APNG) */}
            <img 
              id="animated-envelope"
              src="/animated-envelope.png"
              alt="Envelope opening"
              className={`w-full max-w-2xl mx-auto md:mt-[-300] mt-[-200] ${!isAnimating ? 'hidden' : 'block'}`}
            />
          </div>
        </div>
        {isOpen && (
          <div className="absolute w-[calc(100%-6rem)] sm:w-full max-w-2xl left-1/2 -translate-x-1/2 top-1/2">
            <div className="animate-slide-up overflow-hidden rounded-lg shadow-2xl relative">
              {/* Aged Paper Background */}
              <div className="absolute inset-0 bg-[#FEECE0] opacity-95"></div>
              
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-black/10"></div>
              
              {/* Letter Content with Close Button */}
              <div className="relative p-8 md:p-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {isAdmin && (
                    <button
                      className="text-stone-600 hover:text-stone-800 transition-colors p-2 rounded-full hover:bg-black/5"
                      aria-label="Edit letter"
                      onClick={handleEditClick}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsAnimating(false)
                    }}
                    className="text-stone-600 hover:text-stone-800 transition-colors p-2 rounded-full hover:bg-black/5"
                    aria-label="Close letter"
                  >
                    <svg
                      width="20"
                      height="20"
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
                
                <div className="prose prose-lg max-w-none font-serif text-stone-800">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full text-3xl md:text-3xl font-semibold bg-transparent border-b border-stone-300 focus:border-stone-600 focus:outline-none px-2 py-1"
                      />
                      <input
                        type="text"
                        value={editedDate}
                        onChange={(e) => setEditedDate(e.target.value)}
                        className="w-full text-sm text-stone-600 font-serif italic bg-transparent border-b border-stone-300 focus:border-stone-600 focus:outline-none px-2 py-1"
                      />
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full text-xl whitespace-pre-wrap leading-relaxed bg-transparent border rounded-md border-stone-300 focus:border-stone-600 focus:outline-none p-2 min-h-[200px]"
                      />
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setEditedTitle(title)
                            setEditedContent(content)
                            setEditedDate(date)
                          }}
                          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors rounded-md hover:bg-stone-100"
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 text-sm font-medium text-white bg-background hover:bg-background/90 transition-colors rounded-md hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl md:text-3xl mb-2 font-semibold text-stone-800">{editedTitle}</h1>
                      {/* <p className="text-sm text-stone-600 mb-8 font-serif italic">{editedDate}</p>  don't add back you dummy*/} 
                      <div className="text-xl whitespace-pre-wrap leading-relaxed">{editedContent}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
