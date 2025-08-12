// app/advontier/help-centre/page.tsx

"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getSupabaseClient } from '@/lib/supabase/client'

type ArticleRow = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  category: string | null
  subcategory: string | null
  collection: string | null
  tags: string[] | null
  visibility: string | null
  created_at: string | null
  updated_at: string | null
  author_name?: string | null
  author_role?: string | null
  author_image?: string | null
}

export default function HelpCentreAdminPage() {
  const supabase = useMemo(() => (typeof window !== 'undefined' ? getSupabaseClient() : null), []) as any
  const [rows, setRows] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ArticleRow | null>(null)
  const [creating, setCreating] = useState(false)

  async function load() {
    setLoading(true)
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase.from('articles' as any).select('*').order('created_at', { ascending: false })
    if (!error) setRows((data as unknown as ArticleRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function onCreate() {
    setCreating(true)
    setEditing({
      id: '', slug: '', title: '', description: '', content: '', category: '', subcategory: '', collection: '', tags: [], visibility: 'public', created_at: null, updated_at: null,
      author_name: '', author_role: '', author_image: ''
    })
  }

  async function save(row: ArticleRow) {
    if (!supabase || !row.slug || !row.title) return
    if (!row.id) {
      const { data, error } = await supabase.from('articles' as any).insert({
        slug: row.slug,
        title: row.title,
        description: row.description,
        content: row.content,
        category: row.category,
        subcategory: row.subcategory,
        collection: row.collection,
        tags: row.tags,
        visibility: row.visibility,
        author_name: row.author_name,
        author_role: row.author_role,
        author_image: row.author_image,
      }).select('*').single()
      if (!error && data) {
        setCreating(false)
        setEditing(null)
        load()
      }
    } else {
      const { data, error } = await supabase.from('articles' as any).update({
        slug: row.slug,
        title: row.title,
        description: row.description,
        content: row.content,
        category: row.category,
        subcategory: row.subcategory,
        collection: row.collection,
        tags: row.tags,
        visibility: row.visibility,
        author_name: row.author_name,
        author_role: row.author_role,
        author_image: row.author_image,
      }).eq('id', row.id).select('*').single()
      if (!error && data) {
        setEditing(null)
        load()
      }
    }
  }

  async function remove(id: string) {
    if (!supabase) return
    const { error } = await supabase.from('articles' as any).delete().eq('id', id)
    if (!error) load()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Help Centre Articles</h1>
        <Button onClick={onCreate}>New Article</Button>
      </div>

      {creating && editing && (
        <Editor row={editing} onChange={setEditing} onCancel={() => { setCreating(false); setEditing(null) }} onSave={() => save(editing)} />
      )}

      {loading ? (
        <div className="text-xs text-blue-200">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {rows.map((row) => (
            <div key={row.id} className=" rounded-lg p-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">{row.title}</div>
                  <div className="text-xs text-blue-200">/{row.slug}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(row)}>Edit</Button>
                  <Button variant="destructive" onClick={() => remove(row.id)}>Delete</Button>
                </div>
              </div>
              {editing?.id === row.id && (
                <div className="mt-3">
                  <Editor row={editing} onChange={setEditing} onCancel={() => setEditing(null)} onSave={() => save(editing)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Editor({ row, onChange, onCancel, onSave }: { row: ArticleRow, onChange: (r: ArticleRow) => void, onCancel: () => void, onSave: () => void }) {
  return (
    <div className="rounded-lg  p-3 bg-card space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-blue-200">Slug</label>
          <Input value={row.slug} onChange={e => onChange({ ...row, slug: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Title</label>
          <Input value={row.title} onChange={e => onChange({ ...row, title: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-blue-200">Description</label>
          <Input value={row.description || ''} onChange={e => onChange({ ...row, description: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-blue-200">MDX Content</label>
          <Textarea className="min-h-[200px] font-mono" value={row.content || ''} onChange={e => onChange({ ...row, content: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Category</label>
          <Input value={row.category || ''} onChange={e => onChange({ ...row, category: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Subcategory</label>
          <Input value={row.subcategory || ''} onChange={e => onChange({ ...row, subcategory: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Collection</label>
          <Input value={row.collection || ''} onChange={e => onChange({ ...row, collection: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Tags (comma-separated)</label>
          <Input value={(row.tags || []).join(',')} onChange={e => onChange({ ...row, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Visibility</label>
          <Input value={row.visibility || 'public'} onChange={e => onChange({ ...row, visibility: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Author Name</label>
          <Input value={row.author_name || ''} onChange={e => onChange({ ...row, author_name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Author Role</label>
          <Input value={row.author_role || ''} onChange={e => onChange({ ...row, author_role: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Author Image URL</label>
          <Input value={row.author_image || ''} onChange={e => onChange({ ...row, author_image: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}

