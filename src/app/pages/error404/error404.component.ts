import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error404',
  imports: [RouterLink],
  templateUrl: './error404.component.html'
})
export class Error404Component implements OnInit{

  message: string = 'Ressource non trouvée';

  private router: Router = inject(Router);
  
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();

    console.log(navigation)
    // navigation.extras.state peut être undefined si on arrive sur cette page autrement
    if (navigation?.extras && navigation.extras.state && navigation.extras.state['message']) {
      this.message = navigation.extras.state['message'];
    }
  }
}
