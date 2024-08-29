export interface ItemReadModel {
  id: string;
  title: string;
  description: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface TodoListReadModel {
  id: string;
  title: string;
  items: ItemReadModel[];
  createdAt: Date;
  updatedAt: Date;
}
