"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { Shield, FileText, Database } from "lucide-react"

const agents = [
  { slug: "accounting", title: "Accounting", description: "IFRS-aware bookkeeping, reporting and close processes for UAE/GCC." },
  { slug: "taxation", title: "Taxation", description: "UAE CT/VAT with GCC cooperation, OECD, CRS, BEPS alignment." },
  { slug: "human-resources", title: "Human Resources", description: "Payroll, WPS, EOSB, policies aligned with UAE Labour Law and GCC variants." },
  { slug: "company-secretarial", title: "Company Secretarial", description: "Corporate records, resolutions, board governance, RoAA, POA tracking." },
  { slug: "corporate-compliance", title: "Corporate Compliance", description: "AML/KYC, ESR, UBO, CRS reporting and monitoring across jurisdictions." },
]

export default function AgentsIndexPage() {
  const { roleSlug } = useAuth()
  const isAdmin = !!roleSlug && (roleSlug.startsWith("advontier-") || roleSlug.endsWith("admin"))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Specialist Agents</h1>
          <p className="text-sm text-muted-foreground">UAE/GCC focused, aligned with international frameworks such as IFRS, CRS and AML.</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" /> Admin configurable
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.slug}>
            <CardHeader>
              <CardTitle className="text-base">{agent.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{agent.description}</p>
              <div className="flex items-center gap-2">
                <Button asChild size="sm">
                  <Link href={`/backyard/agents/${agent.slug}`}>Open Agent</Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/backyard/agents/${agent.slug}/configure`}>
                      Configure
                    </Link>
                  </Button>
                )}
              </div>
              {isAdmin && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> Templates</span>
                  <span className="inline-flex items-center gap-1"><Database className="h-3 w-3" /> Sources</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

