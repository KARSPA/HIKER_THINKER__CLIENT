
export interface FetchSourceParams {
    pageSize : number;
    pageNumber : number;

    minWeight ?: number;
    maxWeight ?: number;

    name ?: string;
    brand ?: string;
}