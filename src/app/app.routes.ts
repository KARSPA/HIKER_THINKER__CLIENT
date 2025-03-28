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

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'}, 
    {path:'home', component: HomeComponent},
    {path:'login', component: LoginComponent, canActivate: [authGuard], data: {requiresAuth : false}},
    {path:'logout', component: LogoutComponent, canActivate: [authGuard], data: {requiresAuth : true}},
    {path:'register', component: RegisterComponent, canActivate: [authGuard], data: {requiresAuth : false}},
    {path:'error404', component: Error404Component},
    {path:'inventory', component: InventoryComponent, canActivate: [authGuard], data: {requiresAuth : true}},
    {path:'inventory/equipments/:equipmentId', component: EquipmentDetailsComponent, canActivate: [authGuard], data: {requiresAuth : true}},
    {path:'hikes', component: HikesComponent, canActivate: [authGuard], data: {requiresAuth : true}},
    {path:'hikes/:hikeId', component: HikeDetailsComponent, canActivate: [authGuard], data: {requiresAuth : true}},
    {path:'profile', component: ProfileComponent, canActivate: [authGuard], data: {requiresAuth : true}},
    // {path:'hikes/create', component: CreateHikeComponent, canActivate: [authGuard]},
    {path:'models', component: HikesComponent, canActivate: [blockingGuard]},
    // {path:'contact', component: ContactComponent},

];
