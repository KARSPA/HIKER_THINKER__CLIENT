import { Type } from "@angular/core";
import { Subject } from "rxjs";


export interface ModalConfig<T, R>{
    component: Type<T>; //Le composant Angular à créer
    data?: Partial<T>; // Les données que le composant pourra utiliser.
    result? : Subject<R> // L'observable de retour
}