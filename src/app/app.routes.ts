import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ListingsComponent } from './components/listings/listings.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ListingComponent } from './components/listing/listing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authenticatedGuard } from './guards/authenticated.guard';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { ListingCreationComponent } from './components/listing-creation/listing-creation.component';
import { BookingComponent } from './components/booking/booking.component';
import { BookingCreationComponent } from './components/booking-creation/booking-creation.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'register',
    canActivate: [unauthenticatedGuard],
    component: RegisterComponent,
  },
  {
    path: 'login',
    canActivate: [unauthenticatedGuard],
    component: LoginComponent,
  },
  { path: 'listings', component: ListingsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'booking-creation', component: BookingCreationComponent },
  {
    path: 'profile',
    canActivate: [authenticatedGuard],
    component: ProfileComponent,
  },
  {
    path: 'listing-creation',
    canActivate: [authenticatedGuard],
    component: ListingCreationComponent,
  },
];
