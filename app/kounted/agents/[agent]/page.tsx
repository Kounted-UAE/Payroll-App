"use client"

import { useEffect, useMemo, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/react-ui/card"
import { Button } from "@/components/react-ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"

const agentCatalog: Record<string, { title: string; description: string; tags: string[] }> = {
  "accounting": {
    title: "Accounting Agent",
    description: "IFRS-informed bookkeeping, management accounts, and close processes with UAE/GCC specifics (VAT treatment, multi-currency).",
    tags: ["IFRS", "VAT", "Xero", "Multi-entity"],
  },
  "taxation": {
    title: "Taxation Agent",
    description: "UAE Corporate Tax and GCC VAT, with OECD/BEPS context. Supports impact analysis and filing checklists.",
    tags: ["UAE CT", "GCC VAT", "OECD", "BEPS"],
  },
  "human-resources": {
    title: "Human Resources Agent",
    description: "Payroll, WPS generation, EOSB accruals, and HR policy support per UAE Labour Law and free zone nuances.",
    tags: ["WPS", "EOSB", "Payroll", "Policies"],
  },
  "company-secretarial": {
    title: "Company Secretarial Agent",
    description: "Corporate records management: resolutions, meeting minutes, share registers, PoA/ROaa tracking across UAE zones.",
    tags: ["Resolutions", "Registers", "Governance"],
  },
  "corporate-compliance": {
    title: "Corporate Compliance Agent",
    description: "AML/KYC, ESR, UBO, CRS compliance monitoring and documentation, with audit trail and reminders.",
    tags: ["AML", "KYC", "ESR", "CRS"],
  },
}

export default function AgentRuntimePage() {
  const params = useParams()
  const agent = (params?.agent as string) || ""

  const config = useMemo(() => agentCatalog[agent], [agent])
  if (!config) return notFound()

  const { supabase } = useAuth() as any
  const [frameworks, setFrameworks] = useState<string[]>([])
  const [templates, setTemplates] = useState<Array<{ id: string; name: string }>>([])
  const [sources, setSources] = useState<Array<{ id: string; title: string; url?: string }>>([])

  useEffect(() => {
    const load = async () => {
      // Config frameworks
      const { data: cfg } = await (supabase as any)
        .from("kyc_knowledge_base")
        .select("content")
        .eq("category", "agent-config")
        .contains("tags", ["agent:" + params.agent])
        .maybeSingle()
      if (cfg?.content) {
        try {
          const parsed = JSON.parse(cfg.content)
          if (Array.isArray(parsed.frameworks)) setFrameworks(parsed.frameworks)
        } catch {}
      }

      // Templates
      const { data: tmpl } = await (supabase as any)
        .from("quote_template_library")
        .select("id, name, tags")
        .contains("tags", ["agent:" + params.agent])
      if (Array.isArray(tmpl)) setTemplates(tmpl.map((t: any) => ({ id: t.id, name: t.name })))

      // Sources
      const { data: srcs } = await (supabase as any)
        .from("kyc_knowledge_base")
        .select("id, title, content")
        .eq("category", "source-ref")
        .contains("tags", ["agent:" + params.agent])
      if (Array.isArray(srcs)) {
        setSources(
          srcs.map((s: any) => {
            let url = ""
            try {
              const parsed = JSON.parse(s.content || "{}")
              url = parsed.url || ""
            } catch {}
            return { id: s.id, title: s.title, url }
          })
        )
      }
    }
    if (agent) load()
  }, [agent, supabase])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-lg text-zinc-600 font-bold">{config.title}</h1>
          <p className="text-sm text-zinc-400">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/kounted/agents/${agent}/configure`}>Configure</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agent Console</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            This is the interactive agent area. Plug into your existing workflows here. The agent will honor
            configured templates and source references when assisting users.
          </p>
          <div className="flex flex-wrap gap-2">
            {frameworks.length > 0
              ? frameworks.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{t}</span>
                ))
              : config.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{t}</span>
                ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium mb-1">Templates</div>
              <ul className="list-disc pl-5 space-y-1">
                {templates.map((t) => (
                  <li key={t.id}>{t.name}</li>
                ))}
                {templates.length === 0 && <li className="list-none text-zinc-400">No templates yet</li>}
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Sources</div>
              <ul className="list-disc pl-5 space-y-1">
                {sources.map((s) => (
                  <li key={s.id}>
                    {s.url ? (
                      <a className="underline" href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                  </li>
                ))}
                {sources.length === 0 && <li className="list-none text-zinc-400">No sources yet</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

