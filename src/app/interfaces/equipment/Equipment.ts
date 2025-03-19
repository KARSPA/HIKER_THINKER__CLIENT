import { AddEquipment } from "./AddEquipment";

export interface Equipment extends AddEquipment{
    id: string;
    categoryId: string;
}