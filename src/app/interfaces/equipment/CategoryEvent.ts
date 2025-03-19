import { Category } from "./Category";

export interface CategoryEvent {
    action : 'create' | 'update' | 'delete';
    category: Category
}