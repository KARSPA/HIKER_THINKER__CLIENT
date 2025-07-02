import { AppComponent } from "./app.component"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { provideRouter, Router } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { inject, LOCALE_ID, provideAppInitializer } from '@angular/core';
import { routes } from "./app.routes";
import { initializeApp } from "./app.config";

describe('AppComponent', () => { 
    let fixture : ComponentFixture<AppComponent>;
    let component : AppComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
                providers: [
                   // Remplace APP_INITIALIZER par une initialisation neutre
                    provideAppInitializer(()=>initializeApp(inject(AuthService), inject(Router))),

                    // Router et HttpClient mocks
                    provideRouter(routes),
                    provideHttpClient(),

                    // Locale (doit correspondre à votre appConfig)
                    { provide: LOCALE_ID, useValue: 'fr-FR' }
                ]
        });

        fixture = TestBed.createComponent(AppComponent)
        component = fixture.componentInstance;
    });


    it('should be create', ()=>{
        expect(component).toBeTruthy();
    })
 })

function provideRouterTesting(): any {
    throw new Error("Function not implemented.");
}
