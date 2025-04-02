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

  private updateBuffer : Category[] = [];
  private updateInterval = 10000; // 10 secondes
  private updateSubject = new Subject<void>();

  constructor() {
      // Par défaut, on initialise en mode inventory (sans identifiant)
      this.setMode('inventory');
      interval(this.updateInterval).subscribe(() => this.flushCategoryOrdersUpdates());
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
  removeInventoryCategory(categoryId : string) : Observable<ResponseModel<Category>>{

    return this.httpClient.delete<ResponseModel<Category>>(this.url+`/${categoryId}`);
    
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
      order : category.order
    })
  }
  removeHikeCategory(categoryId : string) : Observable<ResponseModel<Category>>{

    return this.httpClient.delete<ResponseModel<Category>>(this.url+`/${categoryId}`);
    
  }




  /* SECTION DES MODIFS D'ORDRE DES CATÉGORIES */
  
    // Ajoute ou met à jour une modification dans le buffer
    addCategoriesUpdate(categories: Category[]): void {
      this.updateBuffer = [...categories]; //On remplace/modifie totalement le tableaux des modifs pour éviter d'envoyer des modifs périmées
    }
  
  
    flushCategoryOrdersUpdates() : void{
      if(this.updateBuffer.length === 0) return // Si on a rien a modifier, on modifie rien ....
  
      const payload = [...this.updateBuffer];
  
      this.updateBuffer = []; // On vide le tableau de modifications.
  
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
      this.flushCategoryOrdersUpdates();
    }

}
