export const CROP_THEMES = {
  wheat: {
    name: 'Wheat (गेहूं)',
    bgUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    badgeBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
    icon: '🌾',
    optimalMoistureRange: '35% - 55%'
  },
  rice: {
    name: 'Basmati Rice (धान / चावल)',
    bgUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    icon: '🌱',
    optimalMoistureRange: '60% - 85%'
  },
  sugarcane: {
    name: 'Sugarcane (गन्ना)',
    bgUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
    primaryColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.3)',
    badgeBg: 'bg-green-950/80 border-green-500/40 text-green-300',
    icon: '🎋',
    optimalMoistureRange: '45% - 65%'
  },
  mustard: {
    name: 'Mustard (सरसों के फूल)',
    bgUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(234, 179, 8, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
    primaryColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.3)',
    badgeBg: 'bg-yellow-950/80 border-yellow-500/40 text-yellow-300',
    icon: '🌼',
    optimalMoistureRange: '30% - 48%'
  },
  cotton: {
    name: 'Cotton (कपास)',
    bgUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(203, 213, 225, 0.2) 0%, rgba(15, 23, 42, 0.95) 75%)',
    primaryColor: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.3)',
    badgeBg: 'bg-slate-800/80 border-slate-400/40 text-slate-200',
    icon: '☁️',
    optimalMoistureRange: '35% - 55%'
  },
  potato: {
    name: 'Potato (आलू)',
    bgUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, rgba(180, 83, 9, 0.22) 0%, rgba(15, 23, 42, 0.95) 75%)',
    primaryColor: '#b45309',
    glowColor: 'rgba(180, 83, 9, 0.3)',
    badgeBg: 'bg-amber-950/80 border-amber-600/40 text-amber-200',
    icon: '🥔',
    optimalMoistureRange: '50% - 70%'
  }
};

export function getCropTheme(cropName = 'wheat') {
  const key = String(cropName || '').toLowerCase().trim();
  if (key.includes('rice') || key.includes('dhan') || key.includes('basmati')) return CROP_THEMES.rice;
  if (key.includes('cane') || key.includes('ganna')) return CROP_THEMES.sugarcane;
  if (key.includes('mustard') || key.includes('sarson')) return CROP_THEMES.mustard;
  if (key.includes('cotton') || key.includes('kapas')) return CROP_THEMES.cotton;
  if (key.includes('potato') || key.includes('aaloo') || key.includes('aloo')) return CROP_THEMES.potato;
  return CROP_THEMES.wheat;
}
