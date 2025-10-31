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

  const fetchLetters = async () => {
    try {
      const response = await fetch('/api/letters');
      const data = await response.json();
      setLetters(data.letters || []);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading letters:', error);
      setIsLoaded(true);
    }
  };

  // Load letters from API
  useEffect(() => {
    fetchLetters();
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
      
      let errorText = '';
      if (!response.ok) {
        try {
          errorText = await response.text();
          console.error('Server response:', errorText);
        } catch (e) {
          errorText = 'Could not read error response';
        }
        throw new Error(`Failed to save letter: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result = await response.json();
      if (result.success && result.letter) {
        // Refetch all letters to ensure we have the latest state
        await fetchLetters();
        return result.letter;
      } else {
        console.error('Invalid server response:', result);
        throw new Error('Invalid server response');
      }
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
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete letter: ${errorText}`);
      }

      // Refetch all letters to ensure we have the latest state
      await fetchLetters();
      return true;
    } catch (error) {
      console.error('Error deleting letter:', error);
      throw error;
    }
  }

  const editLetter = async (letter: Letter, authKey: string) => {
    try {
      const response = await fetch(`/api/letters?key=${authKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ letter }),
      });

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Server response:', errorText);
        } catch (e) {
          errorText = 'Could not read error response';
        }
        throw new Error(`Failed to update letter: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result = await response.json();
      if (result.success && result.letter) {
        // Refetch all letters to ensure we have the latest state
        await fetchLetters();
        return result.letter;
      } else {
        console.error('Invalid server response:', result);
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Error updating letter:', error);
      throw error;
    }
  }

  return {
    letters,
    isLoaded,
    addLetter,
    getLetter,
    deleteLetter,
    editLetter,
  }
}
