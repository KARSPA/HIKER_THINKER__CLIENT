import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent{

  protected authService : AuthService = inject(AuthService);
  isLogged = this.authService.isLogged;

  appLogoUrl : string = 'assets/logoApp.png';

}
