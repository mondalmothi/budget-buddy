import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
});

interface CategoryManagerProps {
  categories: Array<{ id: string; name: string }>;
  onCategoriesChange: () => void;
}

export const CategoryManager = ({ categories, onCategoriesChange }: CategoryManagerProps) => {
  const { user } = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const validatedData = categorySchema.parse({ name: newCategory.trim() });

      const { error } = await supabase
        .from('categories')
        .insert({ user_id: user.id, name: validatedData.name });

      if (error) throw error;

      toast.success('Category added successfully');
      setNewCategory('');
      onCategoriesChange();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Failed to add category');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    try {
      // Check if category is in use
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id')
        .eq('category', categoryName)
        .limit(1);

      if (transactions && transactions.length > 0) {
        toast.error('Cannot delete category that is in use by transactions');
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast.success('Category deleted successfully');
      onCategoriesChange();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category.id} variant="secondary" className="px-3 py-1">
              {category.name}
              <button
                onClick={() => handleDeleteCategory(category.id, category.name)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
