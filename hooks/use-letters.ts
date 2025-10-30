"use client"

import { useState, useEffect } from "react"

export interface Letter {
  id: string
  title: string
  date: string
  content: string
  createdAt: number
}

const STORAGE_KEY = "letters"

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load letters from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLetters(parsed)
      } catch (error) {
        console.error("[v0] Failed to parse letters from storage:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save letters to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters))
    }
  }, [letters, isLoaded])

  const addLetter = (letter: Omit<Letter, "id" | "createdAt">) => {
    const newLetter: Letter = {
      ...letter,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    setLetters((prev) => [newLetter, ...prev])
    return newLetter
  }

  const getLetter = (id: string) => {
    return letters.find((letter) => letter.id === id)
  }

  const deleteLetter = (id: string) => {
    setLetters((prev) => prev.filter((letter) => letter.id !== id))
  }

  return {
    letters,
    isLoaded,
    addLetter,
    getLetter,
    deleteLetter,
  }
}
