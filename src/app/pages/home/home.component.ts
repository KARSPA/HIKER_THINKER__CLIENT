import { Component, inject, OnInit } from '@angular/core';

import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  protected authService : AuthService = inject(AuthService);
  isLogged = this.authService.isLogged;

  private router : Router = inject(Router);



}
