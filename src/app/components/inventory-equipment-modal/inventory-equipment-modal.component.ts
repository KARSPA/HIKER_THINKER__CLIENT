import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Category } from '../../interfaces/equipment/Category';

@Component({
  selector: 'app-inventory-equipment-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-equipment-modal.component.html'
})
export class InventoryEquipmentModalComponent {

  @Input() categories : Category[] = [];


  private inventoryService : InventoryService = inject(InventoryService);

  equipmentHttpError = null;


  equipmentForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    weight : new FormControl('', [Validators.required, Validators.max(10000), Validators.pattern("^(?:[1-9]\d{0,3}|10000)$")]),
    description : new FormControl('', [Validators.maxLength(500)]),
    brand : new FormControl('', [Validators.required, Validators.maxLength(20)]),
    categoryName : new FormControl('Sans catégorie', [Validators.required]),
  })



  onSubmit(){
    console.log("SOUMIS EQUIPEMENT", this.equipmentForm.value)
  }
}
