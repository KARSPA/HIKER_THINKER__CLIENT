import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-category-modal',
  imports: [],
  templateUrl: './add-category-modal.component.html'
})
export class AddCategoryModalComponent {

  @Input() title : string | undefined;

}
