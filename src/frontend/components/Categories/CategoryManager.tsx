import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  newCategory: string;
  setNewCategory: (name: string) => void;
  onAddCategory: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  newCategory,
  setNewCategory,
  onAddCategory
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={onAddCategory} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-2 p-2 rounded border">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-sm">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;