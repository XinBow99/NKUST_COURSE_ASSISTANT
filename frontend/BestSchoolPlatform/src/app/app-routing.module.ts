import { Routes } from '@angular/router';
import { BestschoolLayoutComponent } from './bestschool-layout/bestschool-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '',
    component: BestschoolLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./bestschool-layout/bestschool-layout.module').then(m => m.BestschoolLayoutModule)
      }]
  },
  {
    path: '**',
    redirectTo: 'index'
  }
];
