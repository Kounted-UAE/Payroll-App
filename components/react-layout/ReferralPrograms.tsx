'use client'

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/react-ui/card"
import { Badge } from "@/components/react-ui/badge"
import { Button } from "@/components/react-ui/button"
import { Input } from "@/components/react-ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/react-ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/react-ui/select"
import {
  Search, TrendingUp, FileText, Calculator, Receipt, Check, X, Eye, AlertCircle, CheckCircle, Clock
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/react-ui/dialog"
import { ScrollArea } from "@/components/react-ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/react-ui/tabs"

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}

type MatchRow = {
  id: number
  ticketid: string
  quote_number: string
  invoice_number: string
  match_score: number
  status: string // Now includes confidence info like 'confirmed_high'
}

interface MatchResult {
  ticketid: string
  ticket_subject?: string
  quote_number: string | null
  quote_customer?: string
  invoice_number: string | null
  invoice_to?: string
  match_score: number
  confidence: 'high' | 'medium' | 'low'
  match_reasons: string[]
  ticket_quote_score?: number
  quote_invoice_score?: number
}

export default function SalesMatchingDashboard() {
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [previewMatches, setPreviewMatches] = useState<MatchResult[]>([])
  const [stats, setStats] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState<MatchResult | null>(null)
  const [minScore, setMinScore] = useState<number>(0.3)

  // Fetch matches from DB on load
  useEffect(() => {
    setLoading(true)
    const supabase = createSupabaseClient()
    supabase
      .from('matches')
      .select('*')
      .then(({ data }) => {
        setMatches(data ?? [])
        setLoading(false)
      })
  }, [])

  // Stats
  const totalMatches = matches.length
  const totalPending = matches.filter(m => m.status === 'pending' || m.status?.startsWith('confirmed_') === false).length
  const totalConfirmed = matches.filter(m => m.status?.includes('confirmed')).length
  const totalRejected = matches.filter(m => m.status === 'rejected').length

  // Extract confidence from status
  const getConfidenceFromStatus = (status: string): 'high' | 'medium' | 'low' | null => {
    if (status?.includes('_high')) return 'high'
    if (status?.includes('_medium')) return 'medium'
    if (status?.includes('_low')) return 'low'
    return null
  }

  // Filtered for search and confidence
  const filtered = matches.filter(row => {
    const matchesSearch = 
      (row.ticketid ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (row.quote_number ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (row.invoice_number ?? '').toLowerCase().includes(search.toLowerCase())
    
    const matchesConfidence = confidenceFilter === 'all' || 
      getConfidenceFromStatus(row.status) === confidenceFilter

    return matchesSearch && matchesConfidence
  })

  // Filter preview matches by confidence
  const filteredPreviewMatches = previewMatches.filter(match => 
    confidenceFilter === 'all' || match.confidence === confidenceFilter
  )

  // Approve or reject matches in batch
  const updateStatus = async (ids: number[], status: 'confirmed' | 'rejected') => {
    setLoading(true)
    const supabase = createSupabaseClient()
    await supabase
      .from('matches')
      .update({ status })
      .in('id', ids)
    setMatches(matches =>
      matches.map(row =>
        ids.includes(row.id) ? { ...row, status } : row
      )
    )
    setSelected(new Set())
    setLoading(false)
  }

  // Run auto-match and preview results
  const runAutoMatch = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/run-matching', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minScore, includeStats: true })
      })
      const data = await res.json()
      
      if (data.error) {
        console.error('Matching error:', data.error)
        alert(`Error running matches: ${data.error}`)
        return
      }
      
      setPreviewMatches(data.matches || [])
      setStats(data.stats)
      console.log('Matching completed:', data.summary)
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Open preview modal for a match
  const handlePreview = (match: MatchResult) => {
    setSelectedPreview(match)
    setModalOpen(true)
  }

  // Confirm a preview match (write to matches table)
  const confirmMatch = async (match: MatchResult) => {
    setLoading(true)
    try {
      const res = await fetch('/api/confirm-match', {
        method: 'POST',
        body: JSON.stringify(match),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      
      if (data.error) {
        console.error('Confirm error:', data.error)
        alert(`Error confirming match: ${data.error}`)
        return
      }
      
      setModalOpen(false)
      // Refresh matches from DB
      const supabase = createSupabaseClient()
      const { data: refreshedMatches } = await supabase.from('matches').select('*')
      setMatches(refreshedMatches ?? [])
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return <CheckCircle className="w-4 h-4 text-primary" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'low': return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getConfidenceBadgeVariant = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-lg text-zinc-600 font-bold">Advanced Sales Matching</h1>
            <p className="text-zinc-400">
              AI-powered fuzzy matching for Tickets, Quotes, and Invoices
            </p>
          </div>
          <div className="flex gap-3">
            <Button disabled={selected.size === 0 || loading} onClick={() => updateStatus(Array.from(selected), 'confirmed')}>
              <Check className="mr-2 h-4 w-4" />
              Confirm Selected
            </Button>
            <Button variant="outline" disabled={selected.size === 0 || loading} onClick={() => updateStatus(Array.from(selected), 'rejected')}>
              <X className="mr-2 h-4 w-4" />
              Reject Selected
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">{totalMatches}</p>
                  <p className="text-xs text-zinc-400">Total Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">{totalConfirmed}</p>
                  <p className="text-xs text-zinc-400">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Calculator className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-bold">{totalPending}</p>
                  <p className="text-xs text-zinc-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <Receipt className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-bold">{totalRejected}</p>
                  <p className="text-xs text-zinc-400">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search by Ticket, Quote, or Invoice..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by confidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence Levels</SelectItem>
                  <SelectItem value="high">High Confidence</SelectItem>
                  <SelectItem value="medium">Medium Confidence</SelectItem>
                  <SelectItem value="low">Low Confidence</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">Min Score:</label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={minScore}
                  onChange={(e) => setMinScore(parseFloat(e.target.value) || 0.3)}
                  className="w-24"
                />
              </div>
              <Button onClick={runAutoMatch} disabled={loading}>
                {loading ? "Running..." : "Run Auto-Match"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList>
            <TabsTrigger value="existing">Existing Matches ({totalMatches})</TabsTrigger>
            <TabsTrigger value="preview">Preview Results ({previewMatches.length})</TabsTrigger>
            {stats && <TabsTrigger value="stats">Statistics</TabsTrigger>}
          </TabsList>

          <TabsContent value="existing">
            {/* Matches Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input
                        type="checkbox"
                        checked={filtered.length > 0 && filtered.every(row => selected.has(row.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected(new Set(filtered.map(row => row.id)))
                          } else {
                            setSelected(new Set())
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(row => {
                    const confidence = getConfidenceFromStatus(row.status)
                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selected.has(row.id)}
                            onChange={() => {
                              const next = new Set(selected)
                              next.has(row.id) ? next.delete(row.id) : next.add(row.id)
                              setSelected(next)
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.ticketid}</TableCell>
                        <TableCell>{row.quote_number}</TableCell>
                        <TableCell>{row.invoice_number}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{row.match_score?.toFixed?.(2) ?? row.match_score}</Badge>
                        </TableCell>
                        <TableCell>
                          {confidence && (
                            <div className="flex items-center gap-2">
                              {getConfidenceIcon(confidence)}
                              <Badge variant={getConfidenceBadgeVariant(confidence)}>
                                {confidence}
                              </Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.status?.includes('confirmed')
                                ? "default"
                                : row.status === 'rejected'
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {row.status?.includes('confirmed') ? 'confirmed' : row.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => updateStatus([row.id], 'confirmed')} disabled={row.status?.includes('confirmed') || loading}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateStatus([row.id], 'rejected')} disabled={row.status === 'rejected' || loading}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-zinc-400 py-12">
                        No matches found. Try adjusting your search or confidence filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            {/* Preview Table */}
            {filteredPreviewMatches.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Quote</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPreviewMatches.map((match, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs">{match.ticketid}</TableCell>
                        <TableCell className="max-w-xs truncate">{match.ticket_subject || '-'}</TableCell>
                        <TableCell className="font-mono text-xs">{match.quote_number}</TableCell>
                        <TableCell className="font-mono text-xs">{match.invoice_number || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{match.match_score.toFixed(2)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getConfidenceIcon(match.confidence)}
                            <Badge variant={getConfidenceBadgeVariant(match.confidence)}>
                              {match.confidence}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => handlePreview(match)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button variant="default" size="sm" onClick={() => confirmMatch(match)} disabled={loading}>
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-zinc-400 py-12">
                {previewMatches.length === 0 
                  ? "No preview matches. Run auto-match to generate results." 
                  : "No matches found with current confidence filter."}
              </div>
            )}
          </TabsContent>

          {stats && (
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Total Records</h3>
                    <div className="space-y-1 text-sm">
                      <div>Tickets: {stats.total_tickets}</div>
                      <div>Quotes: {stats.total_quotes}</div>
                      <div>Invoices: {stats.total_invoices}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Match Results</h3>
                    <div className="space-y-1 text-sm">
                      <div>Total Matches: {stats.total_matches}</div>
                      <div>Avg Score: {stats.avg_match_score?.toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Confidence Breakdown</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        High: {stats.high_confidence_matches}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        Medium: {stats.medium_confidence_matches}
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Low: {stats.low_confidence_matches}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Enhanced Review Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Review Match Details</DialogTitle>
            </DialogHeader>
            {selectedPreview && (
              <div className="space-y-6">
                {/* Match Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Ticket</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>ID:</strong> {selectedPreview.ticketid}</div>
                        {selectedPreview.ticket_subject && (
                          <div><strong>Subject:</strong> {selectedPreview.ticket_subject}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Quote</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>Number:</strong> {selectedPreview.quote_number}</div>
                        {selectedPreview.quote_customer && (
                          <div><strong>Customer:</strong> {selectedPreview.quote_customer}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Invoice</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>Number:</strong> {selectedPreview.invoice_number || 'N/A'}</div>
                        {selectedPreview.invoice_to && (
                          <div><strong>To:</strong> {selectedPreview.invoice_to}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Match Scores */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Match Scores</h4>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {getConfidenceIcon(selectedPreview.confidence)}
                        <Badge variant={getConfidenceBadgeVariant(selectedPreview.confidence)}>
                          {selectedPreview.confidence.toUpperCase()} Confidence
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="secondary">
                          Overall: {selectedPreview.match_score.toFixed(2)}
                        </Badge>
                      </div>
                      {selectedPreview.ticket_quote_score && (
                        <div>
                          <Badge variant="outline">
                            T→Q: {selectedPreview.ticket_quote_score.toFixed(2)}
                          </Badge>
                        </div>
                      )}
                      {selectedPreview.quote_invoice_score && (
                        <div>
                          <Badge variant="outline">
                            Q→I: {selectedPreview.quote_invoice_score.toFixed(2)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Match Reasons */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Match Reasons</h4>
                    <ScrollArea className="h-32">
                      <ul className="space-y-1 text-sm">
                        {selectedPreview.match_reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-zinc-400">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => confirmMatch(selectedPreview!)} disabled={loading}>
                {loading ? "Confirming..." : "Confirm Match"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
