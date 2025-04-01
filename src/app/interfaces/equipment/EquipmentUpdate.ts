import { Category } from "./Category";

export interface EquipmentsOrderUpdate {
    category : Category;
    orderedIds : string[];
}