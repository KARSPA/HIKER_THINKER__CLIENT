import { Type } from "@angular/core";


export interface ModalConfig<T>{
    component: Type<T>; //Le composant Angular à créer
    data?: Partial<T>; // Les données que le composant pourra utiliser.
}