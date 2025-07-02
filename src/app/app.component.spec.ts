import { AppComponent } from "./app.component"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './services/auth.service';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';

describe('AppComponent', () => { 
    let fixture : ComponentFixture<AppComponent>;
    let component : AppComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
                imports: [
                    RouterTestingModule.withRoutes([]),    // mock de Router
                    HttpClientTestingModule               // mock de HttpClient
                ],
                providers: [
                    AuthService,                          // ou { provide: AuthService, useValue: yourMock }
                    {
                    provide: APP_INITIALIZER,
                    useFactory: () => () => Promise.resolve(),
                    multi: true
                    },
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