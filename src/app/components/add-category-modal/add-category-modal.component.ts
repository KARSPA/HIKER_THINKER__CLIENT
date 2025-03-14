import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category-modal.component.html'
})
export class AddCategoryModalComponent {

  @Input() title : string | undefined;


  icons : string[] = [
    'icon_empty',
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
    icon: new FormControl('icon_empty',[Validators.required])
  })


  onSubmit(){
    console.log("SOUMIS !", this.categoryForm.value)
  }


  selectIcon(iconName : string) : void{
    this.categoryForm.get('icon')?.setValue(iconName);
  }

}
