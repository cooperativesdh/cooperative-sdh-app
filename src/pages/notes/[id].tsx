'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Note } from '@/lib/types'

export default function NoteDetail() {
  const router = useRouter()
  const { id } = router.query
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchNote = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        setNote(data)
        setTitle(data.title)
        setContent(data.content)
      } catch (err) {
        console.error('Error fetching note:', err)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id, router])

  const handleSaveChanges = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: title || 'Sans titre',
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      setNote({ ...note!, title, content })
      setEditing(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!note) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="px-4 py-2 text-slate-600 hover:text-slate-900">
            ← Retour
          </Link>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            {editing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {editing ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold border-b-2 border-primary pb-2"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-slate-600 text-sm">
                Dernière modification :{' '}
                {new Date(note.updated_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <div className="prose prose-sm max-w-none mt-6 whitespace-pre-wrap">
                {content}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
