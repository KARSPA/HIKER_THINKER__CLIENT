import { Category } from "./equipment/Category";
import { Equipment } from "./equipment/Equipment";

export interface Inventory{
    categories: Category[];
    equipments : Equipment[];
}