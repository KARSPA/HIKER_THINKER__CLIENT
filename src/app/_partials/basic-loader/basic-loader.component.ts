import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-loader',
  imports: [],
  templateUrl: './basic-loader.component.html',
})
export class BasicLoaderComponent {

  @Input() title = "";
}
