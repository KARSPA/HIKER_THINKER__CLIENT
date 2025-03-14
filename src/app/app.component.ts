import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./_partials/header/header.component";
import { AuthService } from './services/auth.service';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ModalContainerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent{
  title = 'HikerThinker';
}
