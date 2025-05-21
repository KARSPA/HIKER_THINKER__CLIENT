import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { Category } from '../../../interfaces/equipment/Category';
import { CategoryEvent } from '../../../interfaces/equipment/CategoryEvent';
import { duplicateCategoryValidator } from '../../../_helpers/validators/duplicateCategoryName';

@Component({
  selector: 'app-category-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent implements OnInit{


  private modalService : ModalService = inject(ModalService);

  @Input() requestType : string | undefined;
  @Input() category : Category | null = null;
  @Input() existingCategories : Category[] = [];

  @Output() result = new EventEmitter<CategoryEvent>(); // Va remonter les évènements (au submit) pour déporter la logique métier

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
    name: new FormControl('',[Validators.required, duplicateCategoryValidator(this.existingCategories, this.category?.id)]),
    icon: new FormControl('no_icon',[Validators.required])
  })

  ngOnInit(): void {
    this.categoryForm.patchValue({
      name : this.category?.name ?? '',
      icon: this.category?.icon ?? 'no_icon'
    })
  }


  onSubmit(){

    if(!this.categoryForm.valid) return;

    const payload: Category = { 
      ...this.category, //On affecte les attributs de catégorie de base
      ...this.categoryForm.value //On affecte les valeurs du formulaire qui viendront écrasées celle de la catégorie de base
    }

    // console.log(payload)

    this.result.emit({
      action : this.category?.id ? 'update' : 'create',
      category : payload
    })



    this.modalService.closeModal();
  }


  selectIcon(iconName : string) : void{
    this.categoryForm.get('icon')?.setValue(iconName);
  }


  removeCategory(){
    if(!this.category?.id) return
    this.result.emit({
      action:'delete',
      category : this.category
    })

    this.modalService.closeModal();
  }


  get name(){
    return this.categoryForm.get('name')
  }
  get icon(){
    return this.categoryForm.get('icon')
  }

}
