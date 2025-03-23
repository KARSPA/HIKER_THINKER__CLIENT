import { Inventory } from "../Inventory";

export interface Hike{

    id : string|null;
    title : string;
    distance : number;
    positive : number;
    negative : number;
    date : Date;
    duration : number;
    durationUnit : string;

    weightCorrection : number;
    totalWeight : number|null;

    inventory : Inventory|null
    
}