import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { SourceEquipment } from '../../interfaces/equipment/sources/SourceEquipment';


// 1) On décrit l’état qu’on veut gérer
export type SourceEquipmentState = {
  /** L’équipement actuellement pré-rempli dans le formulaire */
  selected : SourceEquipment 
}

// 2) On crée le store avec un état initial et des méthodes pour le modifier
export const SourceEquipmentStore = signalStore(
    { providedIn: 'root' },
  withState<SourceEquipmentState>({ selected : {
    id : '',
    name : '',
    brand : '',
    description : '',
    url : '',
    weight : 0
  }}),
  withMethods((store) => ({
    /**
     * Sélectionne un équipement : on patche la propriété `selected`
     */
    select(equipment: SourceEquipment) {
        patchState(store, { selected: equipment });
    },
    /**
     * Réinitialise la sélection
     */
    clear() {
      patchState(store, { selected: {
            id : '',
            name : '',
            brand : '',
            description : '',
            url : '',
            weight : 0
            } 
        });
    }
  }))
);
