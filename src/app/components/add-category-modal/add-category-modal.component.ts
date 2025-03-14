import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-category-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category-modal.component.html'
})
export class AddCategoryModalComponent {

  @Input() title : string | undefined;

  private categoryService : CategoryService = inject(CategoryService);

  categoryAddError : string = '';

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


  onSubmit(){
    console.log("SOUMIS !", this.categoryForm.value)

    if(this.categoryForm.valid){ // Si tous les validateurs sont passés
      this.categoryService.addInventoryCategory(this.categoryForm.value).subscribe({
        next:(response)=>{
          console.log(response)

          // SI réponse valide, alors :

            // Enlever la modale
            // Transmettre ce retour de catégorie à la page/composant principal (inventory)
            // Afficher cette nouvelle catégorie sur la page inventory
        },
        error: (err)=>{
          console.log(err)

          // SI erreur, l'affichée dans le formulaire
          this.categoryAddError = err.error.message;
        }
      })
    }

  }


  selectIcon(iconName : string) : void{
    this.categoryForm.get('icon')?.setValue(iconName);
  }

}
