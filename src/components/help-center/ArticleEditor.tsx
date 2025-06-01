
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Save, Eye } from 'lucide-react';
import type { Article, Category } from '@/pages/HelpCenter';

interface ArticleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Partial<Article>) => void;
  article?: Article | null;
  categories: Category[];
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  article,
  categories
}) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    categoryId: article?.categoryId || '',
    status: article?.status || 'draft' as 'draft' | 'published',
    content: article?.content || '',
    metaTitle: article?.metaTitle || '',
    metaDescription: article?.metaDescription || ''
  });

  const [isSeoOpen, setIsSeoOpen] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        categoryId: article.categoryId,
        status: article.status,
        content: article.content,
        metaTitle: article.metaTitle || '',
        metaDescription: article.metaDescription || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        categoryId: '',
        status: 'draft',
        content: '',
        metaTitle: '',
        metaDescription: ''
      });
    }
  }, [article]);

  useEffect(() => {
    // Auto-generate slug from title
    if (!article && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 50);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, article]);

  const handleSubmit = (status: 'draft' | 'published') => {
    const articleData: Partial<Article> = {
      title: formData.title,
      slug: formData.slug,
      categoryId: formData.categoryId,
      status,
      content: formData.content,
      metaTitle: formData.metaTitle || undefined,
      metaDescription: formData.metaDescription || undefined
    };

    if (article) {
      articleData.id = article.id;
    }

    onSave(articleData);
  };

  const isValid = formData.title.trim().length > 0 && 
                  formData.slug.trim().length > 0 && 
                  formData.categoryId.trim().length > 0 && 
                  formData.content.trim().length >= 20;

  const flattenCategories = (cats: Category[], level: number = 0): Array<Category & { level: number }> => {
    const result: Array<Category & { level: number }> = [];
    for (const cat of cats) {
      result.push({ ...cat, level });
      if (cat.children) {
        result.push(...flattenCategories(cat.children, level + 1));
      }
    }
    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., How to get started"
                maxLength={100}
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {flatCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {'  '.repeat(cat.level)}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g., how-to-get-started"
              pattern="^[a-z0-9\-]+$"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens
            </p>
          </div>

          <div>
            <Label>Publish Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft">Draft</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="published" id="published" />
                <Label htmlFor="published">Published</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your article content in Markdown..."
              rows={12}
              className="mt-1 font-mono"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 20 characters. Supports Markdown formatting.
            </p>
          </div>

          <Collapsible open={isSeoOpen} onOpenChange={setIsSeoOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                SEO Settings
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title for search engines"
                  maxLength={60}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Brief description for search engine results"
                  maxLength={155}
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/155 characters
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={!isValid}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                disabled={!isValid}
              >
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
