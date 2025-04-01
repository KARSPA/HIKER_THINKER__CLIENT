import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Equipment } from '../interfaces/equipment/Equipment';
import { interval, Observable, Subject } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { RefEquipment } from '../interfaces/equipment/RefEquipment';
import { environment } from '../../environments/environment';
import { EquipmentsOrderUpdate } from '../interfaces/equipment/EquipmentUpdate';
import { Category } from '../interfaces/equipment/Category';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private mode: 'inventory' | 'hike' | 'model' = 'inventory';

  
  //url des requetes qui sera configuré via le mode lors de l'instanciation des composants l'utilisant
  private url: string = `${environment.apiUrl}`;
  
  private httpClient: HttpClient = inject(HttpClient);
  
  private updateBuffer = new Map<string, string[]>();
  private updateInterval = 10000; // 10 secondes
  private updateSubject = new Subject<void>();


  constructor() {
    // Par défaut, on initialise en mode inventory (sans identifiant)
    this.setMode('inventory');
    interval(this.updateInterval).subscribe(() => this.flushEquipmentUpdates());
  }

  /**
   * Configure le mode du service.
   * @param mode - Le mode ('inventory', 'hike' ou 'model')
   * @param contextId - L'identifiant contextuel (par exemple, le hikeId ou modelId) si nécessaire.
   */
  setMode(mode: 'inventory' | 'hike' | 'model', contextId?: string): void {
    this.mode = mode;

    switch (mode) {
      case 'inventory':
        this.url = `${environment.apiUrl}/inventory/equipments`;
        break;
      case 'hike':
        if (!contextId) {
          throw new Error("Un identifiant de randonnée (hikeId) est requis pour le mode 'hike'");
        }
        this.url = `${environment.apiUrl}/hikes/${contextId}/equipments`;
        break;
      case 'model':
        if (!contextId) {
          throw new Error("Un identifiant de modèle (modelId) est requis pour le mode 'model'");
        }
        this.url = `${environment.apiUrl}/models/${contextId}/equipments`;
        break;
    }
  }

  

  getEquipmentById(equipmentId : string) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.get<ResponseModel<Equipment>>(this.url+`/${equipmentId}`)
  }



  addInventoryEquipment(equipmentFormValue : any) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.post<ResponseModel<Equipment>>(this.url, {
      name : equipmentFormValue.name,
      weight : equipmentFormValue.weight,
      description : equipmentFormValue.description,
      brand : equipmentFormValue.brand,
      categoryName : equipmentFormValue.categoryName,
      sourceId : null
    })
  }

  removeInventoryEquipment(equipmentId : string) : Observable<ResponseModel<string>>{

    return this.httpClient.delete<ResponseModel<string>>(this.url+`/${equipmentId}`)
  }


  addHikeEquipment(refEquipment : RefEquipment) : Observable<ResponseModel<Equipment>>{
    return this.httpClient.post<ResponseModel<Equipment>>(this.url, {...refEquipment})
  }

  removeHikeEquipment(equipmentId : string) : Observable<ResponseModel<string>>{
    return this.httpClient.delete<ResponseModel<string>>(this.url+`/${equipmentId}`)
  }



  /* SECTION DES MODIFS DE POSITIONS ET CATÉGORIES D'ÉQUIPEMENT */

  // Ajoute ou met à jour une modification dans le buffer
  addEquipmentUpdate(update: EquipmentsOrderUpdate): void {
    this.updateBuffer.set(update.categoryId, update.orderedIds);

    // Changer valeur d'un subject pour afficher si enregistrements à faire ou pas.

    // console.log(this.updateBuffer)
  }



  flushEquipmentUpdates() : void{
    if(this.updateBuffer.size === 0) return // Si on a rien a modifier, on modifie rien ....

    const payload = Array.from(this.updateBuffer.entries()).map(([categoryId, newPositions])=>({
      categoryId : categoryId,
      orderedEquipmentIds : newPositions
    }))

    console.log(payload)

    this.updateBuffer.clear(); // On vide la map de modifications.

    //On fait l'appel API
    this.httpClient.patch(`${this.url}`, payload).subscribe({
      next : (response)=>{
        console.log(response)
      },
      error: (err)=>{
        console.error(err.error.message)
      }
    })
  }

  // Permet de forcer l'envoi (si jamais on quitte un composant avant l'envoi des modifs : avec ngOnDestroy ...)
  forceFlush(): void {
    this.flushEquipmentUpdates();
  }


}
