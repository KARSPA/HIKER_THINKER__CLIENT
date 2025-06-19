import { Equipment } from "../Equipment";
import { SourceEquipment } from "./SourceEquipment";

export interface ListSourceEquipmentResponse{
    totalCount : number;
    equipments : (SourceEquipment|Equipment)[]
}