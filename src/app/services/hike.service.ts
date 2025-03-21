import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseModel } from '../interfaces/ResponseModel';
import { Hike } from '../interfaces/hike/Hike';
import { Observable, Subject } from 'rxjs';
import { Category } from '../interfaces/equipment/Category';

@Injectable({
  providedIn: 'root'
})
export class HikeService {

  private HIKES_URL = "http://localhost:8000/api/v1/hikes";


  private httpClient : HttpClient = inject(HttpClient);

  hikeChangeSubject = new Subject<Hike>();
  hikeChange$ = this.hikeChangeSubject.asObservable();

  private categoryChangeSubject = new Subject<Category>();
  categoryChange$ = this.categoryChangeSubject.asObservable();

  private categoryRemoveSubject = new Subject<string>();
  categoryRemove$ = this.categoryRemoveSubject.asObservable();
  


  notifyHikeChange(hike : Hike){
    this.hikeChangeSubject.next(hike);
  }

  notifyCategoryRemove(categoryId : string){
    this.categoryRemoveSubject.next(categoryId);
  }

  notifyCategoryChange(category : Category){
    this.categoryChangeSubject.next(category);
  }

  addHike(hike : Hike): Observable<ResponseModel<Hike>>{

    return this.httpClient.post<ResponseModel<Hike>>(this.HIKES_URL, {
      ...hike
    })

  }

  modifyHike(hike : Hike){
    return this.httpClient.patch<ResponseModel<Hike>>(this.HIKES_URL+`/${hike.id}`, {...hike})
  }

  getHikes() : Observable<ResponseModel<Hike[]>>{
    return this.httpClient.get<ResponseModel<Hike[]>>(this.HIKES_URL)
  }



  getHikeById(hikeId : string):  Observable<ResponseModel<Hike>>{
    return this.httpClient.get<ResponseModel<Hike>>(this.HIKES_URL+`/${hikeId}`)
  }


}
