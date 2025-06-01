
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Edit, Folder, FolderOpen } from 'lucide-react';
import type { Category } from '@/pages/HelpCenter';

interface CategoryTreeProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onEditCategory: (category: Category) => void;
  expandedCategories?: Set<string>;
  onToggleExpanded?: (categoryId: string) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onEditCategory,
  expandedCategories = new Set(),
  onToggleExpanded = () => {}
}) => {
  const renderCategory = (category: Category, level: number = 0) => {
    const isSelected = selectedCategoryId === category.id;
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
            isSelected ? 'bg-blue-50 text-blue-700' : ''
          }`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren ? (
              <button
                onClick={() => onToggleExpanded(category.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <div className="w-5" />
            )}
            
            <button
              onClick={() => onSelectCategory(category.id)}
              className="flex items-center space-x-2 flex-1 text-left"
            >
              {hasChildren ? (
                isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
              ) : (
                <Folder className="h-4 w-4" />
              )}
              <span className="text-sm">{category.name}</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEditCategory(category);
            }}
            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectCategory(null)}
        className={`w-full text-left p-2 rounded-md text-sm hover:bg-gray-50 ${
          selectedCategoryId === null ? 'bg-blue-50 text-blue-700' : ''
        }`}
      >
        All Articles
      </button>
      
      {categories.map(category => renderCategory(category))}

      {categories.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No categories yet. Create categories to organize articles.
        </p>
      )}
    </div>
  );
};
