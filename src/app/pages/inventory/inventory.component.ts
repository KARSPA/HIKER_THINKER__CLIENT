import { Component, inject } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {

  private inventoryService : InventoryService = inject(InventoryService)

  // Récupérer l'inventaire de l'utilisateur connecté (avec son token)

}
