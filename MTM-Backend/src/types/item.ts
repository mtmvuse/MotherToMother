export interface ItemInput {
  name: string;
  category: string;
}

export interface ItemInputNoID {
  category: string;
  name: string;
  quantityUsed: number;
  quantityNew: number;
  valueNew: number;
  valueUsed: number;
}

export interface ItemType {
  id: number;
  category: string;
  name: string;
  quantityUsed: number;
  quantityNew: number;
  valueNew: number;
  valueUsed: number;
}
