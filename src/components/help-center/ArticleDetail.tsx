
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, ExternalLink } from 'lucide-react';
import type { Article, Category } from '@/pages/HelpCenter';

interface ArticleDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  article: Article;
  categories: Category[];
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  isOpen,
  onClose,
  onEdit,
  article,
  categories
}) => {
  const getCategoryName = (categoryId: string) => {
    const findCategory = (cats: Category[]): string => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat.name;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return 'Unknown';
    };
    return findCategory(categories);
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Simple markdown-to-HTML conversion for preview
  const renderContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
              <DialogTitle className="text-2xl">{article.title}</DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(article.status)}>
                {article.status}
              </Badge>
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {article.status === 'published' && (
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Site
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>{getCategoryName(article.categoryId)}</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{article.title}</span>
          </nav>

          {/* Article Meta */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <span>By {article.createdBy.name}</span>
                <span className="mx-2">•</span>
                <span>Updated {formatDate(article.updatedAt)}</span>
              </div>
              <div>
                <span>/{article.slug}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
              className="space-y-4"
            />
          </div>

          {/* SEO Info */}
          {(article.metaTitle || article.metaDescription) && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">SEO Information</h4>
              <div className="space-y-2 text-sm">
                {article.metaTitle && (
                  <div>
                    <span className="font-medium">Meta Title:</span> {article.metaTitle}
                  </div>
                )}
                {article.metaDescription && (
                  <div>
                    <span className="font-medium">Meta Description:</span> {article.metaDescription}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
