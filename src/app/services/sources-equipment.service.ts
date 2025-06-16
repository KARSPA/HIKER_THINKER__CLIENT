import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SourcesEquipmentService {

  private url: string = `${environment.apiUrl}`;
  
  private httpClient: HttpClient = inject(HttpClient);

  
}
