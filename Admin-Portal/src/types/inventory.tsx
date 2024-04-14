export interface ResponseInventoryItem {
  id: number;
  category: string;
  name: string;
  quantityUsed: number;
  quantityNew: number;
  valueNew: number;
  valueUsed: number;
}

export interface EditInventoryItemType {
  data: AddInventoryItemType;
  id: number;
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
  name: String;
  category: String;
  quantityNew: number;
  valueNew: number;
  quantityUsed: number;
  valueUsed: number;
}
