import { ComponentFixture, TestBed } from "@angular/core/testing"
import { WeightGraphComponent } from "./weight-graph.component"
import { SimpleChange, SimpleChanges, ViewChild } from "@angular/core";
import { NgStyle } from "@angular/common";
import { Inventory } from "../../interfaces/Inventory";
import { MULTI_CATEGORY_INVENTORY, SINGLE_CATEGORY_INVENTORY } from "../../testing/inventory.data";
import { Hike } from "../../interfaces/hike/Hike";
import { ICON_COLORS } from "../../_helpers/records/icon_color";


class HostComponent {
  @ViewChild(WeightGraphComponent) graphComponent!: WeightGraphComponent;
  hostColor = 'red';
  emittedColor = '';
  onColorChanged(color: string) {
    this.emittedColor = color;
  };
}

describe('WeightGraphComponent', () => { 

    let fixture !: ComponentFixture<WeightGraphComponent>;
    let component !: WeightGraphComponent;

     // Injecter une randonnée factice (pour le poids total : totalWeight)
     // Injecter un inventaire vide de base (le remplir que dans certains cas de tests) 
     beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgStyle]
        }).compileComponents();

        fixture = TestBed.createComponent(WeightGraphComponent)
        component = fixture.componentInstance;
     });


    function triggerOnChanges(changes: SimpleChanges) {
        component.ngOnChanges(changes);
        fixture.detectChanges();
    }

     function createHike(totalWeight: number): Hike {
        return {
        id: 'hike-test-1',
        title: 'Randonnée de TEST',
        distance: 10,
        positive: 100,
        negative: 100,
        date: new Date('2025-01-01T12:00:00'),
        duration: 1,
        durationUnit: 'jours',
        weightCorrection: 0,
        totalWeight,
        inventory: null
        };
    }

     // Test montage correct du composant
     it('should be create', ()=>{
        expect(component).toBeTruthy();
     })


    it('should calculate a unique graph if only 1 category', () => {

        // INIT
        const hike = createHike(SINGLE_CATEGORY_INVENTORY.categories[0].accumulatedWeight);

        component.inventory = SINGLE_CATEGORY_INVENTORY;
        component.hike = hike;

        // DETECT CHANGEMENTS
        const changes: SimpleChanges = {
            inventory: new SimpleChange(null, SINGLE_CATEGORY_INVENTORY, true),
            hike:      new SimpleChange(null, hike, true)
        };
        triggerOnChanges(changes);

        // ASSERTIONS
        expect(component.graphInfos.isUnique).toBeTruthy();
        expect(component.graphInfos.infos.length).toBe(1);

        const info = component.graphInfos.infos[0];
        expect(info.percentage).toBe(100);       // 5/5*100
        expect(info.startAngle).toBe(0);
        expect(info.endAngle).toBe(360);
        expect(info.sectionStyle).toContain(ICON_COLORS['icon_boots']);
        });

     it('should calculate a 2 category graph with precise percentage', () => {
        // INIT
        const totalWeight = MULTI_CATEGORY_INVENTORY.categories
        .reduce((sum, c) => sum + c.accumulatedWeight, 0);

        const hike = createHike(totalWeight);

        component.inventory = MULTI_CATEGORY_INVENTORY;
        component.hike = hike;


        // DETECTION DES CHANGEMENTS
        const changes: SimpleChanges = {
            inventory: new SimpleChange(null, MULTI_CATEGORY_INVENTORY, true),
            hike:      new SimpleChange(null, hike, true)
        };
        triggerOnChanges(changes);

        // ASSERTIONS
        expect(component.graphInfos.isUnique).toBeFalsy();
        expect(component.graphInfos.infos.length)
        .toBe(MULTI_CATEGORY_INVENTORY.categories.length);

        const [info1, info2] = component.graphInfos.infos;
        // 1ère catégorie : 4/10*100 = 40%
        expect(info1.percentage).toBe(40);
        expect(info1.startAngle).toBe(0);
        expect(info1.endAngle).toBe(Math.min(Math.ceil(40 * 3.6), 360));
        expect(info1.sectionStyle).toContain(ICON_COLORS['icon_boots']);

        // 2ème catégorie : 6/10*100 = 60%
        expect(info2.percentage).toBe(60);
        expect(info2.startAngle).toBe(info1.endAngle);
        expect(info2.endAngle).toBe(360);
        expect(info2.sectionStyle).toContain(ICON_COLORS['icon_tent']);
    });
       
})