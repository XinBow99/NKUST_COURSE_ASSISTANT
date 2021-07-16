import { Routes } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { IndexComponent } from '../pages/index/index.component';

//Auth
import { canActivate } from '@angular/fire/auth-guard';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToIndex = () => redirectLoggedInTo(['index']);

export const BestschoolLayoutRoutes: Routes = [
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToIndex) },
  { path: 'register', component: RegisterComponent, ...canActivate(redirectLoggedInToIndex) },
  { path: 'index', component: IndexComponent, ...canActivate(redirectUnauthorizedToLogin) }
];
