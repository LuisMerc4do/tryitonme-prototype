// Widget button style definitions

export const getButtonStyleClasses = (style: string): string => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-6 py-3 font-medium transition cursor-pointer';

  const styleMap: Record<string, string> = {
    'elegant-minimal': 'bg-indigo-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
    'modern-outline': 'bg-transparent text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-500 hover:text-white hover:-translate-y-0.5',
    'ghost-hover': 'bg-transparent text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-500',
    'subtle-gradient': 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
    'soft-rounded': 'bg-indigo-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-3xl',
    'luxury-gold': 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    'beauty-glow': 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    'tech-neon': 'bg-black text-cyan-400 border-2 border-cyan-400 shadow-lg hover:bg-cyan-400 hover:text-black',
  };

  return `${baseClasses} ${styleMap[style] || styleMap['elegant-minimal']}`;
};
