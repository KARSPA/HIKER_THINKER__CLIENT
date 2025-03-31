export interface Category{
    id? : string;
    name : string;
    icon : string | null;
    order: number;
    accumulatedWeight : number;
}