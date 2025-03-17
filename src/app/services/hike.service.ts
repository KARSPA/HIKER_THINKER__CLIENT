import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseModel } from '../interfaces/ResponseModel';
import { Hike } from '../interfaces/hike/Hike';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HikeService {

  private HIKES_URL = "http://localhost:8000/api/v1/hikes";


  private httpClient : HttpClient = inject(HttpClient);

  hikeChangeSubject = new Subject<Hike>();
  hikeChange$ = this.hikeChangeSubject.asObservable();



  notifyHikeChange(hike : Hike){
    this.hikeChangeSubject.next(hike);
  }



  addHike(hike : Hike): Observable<ResponseModel<Hike>>{

    return this.httpClient.post<ResponseModel<Hike>>(this.HIKES_URL, {
      ...hike
    })

  }

  getHikes() : Observable<ResponseModel<Hike[]>>{
    return this.httpClient.get<ResponseModel<Hike[]>>(this.HIKES_URL)
  }


}
