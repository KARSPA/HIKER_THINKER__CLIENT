import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_URL : string = 'http://localhost:8000/auth/login';
  private REGISTER_URL : string = 'http://localhost:8000/auth/register';

  private httpClient : HttpClient = inject(HttpClient);


}
