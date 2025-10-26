'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye } from 'lucide-react';
import Link from 'next/link';
import { cacheStorage } from '@/lib/cache-storage';
import { WidgetSettings, Product } from '@/lib/types';
import { defaultWidgetSettings } from '@/lib/mock-data';
import { getButtonStyleClasses } from '@/lib/widget-styles';

const buttonStyles = [
  { value: 'elegant-minimal', label: 'Elegant Minimal', category: 'Minimalist' },
  { value: 'modern-outline', label: 'Modern Outline', category: 'Minimalist' },
  { value: 'ghost-hover', label: 'Ghost Hover', category: 'Minimalist' },
  { value: 'subtle-gradient', label: 'Subtle Gradient', category: 'Modern' },
  { value: 'soft-rounded', label: 'Soft Rounded', category: 'Modern' },
  { value: 'luxury-gold', label: 'Luxury Gold', category: 'Premium' },
  { value: 'beauty-glow', label: 'Beauty Glow', category: 'Feminine' },
  { value: 'tech-neon', label: 'Tech Neon', category: 'Modern' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<WidgetSettings>(defaultWidgetSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [saved, setSaved] = useState(false);

  // Load settings and products on mount
  useEffect(() => {
    setSettings(cacheStorage.getSettings());
    setProducts(cacheStorage.getProducts());
  }, []);

  const handleSave = () => {
    cacheStorage.saveSettings(settings);
    cacheStorage.saveProducts(products);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSettingChange = (key: keyof WidgetSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleProductToggle = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  // Preview button styles
  const previewButtonStyles = settings.useCustomColors
    ? {
        backgroundColor: settings.primaryColor,
        color: settings.textColor,
        borderRadius: `${settings.borderRadius}px`,
      }
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Widget Settings</h1>
              <p className="text-sm text-gray-600">Customize your try-on widget appearance</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/store">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Store
                </Button>
              </Link>
              <Button onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="appearance">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-6 mt-6">
                {/* Basic Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input
                        value={settings.buttonText}
                        onChange={(e) => handleSettingChange('buttonText', e.target.value)}
                        placeholder="Try It On Virtually"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Enable Widget</Label>
                      <Switch
                        checked={settings.widgetEnabled}
                        onCheckedChange={(checked) => handleSettingChange('widgetEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Show Description</Label>
                      <Switch
                        checked={settings.showDescription}
                        onCheckedChange={(checked) =>
                          handleSettingChange('showDescription', checked)
                        }
                      />
                    </div>

                    {settings.showDescription && (
                      <div className="space-y-2">
                        <Label>Description Text</Label>
                        <Textarea
                          value={settings.customDescription}
                          onChange={(e) =>
                            handleSettingChange('customDescription', e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Style Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Button Style</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Style Preset</Label>
                      <Select
                        value={settings.widgetStyle}
                        onValueChange={(value) => handleSettingChange('widgetStyle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {buttonStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                              <Badge variant="outline" className="ml-2">
                                {style.category}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Button Width</Label>
                      <Select
                        value={settings.buttonWidth}
                        onValueChange={(value: any) => handleSettingChange('buttonWidth', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (fit content)</SelectItem>
                          <SelectItem value="medium">Medium (200px)</SelectItem>
                          <SelectItem value="large">Large (300px)</SelectItem>
                          <SelectItem value="full">Full width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Button Alignment</Label>
                      <Select
                        value={settings.buttonAlignment}
                        onValueChange={(value: any) => handleSettingChange('buttonAlignment', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Border Radius: {settings.borderRadius}px</Label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={settings.borderRadius}
                        onChange={(e) =>
                          handleSettingChange('borderRadius', parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Use Custom Colors</Label>
                      <Switch
                        checked={settings.useCustomColors}
                        onCheckedChange={(checked) =>
                          handleSettingChange('useCustomColors', checked)
                        }
                      />
                    </div>

                    {settings.useCustomColors && (
                      <>
                        <div className="space-y-2">
                          <Label>Primary Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={settings.primaryColor}
                              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                              className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={settings.primaryColor}
                              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={settings.textColor}
                              onChange={(e) => handleSettingChange('textColor', e.target.value)}
                              className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={settings.textColor}
                              onChange={(e) => handleSettingChange('textColor', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Enable or disable the try-on widget for specific products
                    </p>
                    <div className="space-y-3">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-gray-500">${product.price}</p>
                          </div>
                          <Switch
                            checked={product.enabled}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex gap-4 mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold text-lg">Sample Product</h3>
                        <p className="text-gray-600">$49.99</p>
                      </div>
                    </div>

                    {settings.widgetEnabled && (
                      <div
                        className={`space-y-2 flex flex-col ${
                          settings.buttonAlignment === 'left'
                            ? 'items-start'
                            : settings.buttonAlignment === 'right'
                            ? 'items-end'
                            : 'items-center'
                        }`}
                      >
                        <button
                          className={`${getButtonStyleClasses(settings.widgetStyle)} ${
                            settings.buttonWidth === 'full'
                              ? 'w-full justify-center'
                              : settings.buttonWidth === 'large'
                              ? 'w-[300px]'
                              : settings.buttonWidth === 'medium'
                              ? 'w-[200px]'
                              : 'w-auto'
                          }`}
                          style={
                            settings.useCustomColors
                              ? previewButtonStyles
                              : { borderRadius: `${settings.borderRadius}px` }
                          }
                        >
                          <Sparkles className="w-4 h-4" />
                          {settings.buttonText}
                        </button>

                        {settings.showDescription && (
                          <p className="text-sm text-gray-600 italic text-center">
                            {settings.customDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {!settings.widgetEnabled && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600 text-center">
                        Widget is currently disabled
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
