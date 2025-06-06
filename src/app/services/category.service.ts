import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../interfaces/equipment/Category';
import { interval, Observable, Subject } from 'rxjs';
import { ResponseModel } from '../interfaces/ResponseModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private mode: 'inventory' | 'hike' | 'model' = 'inventory';

  // Initialisé via setMode en fonction du mode passé.
  private url: string = `${environment.apiUrl}`;

  private httpClient : HttpClient = inject(HttpClient);


  constructor() {
      // Par défaut, on initialise en mode inventory (sans identifiant)
      this.setMode('inventory');

    }
  
    /**
     * Configure le mode du service.
     * @param mode - Le mode ('inventory', 'hike' ou 'model')
     * @param contextId - L'identifiant contextuel (par exemple, le hikeId ou modelId)
     */
    setMode(mode: 'inventory' | 'hike' | 'model', contextId?: string): void {
      this.mode = mode;
  
      switch (mode) {
        case 'inventory':
          this.url = `${environment.apiUrl}/inventory/categories`;
          break;
        case 'hike':
          if (!contextId) {
            throw new Error("Un identifiant de randonnée (hikeId) est requis pour le mode 'hike'");
          }
          this.url = `${environment.apiUrl}/hikes/${contextId}/categories`;
          break;
        case 'model':
          if (!contextId) {
            throw new Error("Un identifiant de modèle (modelId) est requis pour le mode 'model'");
          }
          this.url = `${environment.apiUrl}/models/${contextId}/categories`;
          break;
      }
    }

  getCategories() : Observable<ResponseModel<Category[]>>{

    return this.httpClient.get<ResponseModel<Category[]>>(this.url)

  }

  addInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.post<ResponseModel<Category>>(this.url, {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }
  modifyInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.patch<ResponseModel<Category>>(this.url+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order
    })
  }
  removeInventoryCategory(category : Category) : Observable<ResponseModel<Category>>{
    return this.httpClient.delete<ResponseModel<Category>>(this.url+`/${category.id}`);
  }

  addHikeCategory(category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.post<ResponseModel<Category>>(this.url, {
      name : category.name,
      icon : category.icon,
      order : category.order
    });

  }
  modifyHikeCategory(category : Category) : Observable<ResponseModel<Category>>{

    return this.httpClient.patch<ResponseModel<Category>>(this.url+`/${category.id}`, {
      name : category.name,
      icon : category.icon,
      order : category.order,
      accumulatedWeight : category.accumulatedWeight
    })
  }
  removeHikeCategory(category : Category) : Observable<ResponseModel<Category>>{
    return this.httpClient.delete<ResponseModel<Category>>(this.url+`/${category.id}`);
  }


  modifyCategoriesOrder(categories : Category[]) {
    return this.httpClient.patch(`${this.url}`, categories);
  }

}
