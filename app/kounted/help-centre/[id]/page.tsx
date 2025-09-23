// app/advontier/help-centre/[id]/page.tsx

"use client"

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/react-ui/button'
import { Input } from '@/components/react-ui/input'
import { Textarea } from '@/components/react-ui/textarea'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function HelpCentreDetail() {
  const params = useParams()
  const id = params?.id as string

  const supabase = useMemo(() => getSupabaseClient(), [])
  const router = useRouter()
  const [row, setRow] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    supabase.from('articles' as any).select('*').eq('id', id).single().then(({ data }) => setRow(data))
  }, [id, supabase])

  async function save() {
    if (!row || !id) return
    const { error } = await supabase.from('articles' as any).update(row).eq('id', id)
    if (!error) router.back()
  }

  if (!row) return <div className="p-6 text-xs text-blue-200">Loading…</div>

  return (
    <div className="p-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-blue-200">Slug</label>
          <Input value={row.slug || ''} onChange={e => setRow({ ...row, slug: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-blue-200">Title</label>
          <Input value={row.title || ''} onChange={e => setRow({ ...row, title: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-blue-200">Description</label>
          <Input value={row.description || ''} onChange={e => setRow({ ...row, description: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-blue-200">MDX Content</label>
          <Textarea className="min-h-[240px] font-mono" value={row.content || ''} onChange={e => setRow({ ...row, content: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  )
}

