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

  // Load letters from JSON file
  useEffect(() => {
    fetch('/letters.json')
      .then(response => response.json())
      .then(data => {
        setLetters(data.letters);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error loading letters:', error);
        setIsLoaded(true);
      });
  }, [])

  const addLetter = async (letter: Omit<Letter, "id" | "createdAt">) => {
    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ letter }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save letter');
      }

      const { letter: newLetter } = await response.json();
      setLetters((prev) => [newLetter, ...prev]);
      return newLetter;
    } catch (error) {
      console.error('Error adding letter:', error);
      throw error;
    }
  }

  const getLetter = (id: string) => {
    return letters.find((letter) => letter.id === id)
  }

  const deleteLetter = async (id: string, authKey: string) => {
    try {
      const response = await fetch(`/api/letters?id=${id}&key=${authKey}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete letter');
      }

      setLetters((prev) => prev.filter(letter => letter.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting letter:', error);
      throw error;
    }
  }

  return {
    letters,
    isLoaded,
    addLetter,
    getLetter,
    deleteLetter,
  }
}
