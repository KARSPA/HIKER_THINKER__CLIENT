import { Equipment } from "./Equipment";

export interface ModifyEquipmentEvent{
    equipment : Equipment;

    hasConsequences : boolean;
    consequencesLimitDate : Date|null;
}