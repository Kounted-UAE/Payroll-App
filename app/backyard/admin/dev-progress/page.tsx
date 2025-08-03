"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  BarChart3, 
  FileText, 
  Database,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

import ProjectTimeline from '@/components/dev-progress/ProjectTimeline';
import SessionLogger from '@/components/dev-progress/SessionLogger';
import FeatureDetailModal from '@/components/dev-progress/FeatureDetailModal';

import type { ProjectFeature, SessionLog, ProgressDashboardData } from '@/lib/types/dev-progress';
import { getAllFeatures } from '@/lib/utils/extract-features';

export default function DevProgressPage() {
  const [features, setFeatures] = useState<ProjectFeature[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionLog[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<ProjectFeature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadFeatures(),
        loadRecentSessions()
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/dev-progress/features');
      
      if (!response.ok) {
        // If features don't exist yet, initialize them
        if (response.status === 500) {
          await initializeFeatures();
          return;
        }
        throw new Error('Failed to fetch features');
      }

      const data = await response.json();
      setFeatures(data.features || []);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading features:', error);
      // Try to initialize features if they don't exist
      if (!isInitialized) {
        await initializeFeatures();
      }
    }
  };

  const initializeFeatures = async () => {
    try {
      const extractedFeatures = getAllFeatures();
      
      // Create features one by one to handle any conflicts
      const createdFeatures: ProjectFeature[] = [];
      
      for (const featureData of extractedFeatures) {
        try {
          const response = await fetch('/api/dev-progress/features', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(featureData)
          });

          if (response.ok) {
            const result = await response.json();
            createdFeatures.push(result.feature);
          } else {
            console.warn(`Failed to create feature: ${featureData.title}`);
          }
        } catch (error) {
          console.warn(`Error creating feature ${featureData.title}:`, error);
        }
      }
      
      setFeatures(createdFeatures);
      setIsInitialized(true);
      toast.success(`Initialized ${createdFeatures.length} features`);
    } catch (error) {
      console.error('Error initializing features:', error);
      toast.error('Failed to initialize features');
    }
  };

  const loadRecentSessions = async () => {
    try {
      const response = await fetch('/api/dev-progress/sessions?limit=20');
      
      if (response.ok) {
        const data = await response.json();
        setRecentSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleSessionCreated = (newSession: SessionLog) => {
    setRecentSessions(prev => [newSession, ...prev]);
    // Refresh features to update progress
    loadFeatures();
    toast.success('Session logged and progress updated');
  };

  const handleFeatureClick = (feature: ProjectFeature) => {
    setSelectedFeature(feature);
  };

  const getOverviewStats = () => {
    const totalFeatures = features.length;
    const completedFeatures = features.filter(f => f.status === 'completed').length;
    const inProgressFeatures = features.filter(f => f.status === 'in-progress').length;
    const plannedFeatures = features.filter(f => f.status === 'planned').length;
    const blockedFeatures = features.filter(f => f.status === 'blocked').length;
    
    const overallCompletion = totalFeatures > 0 
      ? features.reduce((sum, f) => sum + f.completion_percentage, 0) / totalFeatures 
      : 0;
    
    const estimatedTotalHours = features.reduce((sum, f) => sum + f.estimated_hours, 0);
    const hoursSpent = recentSessions.reduce((sum, s) => sum + (s.ai_estimated_hours || 0), 0);

    return {
      totalFeatures,
      completedFeatures,
      inProgressFeatures,
      plannedFeatures,
      blockedFeatures,
      overallCompletion,
      estimatedTotalHours,
      hoursSpent
    };
  };

  const stats = getOverviewStats();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading development progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Development Progress</h1>
          <p className="text-muted-foreground mt-1">
            Track features, sessions, and project milestones
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={initializeData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {!isInitialized && (
            <Button onClick={initializeFeatures}>
              <Database className="h-4 w-4 mr-2" />
              Initialize Features
            </Button>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalFeatures}</div>
            <p className="text-xs text-muted-foreground">Total Features</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completedFeatures}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgressFeatures}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.plannedFeatures}</div>
            <p className="text-xs text-muted-foreground">Planned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.overallCompletion.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.hoursSpent.toFixed(0)}h</div>
            <p className="text-xs text-muted-foreground">Hours Logged</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <FileText className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="logger">
            <Plus className="h-4 w-4 mr-2" />
            Log Session
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <ProjectTimeline 
            features={features}
            recentSessions={recentSessions}
            onFeatureClick={handleFeatureClick}
          />
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">
                            {session.session_title || 'Development Session'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.session_date).toLocaleDateString()}
                          </p>
                        </div>
                        {session.ai_estimated_hours && (
                          <Badge variant="outline">{session.ai_estimated_hours}h</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-3">{session.summary_text}</p>
                      {session.features_worked_on.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {session.features_worked_on.map((featureKey) => {
                            const feature = features.find(f => f.feature_key === featureKey);
                            return (
                              <Badge key={featureKey} variant="secondary" className="text-xs">
                                {feature?.title || featureKey}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sessions logged yet</p>
                  <p className="text-sm">Start by logging your first development session</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{stats.completedFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{stats.inProgressFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Planned</span>
                    <span className="font-medium">{stats.plannedFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blocked</span>
                    <span className="font-medium">{stats.blockedFeatures}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Development Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Estimated Hours</span>
                    <span className="font-medium">{stats.estimatedTotalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hours Logged</span>
                    <span className="font-medium">{stats.hoursSpent.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sessions Logged</span>
                    <span className="font-medium">{recentSessions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Hours/Session</span>
                    <span className="font-medium">
                      {recentSessions.length > 0 
                        ? (stats.hoursSpent / recentSessions.length).toFixed(1) 
                        : '0'
                      }h
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logger">
          <SessionLogger 
            features={features}
            onSessionCreated={handleSessionCreated}
          />
        </TabsContent>
      </Tabs>

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  );
}