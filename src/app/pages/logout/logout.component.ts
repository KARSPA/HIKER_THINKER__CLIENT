import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  private authService : AuthService = inject(AuthService);
  private router : Router = inject(Router);

  ngOnInit(): void {
      this.authService.logout();
      this.router.navigate(['home']);
  }

}
