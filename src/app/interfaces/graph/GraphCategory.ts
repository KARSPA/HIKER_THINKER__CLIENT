import { Category } from "../equipment/Category";

export interface GraphCategory{
    category : Category
    percentage : number;
    startAngle : number;
    endAngle : number;
    sectionStyle : string;
    endBorderRotationStyle : string;
    iconStyle : string;
}