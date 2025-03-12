import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './_helpers/guards/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';

export const routes: Routes = [
    {path:'home', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'logout', component: LogoutComponent, canActivate: [authGuard]},
    {path:'register', component: RegisterComponent},
    // {path:'hikes', component: HikesComponent, canActivate: [authGuard]},
    // {path:'hikes/create', component: CreateHikeComponent, canActivate: [authGuard]},
    // {path:'models', component: ModelsComponent, canActivate: [authGuard]},
    // {path:'contact', component: ContactComponent},
    // {path:'hike/:hikeId', component: HikeDetailsComponent, canActivate: [authGuard]},

];
