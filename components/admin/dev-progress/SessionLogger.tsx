"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Save, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateSessionLogRequest, AISessionAnalysis, ProjectFeature } from '@/lib/types/dev-progress';
import { DatePicker } from '@/components/ui/date-picker';

interface SessionLoggerProps {
  features: ProjectFeature[];
  onSessionCreated?: (session: any) => void;
  className?: string;
}

export default function SessionLogger({ features, onSessionCreated, className }: SessionLoggerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AISessionAnalysis | null>(null);
  
  const [formData, setFormData] = useState<CreateSessionLogRequest>({
    session_date: new Date().toISOString().split('T')[0],
    session_title: '',
    summary_text: '',
    features_worked_on: []
  });

  // Add state for the date picker
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleInputChange = (field: keyof CreateSessionLogRequest, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle date change from DatePicker
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      handleInputChange('session_date', dateString);
    }
  };

  const analyzeWithAI = async () => {
    if (!formData.summary_text.trim()) {
      toast.error('Please enter a summary to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/dev-progress/analyze-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary_text: formData.summary_text,
          session_date: formData.session_date
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze session');
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
      
      // Auto-populate features worked on
      if (data.analysis.features_worked_on.length > 0) {
        handleInputChange('features_worked_on', data.analysis.features_worked_on);
      }

      toast.success('AI analysis completed');
    } catch (error) {
      console.error('Error analyzing session:', error);
      toast.error('Failed to analyze session with AI');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.summary_text.trim()) {
      toast.error('Please enter a session summary');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dev-progress/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create session log');
      }

      const data = await response.json();
      
      toast.success('Session log created successfully');
      
      // Reset form
      setFormData({
        session_date: new Date().toISOString().split('T')[0],
        session_title: '',
        summary_text: '',
        features_worked_on: []
      });
      setAiAnalysis(null);
      
      onSessionCreated?.(data.session);
      
    } catch (error) {
      console.error('Error creating session log:', error);
      toast.error('Failed to create session log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = (featureKey: string) => {
    const current = formData.features_worked_on;
    const updated = current.includes(featureKey)
      ? current.filter(f => f !== featureKey)
      : [...current, featureKey];
    
    handleInputChange('features_worked_on', updated);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Log Development Session
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session date and title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session_date">Session Date</Label>
              <DatePicker
                date={selectedDate}
                onDateChange={handleDateChange}
                placeholder="Select session date"
              />
            </div>
            <div>
              <Label htmlFor="session_title">Session Title (Optional)</Label>
              <Input
                id="session_title"
                placeholder="e.g., Payroll UI Improvements"
                value={formData.session_title}
                onChange={(e) => handleInputChange('session_title', e.target.value)}
              />
            </div>
          </div>

          {/* Session summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="summary_text">Session Summary</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={analyzeWithAI}
                disabled={isAnalyzing || !formData.summary_text.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="summary_text"
              placeholder="Describe what you worked on in this session..."
              value={formData.summary_text}
              onChange={(e) => handleInputChange('summary_text', e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-800">AI Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Estimated Hours:</span>{' '}
                    <Badge variant="outline">{aiAnalysis.estimated_hours}h</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>{' '}
                    <Badge variant="outline">{(aiAnalysis.confidence_score * 100).toFixed(0)}%</Badge>
                  </div>
                </div>
                
                {aiAnalysis.achievements.length > 0 && (
                  <div>
                    <p className="font-medium text-sm mb-1">Key Achievements:</p>
                    <ul className="text-xs space-y-1">
                      {aiAnalysis.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiAnalysis.blockers.length > 0 && (
                  <div>
                    <p className="font-medium text-sm mb-1">Blockers Identified:</p>
                    <ul className="text-xs space-y-1">
                      {aiAnalysis.blockers.map((blocker, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          <span>{blocker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiAnalysis.technical_notes && (
                  <div>
                    <p className="font-medium text-sm mb-1">Technical Notes:</p>
                    <p className="text-xs text-blue-700">{aiAnalysis.technical_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Features worked on */}
          <div>
            <Label>Features Worked On</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the features you worked on in this session:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-md p-3">
              {features.map(feature => (
                <div
                  key={feature.feature_key}
                  className={`
                    p-2 rounded border cursor-pointer transition-colors text-sm
                    ${formData.features_worked_on.includes(feature.feature_key)
                      ? 'bg-blue-500 text-blue-500-foreground border-blue-500'
                      : 'bg-background hover:bg-muted border-border'
                    }
                  `}
                  onClick={() => toggleFeature(feature.feature_key)}
                >
                  <div className="font-medium truncate">{feature.title}</div>
                  <div className="text-xs opacity-70 truncate">{feature.category}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Selected: {formData.features_worked_on.length} feature{formData.features_worked_on.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Submit button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  session_date: new Date().toISOString().split('T')[0],
                  session_title: '',
                  summary_text: '',
                  features_worked_on: []
                });
                setAiAnalysis(null);
              }}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Session
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}