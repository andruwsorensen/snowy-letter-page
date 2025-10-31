"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLetters, Letter } from "@/hooks/use-letters"
import { useAuth } from "@/hooks/use-auth"

export default function EditLetterPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getLetter, editLetter } = useLetters()
  const { isAdmin } = useAuth()
  const [letter, setLetter] = useState<Letter | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const letter = getLetter(params.id)
    if (!letter) {
      setError("Letter not found")
      return
    }
    setLetter(letter)
  }, [params.id, getLetter])

  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  if (!isAdmin) return null
  if (!letter) return <div className="p-4">{error || "Loading..."}</div>

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const updatedLetter: Letter = {
        ...letter,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        date: formData.get("date") as string,
      }

      const authKey = localStorage.getItem("santa_auth")
      if (!authKey) {
        setError("Not authorized")
        return
      }

      await editLetter(updatedLetter, authKey)
      router.push("/")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update letter")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.2_0.03_250)] to-[oklch(0.15_0.02_250)] p-4">
      <div className="max-w-2xl mx-auto bg-white/90 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Letter</h1>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={letter.title}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                defaultValue={letter.date}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={10}
                defaultValue={letter.content}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}