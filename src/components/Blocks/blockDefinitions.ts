import type { BlockDef, BlockCategory } from '../../types';

export const BLOCK_DEFS: BlockDef[] = [
  // Events
  {
    id: 'on_start',
    category: 'events',
    label: 'Program Başladığında',
    isHat: true,
  },
  {
    id: 'on_button',
    category: 'events',
    label: 'Buton Tıklandığında',
    isHat: true,
  },

  // Motion
  {
    id: 'takeoff',
    category: 'motion',
    label: 'Kalkış Yap',
  },
  {
    id: 'land',
    category: 'motion',
    label: 'İniş Yap',
  },
  {
    id: 'move_forward',
    category: 'motion',
    label: 'İleri Git',
    params: [{ name: 'distance', defaultValue: 5, unit: 'm' }],
  },
  {
    id: 'move_back',
    category: 'motion',
    label: 'Geri Git',
    params: [{ name: 'distance', defaultValue: 5, unit: 'm' }],
  },
  {
    id: 'ascend',
    category: 'motion',
    label: 'Yukarı Çık',
    params: [{ name: 'height', defaultValue: 2, unit: 'm' }],
  },
  {
    id: 'descend',
    category: 'motion',
    label: 'Aşağı İn',
    params: [{ name: 'height', defaultValue: 2, unit: 'm' }],
  },
  {
    id: 'rotate_cw',
    category: 'motion',
    label: 'Sağa Dön',
    params: [{ name: 'angle', defaultValue: 90, unit: '°' }],
  },
  {
    id: 'rotate_ccw',
    category: 'motion',
    label: 'Sola Dön',
    params: [{ name: 'angle', defaultValue: 90, unit: '°' }],
  },

  // Control
  {
    id: 'repeat',
    category: 'control',
    label: 'Kere Tekrar Et',
    isContainer: true,
    params: [{ name: 'times', defaultValue: 10, unit: '' }],
  },
  {
    id: 'repeat_forever',
    category: 'control',
    label: 'Sürekli Tekrar Et',
    isContainer: true,
  },
  {
    id: 'wait',
    category: 'control',
    label: 'Saniye Bekle',
    params: [{ name: 'seconds', defaultValue: 2, unit: 'sn' }],
  },

  // Logic
  {
    id: 'if_then',
    category: 'logic',
    label: 'Eğer İse',
    isContainer: true,
  },
  {
    id: 'if_else',
    category: 'logic',
    label: 'Eğer ... Değilse',
    isContainer: true,
  },

  // Sensors
  {
    id: 'dist_less',
    category: 'sensors',
    label: 'Mesafe <',
    params: [{ name: 'value', defaultValue: 20, unit: 'cm' }],
  },
  {
    id: 'altitude_more',
    category: 'sensors',
    label: 'Yükseklik >',
    params: [{ name: 'value', defaultValue: 3, unit: 'm' }],
  },
  {
    id: 'battery_less',
    category: 'sensors',
    label: 'Batarya <',
    params: [{ name: 'value', defaultValue: 20, unit: '%' }],
  },
];

export interface CategoryMeta {
  label: string;
  icon: string;
  color: string;
}

export const CATEGORY_META: Record<BlockCategory, CategoryMeta> = {
  events: { label: 'Olaylar', icon: '🎯', color: '#00b8d4' },
  motion: { label: 'Hareket', icon: '🚀', color: '#4A90E2' },
  control: { label: 'Kontrol', icon: '🔄', color: '#E8A33D' },
  logic: { label: 'Mantık', icon: '🧠', color: '#50C878' },
  sensors: { label: 'Sensörler', icon: '📡', color: '#7B6FE0' },
};

export const CATEGORY_COLOR: Record<string, string> = {
  events: '#00b8d4',
  motion: '#4A90E2',
  control: '#E8A33D',
  logic: '#50C878',
  sensors: '#7B6FE0',
};
