import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./_partials/header/header.component";
import { ModalContainerComponent } from './components/modals/modal-container/modal-container.component';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ModalContainerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent{
}
