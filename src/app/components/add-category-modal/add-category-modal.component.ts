import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ModalService } from '../../services/modal.service';
import { InventoryService } from '../../services/inventory.service';
import { Category } from '../../interfaces/equipment/Category';

@Component({
  selector: 'app-add-category-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category-modal.component.html'
})
export class AddCategoryModalComponent implements OnInit{

  @Input() requestType : string | undefined;
  @Input() category : Category | null = null;

  private categoryService : CategoryService = inject(CategoryService);
  private inventoryService : InventoryService = inject(InventoryService);
  private modalService : ModalService = inject(ModalService);

  categoryHttpError : string = '';

  icons : string[] = [
    'no_icon',
    'icon_backpack',
    'icon_bed',
    'icon_bier',
    'icon_bolt',
    'icon_boots',
    'icon_bottle',
    'icon_camera',
    'icon_clock',
    'icon_clothes',
    'icon_coffee',
    'icon_fishing',
    'icon_flashlight',
    'icon_food',
    // 'icon_goggles',
    'icon_health',
    'icon_heart',
    'icon_light',
    'icon_map',
    'icon_moon',
    'icon_paw',
    'icon_recycle',
    'icon_shower',
    'icon_star',
    'icon_sun',
    'icon_tent',
    'icon_toiletpaper',
    'icon_toothbrush',
    'icon_trash',
    'icon_walk',
    'icon_water',
    'icon_wind',
    'icon_zzz'
  ]

  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    icon: new FormControl('no_icon',[Validators.required])
  })

  ngOnInit(): void {
    this.categoryForm.patchValue({
      name : this.category?.name ?? '',
      icon: this.category?.icon ?? 'no_icon'
    })
      console.log(this.category, this.category?.name ?? '')
  }


  onSubmit(){

    //Différencier si identifiant présent ou non pour savoir si on modifie ou ajoute une catégorie.


    //Si modification, alors les équipements vont être changés donc à voir comment gérer ça (même cas pour la suppression)



    if(this.categoryForm.valid){ // Si tous les validateurs sont passés

      if(this.category?.id){

        //Modifier la catégorie avec le name et icon :
        this.category.name = this.categoryForm.get('name')?.value;
        this.category.icon = this.categoryForm.get('icon')?.value;

        console.log('AVANT REQUETE : ', this.category)

        this.categoryService.modifyInventoryCategory(this.category).subscribe({
          next: (response)=>{
            //Si réponse valide : 
            console.log(response);

            // Mettre à jour l'affichage de la catégorie sur la page principale en notifiant le service
            this.inventoryService.notifyCategoryChange(response.data)


            //Fermer la modale
            this.modalService.closeModal();

          },
          error: (err)=>{
            console.log(err)

            this.categoryHttpError = err.error.message;
          }
        })
      }
      else{

        this.categoryService.addInventoryCategory(this.categoryForm.value).subscribe({
          next:(response)=>{
            console.log(response)
  
            // SI réponse valide, alors :
  
            // Notifier l'inventoryService qu'une catégorie à été ajouté pour que le composant l'affiche.
            this.inventoryService.notifyCategoryChange(response.data)
  
            // Enlever la modale
            this.modalService.closeModal();
          },
          error: (err)=>{
            console.log(err)
  
            // SI erreur, l'affichée dans le formulaire
            this.categoryHttpError = err.error.message;
          }
        })
      }
    }

  }


  selectIcon(iconName : string) : void{
    this.categoryForm.get('icon')?.setValue(iconName);
  }

}
