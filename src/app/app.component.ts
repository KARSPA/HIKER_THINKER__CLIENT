import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./_partials/header/header.component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title = 'HikerThinker';

  protected authService : AuthService = inject(AuthService);


  ngOnInit(): void {
    this.authService.verifyConnected().subscribe({
      next: (response) => {
        this.authService.handleLoginSuccess(response.data);
      },
      error: (error) => {
        //Si erreur, déconnecté l'utilisateur.
        console.log(error);
        this.authService.logout();
      }
    });
  }
}
