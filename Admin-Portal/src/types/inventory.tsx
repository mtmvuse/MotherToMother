export interface ResponseInventoryItem {
  id: number;
  category: string;
  name: string;
  quantityUsed: number;
  quantityNew: number;
  valueNew: number;
  valueUsed: number;
}

export interface AddInventoryItemType {
  name: string;
  category: string;
  quantityNew: number;
  valueNew: number;
  quantityUsed: number;
  valueUsed: number;
}

export interface inventoryRow {
  id: number;
  itemName: String;
  category: String;
  newStock: number;
  newValue: number;
  usedStock: number;
  usedValue: number;
}
