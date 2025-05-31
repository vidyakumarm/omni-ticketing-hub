
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatarUrl: string;
    role: 'customer' | 'agent';
  };
  timestamp: string;
  content: string;
  attachments: Array<{
    fileName: string;
    url: string;
  }>;
  isInternal: boolean;
}

interface ConversationThreadProps {
  messages: Message[];
  showInternalNotes: boolean;
  onToggleInternalNotes: (show: boolean) => void;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  messages,
  showInternalNotes,
  onToggleInternalNotes,
}) => {
  const filteredMessages = showInternalNotes 
    ? messages 
    : messages.filter(message => !message.isInternal);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Conversation</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleInternalNotes(!showInternalNotes)}
            className="flex items-center gap-2"
          >
            {showInternalNotes ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Internal Notes
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Internal Notes
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredMessages.map((message) => (
            <article
              key={message.id}
              role="article"
              className={`flex gap-3 ${
                message.isInternal ? 'bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400' : ''
              }`}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={message.sender.avatarUrl} />
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">
                    {message.sender.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      message.sender.role === 'customer'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }
                  >
                    {message.sender.role === 'customer' ? 'Customer' : 'Agent'}
                  </Badge>
                  {message.isInternal && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Internal Note
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500 ml-auto">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">Attachments:</h5>
                    {message.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                      >
                        📎 {attachment.fileName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
