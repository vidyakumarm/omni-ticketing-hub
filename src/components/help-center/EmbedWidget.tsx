
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';

export const EmbedWidget: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://cdn.yourdomain.com/help-widget.js" data-site="your-workspace-id"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Embed Help Center Widget</CardTitle>
          <CardDescription>
            Add this script to your website to provide customers with instant access to your help articles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Code
            </label>
            <div className="relative">
              <Textarea
                value={embedCode}
                readOnly
                rows={3}
                className="font-mono text-sm bg-gray-50"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="absolute top-2 right-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The widget appears as a floating button on your website</li>
              <li>• Customers can search through your published help articles</li>
              <li>• If they can't find an answer, they can submit a support ticket</li>
              <li>• The widget is fully customizable to match your brand</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Preview</CardTitle>
          <CardDescription>
            This is how the help widget will appear to your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">?</span>
              </div>
              <p className="text-sm">Help Widget Preview</p>
              <p className="text-xs mt-1">Widget will be rendered here when implemented</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Customization</CardTitle>
          <CardDescription>
            Configure how the widget appears and behaves on your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>Widget customization options will be available in a future update, including:</p>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Custom colors and branding</li>
              <li>• Position (bottom-right, bottom-left, etc.)</li>
              <li>• Welcome message customization</li>
              <li>• Language and localization</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
