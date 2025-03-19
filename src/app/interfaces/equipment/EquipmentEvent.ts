import { AddEquipment } from "./AddEquipment";
import { Equipment } from "./Equipment";


export type EquipmentEvent =
  | { action: 'create'; equipment: AddEquipment }
  | { action: 'update'; equipment: Equipment }
  | { action: 'delete'; equipment: Equipment };
