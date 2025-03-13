import { Component, inject, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../interfaces/Inventory';
import { EquipmentCardComponent } from '../../components/equipment-card/equipment-card.component';
import { Category } from '../../interfaces/equipment/Category';
import { Equipment } from '../../interfaces/equipment/Equipment';

@Component({
  selector: 'app-inventory',
  imports: [EquipmentCardComponent],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit{
  
  private inventoryService : InventoryService = inject(InventoryService)

  inventory : Map<Category, Equipment[]> | null = null;
  rawInventory : Inventory | null = null;

  ngOnInit(): void {
      this.inventoryService.getInventory().subscribe({
        next :(response) => {
          this.rawInventory = response.data;
          this.inventory = this.inventoryService.restructureInventory(response.data);
          console.log(response)
        },
        error : (error)=> {
          console.log(error)
        }
      })
    }



    displayAddPopup(){

    }

}
