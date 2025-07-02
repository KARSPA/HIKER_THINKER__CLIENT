import { Equipment } from "../interfaces/equipment/Equipment";
import { Inventory } from "../interfaces/Inventory";

// Single-category inventory
export const SINGLE_CATEGORY_INVENTORY: Inventory = {
  categories: [
    {
      id: 'cat-1',
      name: 'Chaussures',
      icon: 'icon_boots',
      order: 1,
      accumulatedWeight: 5
    }
  ],
  equipments: [
    {
      id: 'eq-1',
      name: 'Bottes de randonnée',
      weight: 5,
      description: 'Chaussures robustes pour sentiers',
      brand: 'TrailMaster',
      categoryId: 'cat-1',
      categoryName: 'Chaussures',
      sourceId: null,
      position: 1
    }
  ]
};

// Multi-category inventory
export const MULTI_CATEGORY_INVENTORY: Inventory = {
  categories: [
    {
      id: 'cat-1',
      name: 'Chaussures',
      icon: 'icon_boots',
      order: 1,
      accumulatedWeight: 4
    },
    {
      id: 'cat-2',
      name: 'Tente',
      icon: 'icon_tent',
      order: 2,
      accumulatedWeight: 6
    }
  ],
  equipments: [
    {
      id: 'eq-1',
      name: 'Bottes de randonnée',
      weight: 4,
      description: 'Chaussures légères',
      brand: 'AlpineWalk',
      categoryId: 'cat-1',
      categoryName: 'Chaussures',
      sourceId: null,
      position: 1
    },
    {
      id: 'eq-2',
      name: 'Tente deux places',
      weight: 6,
      description: 'Tente compacte et résistante',
      brand: 'CampShield',
      categoryId: 'cat-2',
      categoryName: 'Tente',
      sourceId: null,
      position: 1
    }
  ]
};

// Additional equipments
export const EXTRA_EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-3',
    name: 'Sac à dos',
    weight: 3,
    description: 'Sac de 50L',
    brand: 'PackLite',
    categoryId: 'cat-1',
    categoryName: 'Chaussures',
    sourceId: 'src-1',
    position: 2
  },
  {
    id: 'eq-4',
    name: 'Couteau multifonction',
    weight: 0.2,
    description: 'Outil 12-en-1',
    brand: 'MultiToolCo',
    categoryId: 'cat-2',
    categoryName: 'Tente',
    sourceId: 'src-2',
    position: 2
  }
];
