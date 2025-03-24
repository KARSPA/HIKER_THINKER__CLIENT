import { Hike } from "./Hike";

export interface HikeEvent{
    action : 'create' | 'update' | 'delete';
    hike: Hike
}