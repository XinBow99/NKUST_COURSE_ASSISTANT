import { Routes } from '@angular/router';

import { IndexComponent } from '../pages/index/index.component';

//Auth
import { canActivate } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const BestschoolLayoutRoutes: Routes = [
  { path: 'index', component: IndexComponent, ...canActivate(redirectUnauthorizedToLogin) }
];
