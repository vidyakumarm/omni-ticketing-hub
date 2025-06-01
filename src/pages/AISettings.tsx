
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Brain, 
  FileText, 
  Tags, 
  Settings, 
  RefreshCw, 
  Loader2,
  Info,
  Save
} from 'lucide-react';

interface AISettings {
  classification: {
    enabled: boolean;
    confidenceThreshold: number;
    defaultCategoryId: string | null;
    lastTrainedAt: string | null;
  };
  customFieldsAI: {
    enabled: boolean;
    fields: Array<{
      fieldKey: string;
      enabled: boolean;
      lastTrainedAt: string | null;
    }>;
  };
  summaries: {
    enabled: boolean;
    frequency: 'realtime' | 'daily' | 'ondemand';
    lastRegeneratedAt: string | null;
  };
  articleGeneration: {
    enabled: boolean;
    sourceCategoryIds: string[];
    lastGeneratedAt: string | null;
  };
  tagging: {
    enabled: boolean;
    confidenceThreshold: number;
    lastTrainedAt: string | null;
  };
}

interface Job {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  error: string | null;
}

const AISettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettings>({
    classification: {
      enabled: false,
      confidenceThreshold: 0.75,
      defaultCategoryId: null,
      lastTrainedAt: null,
    },
    customFieldsAI: {
      enabled: false,
      fields: [
        { fieldKey: 'product', enabled: false, lastTrainedAt: null },
        { fieldKey: 'priority', enabled: false, lastTrainedAt: null },
        { fieldKey: 'team', enabled: false, lastTrainedAt: null },
      ],
    },
    summaries: {
      enabled: false,
      frequency: 'daily',
      lastRegeneratedAt: null,
    },
    articleGeneration: {
      enabled: false,
      sourceCategoryIds: [],
      lastGeneratedAt: null,
    },
    tagging: {
      enabled: false,
      confidenceThreshold: 0.65,
      lastTrainedAt: null,
    },
  });

  const [runningJobs, setRunningJobs] = useState<{ [key: string]: Job }>({});
  const [saving, setSaving] = useState(false);

  const mockCategories = [
    { id: '1', name: 'General' },
    { id: '2', name: 'Technical Support' },
    { id: '3', name: 'Billing' },
    { id: '4', name: 'Feature Requests' },
  ];

  const mockHelpCenterCategories = [
    { id: '1', name: 'Getting Started' },
    { id: '2', name: 'Troubleshooting' },
    { id: '3', name: 'API Documentation' },
    { id: '4', name: 'Best Practices' },
  ];

  const isJobRunning = (jobType: string) => {
    const job = runningJobs[jobType];
    return job && (job.status === 'pending' || job.status === 'in_progress');
  };

  const startJob = async (jobType: string, endpoint: string, body?: any) => {
    try {
      console.log(`Starting ${jobType} job...`);
      
      // Mock job response
      const jobId = `job_${Date.now()}`;
      const newJob: Job = {
        id: jobId,
        status: 'in_progress',
        progress: 0,
        error: null,
      };

      setRunningJobs(prev => ({ ...prev, [jobType]: newJob }));

      // Simulate job progress
      const progressInterval = setInterval(() => {
        setRunningJobs(prev => {
          const currentJob = prev[jobType];
          if (!currentJob || currentJob.status !== 'in_progress') {
            clearInterval(progressInterval);
            return prev;
          }

          const newProgress = Math.min(currentJob.progress + 10, 100);
          const updatedJob = { ...currentJob, progress: newProgress };

          if (newProgress === 100) {
            updatedJob.status = 'completed';
            clearInterval(progressInterval);
            
            // Update last trained timestamp
            const now = new Date().toISOString();
            setSettings(prevSettings => {
              const updated = { ...prevSettings };
              switch (jobType) {
                case 'classification':
                  updated.classification.lastTrainedAt = now;
                  break;
                case 'customField':
                  // Update specific field
                  break;
                case 'tagging':
                  updated.tagging.lastTrainedAt = now;
                  break;
                case 'summaries':
                  updated.summaries.lastRegeneratedAt = now;
                  break;
                case 'articles':
                  updated.articleGeneration.lastGeneratedAt = now;
                  break;
              }
              return updated;
            });

            toast({
              title: "Job Completed",
              description: `${jobType} job completed successfully.`,
            });
          }

          return { ...prev, [jobType]: updatedJob };
        });
      }, 1000);

    } catch (error) {
      console.error(`Failed to start ${jobType} job:`, error);
      toast({
        title: "Error",
        description: `Failed to start ${jobType} job.`,
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      console.log('Saving AI settings:', settings);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "AI settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: "Failed to save AI settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString() + ' at ' + new Date(timestamp).toLocaleTimeString();
  };

  const hasAnyFeatureEnabled = Object.values(settings).some(section => 
    typeof section === 'object' && 'enabled' in section && section.enabled
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <span>AI & Automation</span>
          </h1>
          <p className="text-gray-600 mt-2">Configure AI-powered features to streamline your support processes</p>
        </div>

        {!hasAnyFeatureEnabled && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Info className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800">Enable AI features to streamline your support processes.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Ticket Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Ticket Classification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="classification-enabled">Enable Classification</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Automatically categorize tickets based on content
                </p>
              </div>
              <Switch
                id="classification-enabled"
                checked={settings.classification.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    classification: { ...prev.classification, enabled: checked }
                  }))
                }
              />
            </div>

            {settings.classification.enabled && (
              <>
                <div className="space-y-3">
                  <Label>Confidence Threshold: {Math.round(settings.classification.confidenceThreshold * 100)}%</Label>
                  <Slider
                    value={[settings.classification.confidenceThreshold * 100]}
                    onValueChange={([value]) =>
                      setSettings(prev => ({
                        ...prev,
                        classification: { ...prev.classification, confidenceThreshold: value / 100 }
                      }))
                    }
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Minimum confidence required for automatic classification
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-category">Default Category</Label>
                  <Select
                    value={settings.classification.defaultCategoryId || ''}
                    onValueChange={(value) =>
                      setSettings(prev => ({
                        ...prev,
                        classification: { ...prev.classification, defaultCategoryId: value || null }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Fallback category when confidence is below threshold
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Model Training</p>
                    <p className="text-xs text-gray-500">
                      Last trained: {formatTimestamp(settings.classification.lastTrainedAt)}
                    </p>
                    {isJobRunning('classification') && (
                      <div className="mt-2 space-y-1">
                        <Progress value={runningJobs.classification?.progress || 0} className="w-48" />
                        <p className="text-xs text-gray-500">Training in progress...</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => startJob('classification', '/api/ai-settings/train-classification')}
                    disabled={isJobRunning('classification')}
                    variant="outline"
                    size="sm"
                  >
                    {isJobRunning('classification') ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Train Model
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Custom Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>AI Custom Fields</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="custom-fields-enabled">Enable Auto-Populate Custom Fields</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Automatically fill custom fields based on ticket content
                </p>
              </div>
              <Switch
                id="custom-fields-enabled"
                checked={settings.customFieldsAI.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    customFieldsAI: { ...prev.customFieldsAI, enabled: checked }
                  }))
                }
              />
            </div>

            {settings.customFieldsAI.enabled && (
              <div className="space-y-4">
                <Label>Available Custom Fields</Label>
                {settings.customFieldsAI.fields.map((field, index) => (
                  <div key={field.fieldKey} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={field.enabled}
                        onCheckedChange={(checked) => {
                          const updatedFields = [...settings.customFieldsAI.fields];
                          updatedFields[index] = { ...field, enabled: !!checked };
                          setSettings(prev => ({
                            ...prev,
                            customFieldsAI: { ...prev.customFieldsAI, fields: updatedFields }
                          }));
                        }}
                      />
                      <div>
                        <p className="font-medium capitalize">{field.fieldKey}</p>
                        <p className="text-xs text-gray-500">
                          Last trained: {formatTimestamp(field.lastTrainedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => startJob(`customField-${field.fieldKey}`, '/api/ai-settings/train-custom-field')}
                      disabled={!field.enabled || isJobRunning(`customField-${field.fieldKey}`)}
                      variant="outline"
                      size="sm"
                    >
                      {isJobRunning(`customField-${field.fieldKey}`) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Train
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Summaries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>AI Summaries</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="summaries-enabled">Enable Summaries</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Generate AI-powered summaries of ticket conversations
                </p>
              </div>
              <Switch
                id="summaries-enabled"
                checked={settings.summaries.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    summaries: { ...prev.summaries, enabled: checked }
                  }))
                }
              />
            </div>

            {settings.summaries.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="summaries-frequency">Summaries Frequency</Label>
                  <Select
                    value={settings.summaries.frequency}
                    onValueChange={(value: 'realtime' | 'daily' | 'ondemand') =>
                      setSettings(prev => ({
                        ...prev,
                        summaries: { ...prev.summaries, frequency: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="ondemand">On Demand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Regenerate Summaries</p>
                    <p className="text-xs text-gray-500">
                      Last regenerated: {formatTimestamp(settings.summaries.lastRegeneratedAt)}
                    </p>
                  </div>
                  <Button
                    onClick={() => startJob('summaries', '/api/ai-settings/generate-summaries')}
                    disabled={isJobRunning('summaries')}
                    variant="outline"
                    size="sm"
                  >
                    {isJobRunning('summaries') ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Regenerate Past 30 Days
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Article Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>AI Article Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="articles-enabled">Enable AI-Generated Articles</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Generate help center articles based on common ticket patterns
                </p>
              </div>
              <Switch
                id="articles-enabled"
                checked={settings.articleGeneration.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    articleGeneration: { ...prev.articleGeneration, enabled: checked }
                  }))
                }
              />
            </div>

            {settings.articleGeneration.enabled && (
              <>
                <div className="space-y-3">
                  <Label>Source Help Center Categories</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {mockHelpCenterCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={settings.articleGeneration.sourceCategoryIds.includes(category.id)}
                          onCheckedChange={(checked) => {
                            const currentIds = settings.articleGeneration.sourceCategoryIds;
                            const newIds = checked
                              ? [...currentIds, category.id]
                              : currentIds.filter(id => id !== category.id);
                            setSettings(prev => ({
                              ...prev,
                              articleGeneration: { ...prev.articleGeneration, sourceCategoryIds: newIds }
                            }));
                          }}
                        />
                        <Label className="text-sm">{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Generate Articles</p>
                    <p className="text-xs text-gray-500">
                      Last generated: {formatTimestamp(settings.articleGeneration.lastGeneratedAt)}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      if (settings.articleGeneration.sourceCategoryIds.length === 0) {
                        toast({
                          title: "Error",
                          description: "Select at least one category.",
                          variant: "destructive",
                        });
                        return;
                      }
                      startJob('articles', '/api/ai-settings/generate-articles');
                    }}
                    disabled={isJobRunning('articles')}
                    variant="outline"
                    size="sm"
                  >
                    {isJobRunning('articles') ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Generate Articles
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tags className="h-5 w-5" />
              <span>AI Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tagging-enabled">Enable AI Tagging</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Automatically suggest and apply tags based on ticket content
                </p>
              </div>
              <Switch
                id="tagging-enabled"
                checked={settings.tagging.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    tagging: { ...prev.tagging, enabled: checked }
                  }))
                }
              />
            </div>

            {settings.tagging.enabled && (
              <>
                <div className="space-y-3">
                  <Label>Tag Confidence Threshold: {Math.round(settings.tagging.confidenceThreshold * 100)}%</Label>
                  <Slider
                    value={[settings.tagging.confidenceThreshold * 100]}
                    onValueChange={([value]) =>
                      setSettings(prev => ({
                        ...prev,
                        tagging: { ...prev.tagging, confidenceThreshold: value / 100 }
                      }))
                    }
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Minimum confidence required for automatic tag application
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Model Training</p>
                    <p className="text-xs text-gray-500">
                      Last trained: {formatTimestamp(settings.tagging.lastTrainedAt)}
                    </p>
                    {isJobRunning('tagging') && (
                      <div className="mt-2 space-y-1">
                        <Progress value={runningJobs.tagging?.progress || 0} className="w-48" />
                        <p className="text-xs text-gray-500">Training in progress...</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => startJob('tagging', '/api/ai-settings/train-tagging')}
                    disabled={isJobRunning('tagging')}
                    variant="outline"
                    size="sm"
                  >
                    {isJobRunning('tagging') ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Train Tagging Model
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AISettingsPage;
