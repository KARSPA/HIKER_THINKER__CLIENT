import { AddEquipment } from "./AddEquipment";
import { Equipment } from "./Equipment";
import { ModifyEquipmentEvent } from "./ModifyEquipmentEvent";


export type EquipmentEvent =
  | { action: 'create'; equipment: AddEquipment }
  | { action: 'delete'; equipment: Equipment };
