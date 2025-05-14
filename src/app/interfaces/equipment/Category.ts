import { IconKey } from "../../_helpers/records/icon_color";

export interface Category{
    id? : string;
    name : string;
    icon : IconKey;
    order: number;
    accumulatedWeight : number;
}