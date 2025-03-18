import { Component, Input } from '@angular/core';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';
import { EquipmentCardComponent } from '../equipment-card/equipment-card.component';

@Component({
  selector: 'app-hike-inventory',
  imports: [EquipmentCardComponent],
  templateUrl: './hike-inventory.component.html'
})
export class HikeInventoryComponent {

  @Input() hikeInventory : Map<Category, Equipment[]>|null = null;




  placeholder(){
    console.log('oui.')
  }


  toggleCategoryContainer(index : number){

    const content = document.getElementById('equipment-content-'+index);
    const icon = document.querySelector(`#category-toggle-${index} img`);
    const categoryContainer = document.querySelector(`#category-container-${index}`)

    if(!content || !icon || !categoryContainer){
      return;
    }

    if (content && content.style.maxHeight && content.style.maxHeight !== '0px') {

      content.style.maxHeight = '0';
      content.classList.toggle('border-stone-300')
      content.classList.toggle('border')
      
      icon.classList.toggle('rotate-180')
      categoryContainer.classList.toggle('rounded-b-md')

    } else if (content) {
      if(content.scrollHeight !== 0){
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.removeProperty('height')
      }
      else{
        content.style.maxHeight = categoryContainer.scrollHeight + 'px';
        content.style.height = categoryContainer.scrollHeight + 'px';
      }

      content.classList.toggle('border-stone-300')
      content.classList.toggle('border')

      icon.classList.toggle('rotate-180')
      categoryContainer.classList.toggle('rounded-b-md')
    }

  }
}
