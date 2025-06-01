
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryTree } from '@/components/help-center/CategoryTree';
import { ArticlesTable } from '@/components/help-center/ArticlesTable';
import { CategoryModal } from '@/components/help-center/CategoryModal';
import { ArticleEditor } from '@/components/help-center/ArticleEditor';
import { ArticleDetail } from '@/components/help-center/ArticleDetail';
import { EmbedWidget } from '@/components/help-center/EmbedWidget';
import { Search, Plus } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  children?: Category[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  status: 'draft' | 'published';
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isArticleEditorOpen, setIsArticleEditorOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleDetailOpen, setIsArticleDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'articles' | 'embed'>('articles');

  // Mock data
  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Getting Started',
      slug: 'getting-started',
      parentId: null,
      order: 1,
      children: [
        {
          id: 'cat-1-1',
          name: 'Setup Guide',
          slug: 'setup-guide',
          parentId: 'cat-1',
          order: 1
        }
      ]
    },
    {
      id: 'cat-2',
      name: 'Billing',
      slug: 'billing',
      parentId: null,
      order: 2
    },
    {
      id: 'cat-3',
      name: 'Technical',
      slug: 'technical',
      parentId: null,
      order: 3
    }
  ];

  const articles: Article[] = [
    {
      id: 'art-1',
      title: 'How to get started with our platform',
      slug: 'how-to-get-started',
      categoryId: 'cat-1',
      status: 'published',
      content: '# Getting Started\n\nWelcome to our platform...',
      metaTitle: 'Getting Started Guide',
      metaDescription: 'Learn how to get started with our platform',
      createdBy: { id: 'user-1', name: 'John Doe' },
      createdAt: '2025-06-01T10:00:00Z',
      updatedAt: '2025-06-01T10:00:00Z'
    },
    {
      id: 'art-2',
      title: 'Understanding billing cycles',
      slug: 'billing-cycles',
      categoryId: 'cat-2',
      status: 'published',
      content: '# Billing Cycles\n\nOur billing works as follows...',
      createdBy: { id: 'user-1', name: 'John Doe' },
      createdAt: '2025-06-01T11:00:00Z',
      updatedAt: '2025-06-01T11:00:00Z'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryId || article.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setIsArticleEditorOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleEditorOpen(true);
  };

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleDetailOpen(true);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    console.log('Saving category:', categoryData);
    setIsCategoryModalOpen(false);
  };

  const handleSaveArticle = (articleData: Partial<Article>) => {
    console.log('Saving article:', articleData);
    setIsArticleEditorOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === 'articles' ? 'default' : 'outline'}
              onClick={() => setViewMode('articles')}
            >
              Articles
            </Button>
            <Button
              variant={viewMode === 'embed' ? 'default' : 'outline'}
              onClick={() => setViewMode('embed')}
            >
              Embed Widget
            </Button>
            <Button onClick={handleCreateArticle}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Article
            </Button>
          </div>
        </div>

        {viewMode === 'articles' ? (
          <div className="flex gap-6">
            {/* Category Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Categories</h3>
                  <Button size="sm" variant="ghost" onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <CategoryTree
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  onEditCategory={handleEditCategory}
                />
              </div>
            </div>

            {/* Articles Main Panel */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {selectedCategoryId ? 'No articles in this category.' : 'Create your first help article.'}
                  </p>
                  <Button onClick={handleCreateArticle}>
                    Add New Article
                  </Button>
                </div>
              ) : (
                <ArticlesTable
                  articles={filteredArticles}
                  categories={categories}
                  onEdit={handleEditArticle}
                  onView={handleViewArticle}
                />
              )}
            </div>
          </div>
        ) : (
          <EmbedWidget />
        )}

        {/* Modals */}
        {isCategoryModalOpen && (
          <CategoryModal
            isOpen={isCategoryModalOpen}
            category={selectedCategory}
            categories={categories}
            onClose={() => setIsCategoryModalOpen(false)}
            onSave={handleSaveCategory}
          />
        )}

        {isArticleEditorOpen && (
          <ArticleEditor
            isOpen={isArticleEditorOpen}
            article={selectedArticle}
            categories={categories}
            onClose={() => setIsArticleEditorOpen(false)}
            onSave={handleSaveArticle}
          />
        )}

        {isArticleDetailOpen && selectedArticle && (
          <ArticleDetail
            isOpen={isArticleDetailOpen}
            article={selectedArticle}
            categories={categories}
            onClose={() => setIsArticleDetailOpen(false)}
            onEdit={() => {
              setIsArticleDetailOpen(false);
              handleEditArticle(selectedArticle);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default HelpCenter;
