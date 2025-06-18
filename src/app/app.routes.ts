import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './_helpers/guards/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { EquipmentDetailsComponent } from './pages/equipment-details/equipment-details.component';
import { Error404Component } from './pages/error404/error404.component';
import { HikesComponent } from './pages/hikes/hikes.component';
import { HikeDetailsComponent } from './pages/hike-details/hike-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { blockingGuard } from './_helpers/guards/blocking.guard';
import { environment } from '../environments/environment';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'}, 
    {
        path:'home',
        component: HomeComponent,
        title : `${environment.title} - Accueil`},
    {
        path:'login',
        component: LoginComponent, canActivate: [authGuard], data: {requiresAuth : false},
        title : `${environment.title} - Connexion`},
    {
        path:'logout',
        component: LogoutComponent, canActivate: [authGuard], data: {requiresAuth : true},
        title : `${environment.title}`},
    {
        path:'register',
        component: RegisterComponent, canActivate: [authGuard], data: {requiresAuth : false},
        title : `${environment.title} - Inscription`},
    {
        path:'error404',
        component: Error404Component,
        title : `${environment.title} - Erreur`},
    {
        path:'inventory',
        component: InventoryComponent, canActivate: [authGuard], data: {requiresAuth : true},
        title : `${environment.title} - Inventaire`},
    {
        path:'inventory/equipments/:equipmentId',
        component: EquipmentDetailsComponent, canActivate: [authGuard], data: {requiresAuth : true},
        title : `${environment.title} - Équipement`},
    {
        path:'hikes',
        component: HikesComponent, canActivate: [authGuard], data: {requiresAuth : true},
        title : `${environment.title} - Randonnées`},
    {
        path:'hikes/:hikeId',
        component: HikeDetailsComponent, canActivate: [authGuard], data: {requiresAuth : true},
        title : `${environment.title} - Randonnées`},
    {
        path:'profile',
        component: ProfileComponent, canActivate: [authGuard], data: {requiresAuth : true},
        title : `${environment.title} - Profil`},
    
     // {path:'hikes/create',
//      component: CreateHikeComponent, canActivate: [authGuard],
        //  title : `${environment.title}`},
    {
        path:'models',
        component: HikesComponent, canActivate: [blockingGuard],
        title : `${environment.title} - Modèles`},
    
         // {path:'contact',
    //  component: ContactComponent,
    //  title : `${environment.title}`},

];
