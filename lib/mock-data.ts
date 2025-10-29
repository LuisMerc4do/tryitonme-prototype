import { Product, AnalyticsData } from './types';

// Mock products for the store
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Classic Denim Jacket',
    price: 89.99,
    image: 'https://i.imgur.com/4YXbGFa.jpeg',
    type: 'jacket',
    enabled: true,
    variants: [
      {
        id: '1-1',
        title: 'Blue / S',
        price: 89.99,
        image: 'https://i.imgur.com/4YXbGFa.jpeg',
      },
      {
        id: '1-2',
        title: 'Blue / M',
        price: 89.99,
        image: 'https://i.imgur.com/GVKWHE1.jpeg',
      },
      {
        id: '1-3',
        title: 'Black / M',
        price: 94.99,
        image: 'https://i.imgur.com/qrPir0t.jpeg',
      },
    ],
  },
  {
    id: '2',
    title: 'Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    type: 'shirt',
    enabled: true,
    variants: [
      {
        id: '2-1',
        title: 'White / M',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      },
      {
        id: '2-2',
        title: 'White / L',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      },
    ],
  },
  {
    id: '3',
    title: 'Leather Handbag',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    type: 'bag',
    enabled: false,
    variants: [
      {
        id: '3-1',
        title: 'Brown',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
      },
      {
        id: '3-2',
        title: 'Black',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      },
    ],
  },
];

// Default widget settings
export const defaultWidgetSettings = {
  buttonText: 'Try It On Virtually',
  widgetStyle: 'elegant-minimal',
  showDescription: true,
  customDescription: 'See how this looks on you with AI',
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderRadius: 12,
  widgetEnabled: true,
  buttonWidth: 'auto' as const,
  buttonAlignment: 'center' as const,
  useCustomColors: false,
};

// Mock analytics data with realistic trends
export const mockAnalytics: AnalyticsData = {
  totalTryOns: 1247,
  successfulTryOns: 1189,
  uniqueUsers: 423,
  topProducts: [
    {
      id: '1',
      name: 'WhiteFox Tshirt',
      tryOns: 456,
      successRate: 96,
    },
    {
      id: '2',
      name: 'Cotton T-Shirt',
      tryOns: 398,
      successRate: 94,
    },
    {
      id: '3',
      name: 'Leather Handbag',
      tryOns: 234,
      successRate: 92,
    },
    {
      id: '4',
      name: 'Summer Dress',
      tryOns: 159,
      successRate: 97,
    },
  ],
  chartData: [
    { month: 'Jan', successful: 145, failed: 8 },
    { month: 'Feb', successful: 178, failed: 12 },
    { month: 'Mar', successful: 203, failed: 9 },
    { month: 'Apr', successful: 234, failed: 11 },
    { month: 'May', successful: 289, failed: 15 },
    { month: 'Jun', successful: 320, failed: 13 },
  ],
  recentActivity: [
    {
      id: '1',
      action: 'completed virtual try-on',
      product: 'Classic Denim Jacket',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      success: true,
    },
    {
      id: '2',
      action: 'completed virtual try-on',
      product: 'Cotton T-Shirt',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      success: true,
    },
    {
      id: '3',
      action: 'attempted try-on (failed)',
      product: 'Leather Handbag',
      timestamp: new Date(Date.now() - 1000 * 60 * 23), // 23 mins ago
      success: false,
    },
    {
      id: '4',
      action: 'completed virtual try-on',
      product: 'Classic Denim Jacket',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      success: true,
    },
    {
      id: '5',
      action: 'completed virtual try-on',
      product: 'Summer Dress',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      success: true,
    },
  ],
};
