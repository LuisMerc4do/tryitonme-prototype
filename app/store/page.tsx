'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TryOnModal } from '@/components/try-on-modal';
import { cacheStorage } from '@/lib/cache-storage';
import { WidgetSettings } from '@/lib/types';
import { getButtonStyleClasses } from '@/lib/widget-styles';

export default function StorePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [settings, setSettings] = useState<WidgetSettings | null>(null);

  // Load settings from cache on mount
  useEffect(() => {
    setSettings(cacheStorage.getSettings());
  }, []);

  // Get the first enabled product
  const products = cacheStorage.getProducts();
  const product = products.find(p => p.enabled) || products[0];

  if (!product || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const buttonStyles = settings.useCustomColors
    ? {
        backgroundColor: settings.primaryColor,
        color: settings.textColor,
        borderRadius: `${settings.borderRadius}px`,
      }
    : {};

  const getButtonWidth = () => {
    switch (settings.buttonWidth) {
      case 'full':
        return 'w-full';
      case 'medium':
        return 'w-[200px]';
      case 'large':
        return 'w-[300px]';
      default:
        return 'w-auto';
    }
  };

  const getAlignment = () => {
    switch (settings.buttonAlignment) {
      case 'left':
        return 'items-start';
      case 'right':
        return 'items-end';
      default:
        return 'items-center';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple store header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">TryItOn Store</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline">Settings</Button>
            </Link>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product page */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-8">
          {/* Product image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product details */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-2xl font-semibold text-gray-900 mb-4">
                ${product.price.toFixed(2)}
              </p>

              <Badge className="mb-4">{product.type}</Badge>

              <p className="text-gray-600 mb-6">
                Experience the perfect blend of style and comfort. This premium piece is designed
                to elevate your wardrobe with its timeless appeal and superior quality.
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Available Variants:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <Badge key={variant.id} variant="outline">
                      {variant.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Try-on widget */}
            {settings.widgetEnabled && (
              <div className={`space-y-3 flex flex-col ${getAlignment()}`}>
                <button
                  onClick={() => setModalOpen(true)}
                  className={`${getButtonStyleClasses(settings.widgetStyle)} ${getButtonWidth()}`}
                  style={settings.useCustomColors ? buttonStyles : { borderRadius: `${settings.borderRadius}px` }}
                >
                  <Sparkles className="w-4 h-4" />
                  {settings.buttonText}
                </button>

                {settings.showDescription && (
                  <p
                    className="text-sm text-gray-600 italic text-center"
                    style={settings.useCustomColors ? { color: settings.textColor } : undefined}
                  >
                    {settings.customDescription}
                  </p>
                )}
              </div>
            )}

            <Button className="w-full mt-4" size="lg" variant="default">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Additional product info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-sm text-gray-600">Premium materials only</p>
          </div>
        </div>
      </main>

      <TryOnModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productTitle={product.title}
        productType={product.type || 'clothing'}
        variants={product.variants}
      />
    </div>
  );
}
