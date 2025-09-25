import { Category } from '../../frontend/types';
import { DataStore } from '../data/DataStore';

export class CategoryService {
  private dataStore = DataStore.getInstance();

  private getDefaultCategories(): Category[] {
    return [
      { id: '1', name: 'Food & Dining', color: '#8B5CF6' },
      { id: '2', name: 'Transportation', color: '#10B981' },
      { id: '3', name: 'Shopping', color: '#F59E0B' },
      { id: '4', name: 'Entertainment', color: '#EF4444' },
      { id: '5', name: 'Bills & Utilities', color: '#3B82F6' },
      { id: '6', name: 'Healthcare', color: '#EC4899' },
    ];
  }

  initializeCategories(): void {
    const categories = this.dataStore.getCategories();
    if (categories.length === 0) {
      const defaultCategories = this.getDefaultCategories();
      defaultCategories.forEach(category => {
        this.dataStore.addCategory(category);
      });
    }
  }

  addCategory(categoryName: string): { success: boolean; category?: Category; error?: string } {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      return { success: false, error: "Please enter a category name" };
    }

    const categories = this.dataStore.getCategories();
    if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      return { success: false, error: "A category with this name already exists" };
    }

    const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#8B5A2B'];
    const newCategory: Category = {
      id: Date.now().toString(),
      name: trimmedName,
      color: colors[categories.length % colors.length],
    };

    this.dataStore.addCategory(newCategory);
    return { success: true, category: newCategory };
  }

  getCategories(): Category[] {
    return this.dataStore.getCategories();
  }
}