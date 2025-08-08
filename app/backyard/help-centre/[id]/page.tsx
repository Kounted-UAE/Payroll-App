// app/backyard/help-centre/[id]/page.tsx

"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function HelpCentreDetail({ params }: { params: { id: string } }) {
  const supabase = useMemo(() => getSupabaseClient(), [])
  const router = useRouter()
  const [row, setRow] = useState<any>(null)

  useEffect(() => {
    supabase.from('articles' as any).select('*').eq('id', params.id).single().then(({ data }) => setRow(data))
  }, [params.id])

  async function save() {
    if (!row) return
    const { error } = await supabase.from('articles' as any).update(row).eq('id', params.id)
    if (!error) router.back()
  }

  if (!row) return <div className="p-6 text-xs text-muted-foreground">Loading…</div>

  return (
    <div className="p-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Slug</label>
          <Input value={row.slug || ''} onChange={e => setRow({ ...row, slug: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Title</label>
          <Input value={row.title || ''} onChange={e => setRow({ ...row, title: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-muted-foreground">Description</label>
          <Input value={row.description || ''} onChange={e => setRow({ ...row, description: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-muted-foreground">MDX Content</label>
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

