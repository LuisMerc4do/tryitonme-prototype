// Core type definitions for the try-on widget

export interface WidgetSettings {
  buttonText: string;
  widgetStyle: string;
  showDescription: boolean;
  customDescription: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  widgetEnabled: boolean;
  buttonWidth: 'auto' | 'full' | 'medium' | 'large';
  buttonAlignment: 'left' | 'center' | 'right';
  useCustomColors: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  variants: ProductVariant[];
  type?: string;
  enabled: boolean;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  image: string;
}

export interface TryOnResult {
  success: boolean;
  resultImageUrl?: string;
  error?: string;
  processingTime?: string;
}

export interface AnalyticsData {
  totalTryOns: number;
  successfulTryOns: number;
  uniqueUsers: number;
  topProducts: {
    id: string;
    name: string;
    tryOns: number;
    successRate: number;
  }[];
  chartData: {
    month: string;
    successful: number;
    failed: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    product: string;
    timestamp: Date;
    success: boolean;
  }[];
}
