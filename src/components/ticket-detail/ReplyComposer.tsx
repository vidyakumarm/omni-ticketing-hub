
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReplyComposerProps {
  onReply: (content: string, isInternal: boolean, attachments: File[]) => void;
}

export const ReplyComposer: React.FC<ReplyComposerProps> = ({ onReply }) => {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (content.trim()) {
      onReply(content, isInternal, attachments);
      setContent('');
      setIsInternal(false);
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reply</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="reply-content" className="sr-only">
            Reply content
          </Label>
          <Textarea
            id="reply-content"
            placeholder="Type your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] resize-none"
            aria-describedby="reply-help"
          />
          <p id="reply-help" className="text-xs text-gray-500 mt-1">
            Press Cmd+Enter to send, Shift+Enter for new line
          </p>
        </div>

        {/* File Attachments */}
        <div>
          <Label htmlFor="file-upload" className="text-sm font-medium">
            Attachments
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-1"
          />
          
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Internal Note Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="internal-note"
            checked={isInternal}
            onCheckedChange={setIsInternal}
          />
          <Label htmlFor="internal-note" className="text-sm">
            Add as internal note (visible only to agents)
          </Label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="min-w-[120px]"
          >
            {isInternal ? 'Add Note' : 'Send Reply'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
