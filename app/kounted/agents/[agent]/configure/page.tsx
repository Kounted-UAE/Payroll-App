"use client"

import { useEffect, useMemo, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/react-ui/card"
import { Button } from "@/components/react-ui/button"
import { Input } from "@/components/react-ui/input"
import { Textarea } from "@/components/react-ui/textarea"
import { Label } from "@/components/react-ui/label"
import { Separator } from "@/components/react-ui/separator"
import { Plus, Trash2, Shield } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

type TemplateItem = { id: string; name: string; description?: string }
type SourceRef = { id: string; title: string; url?: string; notes?: string }

type AgentConfig = {
  systemPrompt: string
  jurisdiction: string
  frameworks: string[]
  templates: TemplateItem[]
  sources: SourceRef[]
}

const DEFAULT_CONFIG: AgentConfig = {
  systemPrompt: "",
  jurisdiction: "UAE",
  frameworks: ["IFRS", "CRS", "AML"],
  templates: [],
  sources: [],
}

const allowedAgents = new Set([
  "accounting",
  "taxation",
  "human-resources",
  "company-secretarial",
  "corporate-compliance",
])

function storageKey(agent: string) {
  return `advontier.agent.config.${agent}`
}

export default function AgentConfigurePage() {
  const router = useRouter()
  const { roleSlug, supabase, session } = useAuth() as any
  const isAdmin = !!roleSlug && (roleSlug.startsWith("advontier-") || roleSlug.endsWith("admin"))

  const params = useParams()
  const agent = (params?.agent as string) || ""
  const valid = useMemo(() => allowedAgents.has(agent), [agent])
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG)
  const [configId, setConfigId] = useState<string | null>(null)

  useEffect(() => {
    if (!valid || !agent) return
    const load = async () => {
      // Load agent config from kyc_knowledge_base (category=agent-config, tag agent:<slug>)
      const { data: cfg, error: cfgErr } = await (supabase as any)
        .from("kyc_knowledge_base")
        .select("id, content, title, tags")
        .eq("category", "agent-config")
        .contains("tags", ["agent:" + agent])
        .maybeSingle()

      if (!cfgErr && cfg) {
        try {
          const parsed = JSON.parse(cfg.content || "{}")
          setConfig((prev) => ({
            ...prev,
            systemPrompt: parsed.systemPrompt ?? prev.systemPrompt,
            jurisdiction: parsed.jurisdiction ?? prev.jurisdiction,
            frameworks: Array.isArray(parsed.frameworks) ? parsed.frameworks : prev.frameworks,
          }))
          setConfigId(cfg.id)
        } catch {
          // ignore malformed content
        }
      }

      // Load templates from quote_template_library tagged for this agent
      const { data: tmpl, error: tmplErr } = await (supabase as any)
        .from("quote_template_library")
        .select("id, name, description, tags")
        .contains("tags", ["agent:" + agent])

      if (!tmplErr && Array.isArray(tmpl)) {
        setConfig((prev) => ({ ...prev, templates: tmpl.map((t: any) => ({ id: t.id, name: t.name, description: t.description ?? "" })) }))
      }

      // Load sources from kyc_knowledge_base (category=source-ref)
      const { data: srcs, error: srcErr } = await (supabase as any)
        .from("kyc_knowledge_base")
        .select("id, title, content")
        .eq("category", "source-ref")
        .contains("tags", ["agent:" + agent])

      if (!srcErr && Array.isArray(srcs)) {
        setConfig((prev) => ({
          ...prev,
          sources: srcs.map((s: any) => {
            let url = ""
            let notes = ""
            try {
              const parsed = JSON.parse(s.content || "{}")
              url = parsed.url || ""
              notes = parsed.notes || ""
            } catch {
              // content may not be JSON; store as notes
              notes = s.content || ""
            }
            return { id: s.id, title: s.title, url, notes }
          })
        }))
      }
    }
    load()
  }, [agent, valid, supabase])

  if (!valid) return notFound()
  if (!isAdmin) router.push(`/advontier/agents/${agent}`)

  const save = async () => {
    // Upsert agent config into kyc_knowledge_base
    const id = configId || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`)
    const cfgRow = {
      id,
      category: "agent-config",
      title: `agent-config-${agent}`,
      content: JSON.stringify({ systemPrompt: config.systemPrompt, jurisdiction: config.jurisdiction, frameworks: config.frameworks }),
      tags: ["agent:" + agent, "config"],
      is_active: true,
      created_by_user_id: session?.user?.id || null,
      updated_by: session?.user?.id || null,
      updated_at: new Date().toISOString(),
    }
    await (supabase as any).from("kyc_knowledge_base").upsert(cfgRow)
    setConfigId(id)

    // Upsert templates into quote_template_library
    const tmplRows = config.templates.map((t) => ({
      id: t.id || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`),
      name: t.name,
      description: t.description || null,
      bundle: "agents",
      category: agent,
      jurisdiction: config.jurisdiction || "UAE",
      template_data: {},
      tags: ["agent:" + agent, "template"],
      is_active: true,
      created_by: session?.user?.id || null,
      updated_at: new Date().toISOString(),
    }))
    await (supabase as any).from("quote_template_library").upsert(tmplRows)

    // Upsert sources into kyc_knowledge_base
    const srcRows = config.sources.map((s) => ({
      id: s.id || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`),
      category: "source-ref",
      title: s.title,
      content: JSON.stringify({ url: s.url || "", notes: s.notes || "" }),
      tags: ["agent:" + agent, "source"],
      is_active: true,
      created_by_user_id: session?.user?.id || null,
      updated_by: session?.user?.id || null,
      updated_at: new Date().toISOString(),
    }))
    await (supabase as any).from("kyc_knowledge_base").upsert(srcRows)
  }

  const addFramework = () => setConfig((c) => ({ ...c, frameworks: [...c.frameworks, ""] }))
  const removeFramework = (idx: number) => setConfig((c) => ({ ...c, frameworks: c.frameworks.filter((_, i) => i !== idx) }))
  const updateFramework = (idx: number, val: string) =>
    setConfig((c) => ({ ...c, frameworks: c.frameworks.map((f, i) => (i === idx ? val : f)) }))

  const addTemplate = () =>
    setConfig((c) => ({ ...c, templates: [...c.templates, { id: crypto.randomUUID(), name: "" }] }))
  const updateTemplate = (id: string, patch: Partial<TemplateItem>) =>
    setConfig((c) => ({ ...c, templates: c.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  const removeTemplate = async (id: string) => {
    setConfig((c) => ({ ...c, templates: c.templates.filter((t) => t.id !== id) }))
    if (id) {
      await (supabase as any).from("quote_template_library").delete().eq("id", id)
    }
  }

  const addSource = () => setConfig((c) => ({ ...c, sources: [...c.sources, { id: crypto.randomUUID(), title: "" }] }))
  const updateSource = (id: string, patch: Partial<SourceRef>) =>
    setConfig((c) => ({ ...c, sources: c.sources.map((s) => (s.id === id ? { ...s, ...patch } : s)) }))
  const removeSource = async (id: string) => {
    setConfig((c) => ({ ...c, sources: c.sources.filter((s) => s.id !== id) }))
    if (id) {
      await (supabase as any).from("kyc_knowledge_base").delete().eq("id", id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-zinc-600 font-bold">Configure Agent</h1>
          <p className="text-sm text-blue-200">Manage prompts, frameworks, templates, and source references.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-200">
          <Shield className="h-4 w-4" /> Admin only
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Core Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Jurisdiction</Label>
              <Input value={config.jurisdiction} onChange={(e) => setConfig({ ...config, jurisdiction: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>System Prompt</Label>
              <Textarea rows={4} value={config.systemPrompt} onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })} />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Frameworks (IFRS, CRS, AML, etc.)</Label>
              <Button size="sm" onClick={addFramework}><Plus className="h-4 w-4 mr-1" />Add</Button>
            </div>
            <div className="space-y-2">
              {config.frameworks.map((fw, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={fw} onChange={(e) => updateFramework(idx, e.target.value)} placeholder="e.g., IFRS 15" />
                  <Button variant="ghost" size="icon" onClick={() => removeFramework(idx)} aria-label="Remove framework">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-end">
              <Button size="sm" onClick={addTemplate}><Plus className="h-4 w-4 mr-1" />Add Template</Button>
            </div>
            <div className="space-y-3">
              {config.templates.map((t) => (
                <div key={t.id} className="p-3  rounded space-y-2">
                  <Input value={t.name} onChange={(e) => updateTemplate(t.id, { name: e.target.value })} placeholder="Template name" />
                  <Textarea rows={2} value={t.description || ""} onChange={(e) => updateTemplate(t.id, { description: e.target.value })} placeholder="Description" />
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => removeTemplate(t.id)}><Trash2 className="h-4 w-4 mr-1" />Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-end">
              <Button size="sm" onClick={addSource}><Plus className="h-4 w-4 mr-1" />Add Source</Button>
            </div>
            <div className="space-y-3">
              {config.sources.map((s) => (
                <div key={s.id} className="p-3  rounded space-y-2">
                  <Input value={s.title} onChange={(e) => updateSource(s.id, { title: e.target.value })} placeholder="Title (e.g., UAE CT Law Art. 20)" />
                  <Input value={s.url || ""} onChange={(e) => updateSource(s.id, { url: e.target.value })} placeholder="URL (optional)" />
                  <Textarea rows={2} value={s.notes || ""} onChange={(e) => updateSource(s.id, { notes: e.target.value })} placeholder="Notes (scope, citation)" />
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => removeSource(s.id)}><Trash2 className="h-4 w-4 mr-1" />Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <a href={`/advontier/agents/${agent}`}>Cancel</a>
        </Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  )
}

