export interface InventoryType extends InventoryInputType {
  id: number;
}

export interface InventoryInputType {
  category: string;
  name: string;
  quantityUsed: number;
  quantityNew: number;
  valueNew: number;
  valueUsed: number;
}
