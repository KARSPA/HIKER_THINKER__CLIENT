import { HikeSummary } from "../hike/HikeSummary";
import { Equipment } from "./Equipment";

export interface EquipmentDetails extends Equipment{
    hikes : HikeSummary[]
}