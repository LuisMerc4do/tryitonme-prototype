import { WidgetSettings, Product } from './types';
import { defaultWidgetSettings, mockProducts } from './mock-data';

// Simple localStorage wrapper for settings persistence
// No database needed - perfect for prototype

const STORAGE_KEYS = {
  WIDGET_SETTINGS: 'tryiton_widget_settings',
  PRODUCTS: 'tryiton_products',
  TRY_ON_CACHE: 'tryiton_results_cache',
};

export const cacheStorage = {
  // Widget settings
  getSettings(): WidgetSettings {
    if (typeof window === 'undefined') return defaultWidgetSettings;

    const stored = localStorage.getItem(STORAGE_KEYS.WIDGET_SETTINGS);
    if (!stored) return defaultWidgetSettings;

    try {
      return JSON.parse(stored);
    } catch {
      return defaultWidgetSettings;
    }
  },

  saveSettings(settings: WidgetSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WIDGET_SETTINGS, JSON.stringify(settings));
  },

  // Products
  getProducts(): Product[] {
    if (typeof window === 'undefined') return mockProducts;

    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!stored) {
      // First time, save defaults
      this.saveProducts(mockProducts);
      return mockProducts;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return mockProducts;
    }
  },

  saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  updateProduct(productId: string, updates: Partial<Product>): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.saveProducts(products);
    }
  },

  // Try-on results cache (for showing recent results)
  getCachedResults() {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.TRY_ON_CACHE);
    if (!stored) return [];

    try {
      const results = JSON.parse(stored);
      // Filter out results older than 10 hours
      const tenHoursAgo = Date.now() - (10 * 60 * 60 * 1000);
      return results.filter((r: any) => r.timestamp > tenHoursAgo);
    } catch {
      return [];
    }
  },

  saveCachedResult(result: any): void {
    if (typeof window === 'undefined') return;

    const cached = this.getCachedResults();
    cached.unshift({
      ...result,
      timestamp: Date.now(),
    });

    // Keep only last 20 results
    const trimmed = cached.slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.TRY_ON_CACHE, JSON.stringify(trimmed));
  },

  clearCache(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.TRY_ON_CACHE);
  },
};
