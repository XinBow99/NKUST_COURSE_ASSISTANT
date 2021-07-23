import { Routes } from '@angular/router';
import { BestschoolLayoutComponent } from './bestschool-layout/bestschool-layout.component';
import { LoginComponent } from './pages/login/login.component';

import { canActivate } from '@angular/fire/auth-guard';
import { redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectLoggedInToIndex = () => redirectLoggedInTo(['index']);
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: BestschoolLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./bestschool-layout/bestschool-layout.module').then(m => m.BestschoolLayoutModule),
      }],

  },

  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToIndex) },
  { path: '**', redirectTo: 'index' }
];
