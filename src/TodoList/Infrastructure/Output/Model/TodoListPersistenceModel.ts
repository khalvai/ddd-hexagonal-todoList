interface Item {
  id: string;
  priority: string;
  title: string;
  description: string;
  concurrencySafeVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface TodoListPersistenceModel {
  id: string;
  userId: string;
  title: string;
  concurrencySafeVersion: number;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
