import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ListingsComponent } from './components/listings/listings.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ListingDetailsComponent } from './components/listing-details/listing-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ListingCreationComponent } from './components/listing-creation/listing-creation.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  { path: 'register', canActivate: [authGuard], component: RegisterComponent },
  { path: 'login', canActivate: [authGuard], component: LoginComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'listing-details/:id', component: ListingDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'listing-creation', component: ListingCreationComponent },

];
