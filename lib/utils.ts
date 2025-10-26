import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time ago for activity feed
export function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Map product types to try-on instructions for AI
export function mapProductType(productType?: string): string {
  const typeMapping: Record<string, string> = {
    shirt: 'upper body clothing (shirt/top area)',
    blouse: 'upper body clothing (shirt/top area)',
    't-shirt': 'upper body clothing (shirt/top area)',
    top: 'upper body clothing (shirt/top area)',
    jacket: 'upper body clothing (jacket/outer layer - wear over existing clothing)',
    coat: 'upper body clothing (coat/outerwear - wear over all existing layers)',
    sweater: 'upper body clothing (sweater/outer layer - wear over existing top)',
    hoodie: 'upper body clothing (hoodie/outer layer - wear over existing clothing)',
    dress: 'full body clothing (dress/full outfit)',
    pants: 'lower body clothing (pants/trousers area)',
    jeans: 'lower body clothing (jeans/pants area)',
    shorts: 'lower body clothing (shorts/lower body area)',
    bag: 'accessory (handbag/purse - position OVER existing clothing, maintain strap and bag shape)',
    purse: 'accessory (purse/handbag - position OVER existing clothing, keep original proportions)',
    handbag: 'accessory (handbag - wear OVER existing outfit, maintain handle/strap positioning)',
    shoes: 'footwear (shoes - position on feet, maintain existing pant/dress length)',
    sneakers: 'footwear (sneakers - position on feet, keep existing lower clothing visible)',
  };

  if (!productType) {
    return 'clothing item (analyze the garment and apply it to the appropriate body area)';
  }

  const lowerType = productType.toLowerCase().trim();
  return typeMapping[lowerType] || `clothing item labeled as "${productType}"`;
}
