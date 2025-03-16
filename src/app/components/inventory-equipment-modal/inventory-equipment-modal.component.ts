import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Category } from '../../interfaces/equipment/Category';
import { EquipmentService } from '../../services/equipment.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-inventory-equipment-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-equipment-modal.component.html'
})
export class InventoryEquipmentModalComponent {

  @Input() categories : Category[] = [];


  private inventoryService : InventoryService = inject(InventoryService);
  private equipmentService : EquipmentService = inject(EquipmentService);
  private modalService : ModalService = inject(ModalService);

  equipmentHttpError = null;


  equipmentForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    weight : new FormControl('', [Validators.required, Validators.pattern("^(?:[1-9]\\d{0,3}|10000)$")]),
    description : new FormControl('', [Validators.maxLength(500)]),
    brand : new FormControl('', [Validators.required, Validators.maxLength(20)]),
    categoryName : new FormControl('Sans catégorie', [Validators.required]),
  })



  onSubmit(){
    console.log("SOUMIS EQUIPEMENT", this.equipmentForm.errors)

    if(this.equipmentForm.valid){

      // Requêter l'API pour ajouter l'équipement
        this.equipmentService.addInventoryEquipment({
          name : this.name?.value,
          weight : this.weight?.value,
          description : this.description?.value,
          brand : this.brand?.value,
          categoryName : this.categoryName?.value
        }).subscribe({
          next:(response)=>{
            console.log(response)

            // Notifier l'inventory service avec le nouvel équipement pour mettre à jour l'affichage
            this.inventoryService.notifyEquipmentChange(response.data)


            //Fermer la modale
            this.modalService.closeModal()

          },
          error: (err)=>{
            console.log(err)
          }
        })
    }
  }



  getErrorMessage(reason : string, length : number = 0) : string{

    let errorMessage : string = '';

    switch(reason){
      case 'required':
        errorMessage = 'Champ requis.';
        break;
      case 'maxlength':
        errorMessage = `Au plus ${length} caractères.`;
        break;
      case 'number':
        errorMessage = 'Entrez un poids valide. Inférieur à 10 000 (grammes).';
        break;
    }

    return errorMessage;
  }


  allFieldsTouched() : boolean{
    return (this.equipmentForm.get('name')?.touched
      && this.equipmentForm.get('weight')?.touched
      && this.equipmentForm.get('brand')?.touched
      && this.equipmentForm.get('categoryName')?.touched) ?? false;
  }

  get name(){
    return this.equipmentForm.get('name');
  }
  get weight(){
    return this.equipmentForm.get('weight');
  }
  get brand(){
    return this.equipmentForm.get('brand');
  }
  get description(){
    return this.equipmentForm.get('description');
  }
  get categoryName(){
    return this.equipmentForm.get('categoryName');
  }
}
