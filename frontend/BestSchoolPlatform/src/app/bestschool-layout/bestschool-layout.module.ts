import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BestschoolLayoutRoutes } from './bestschool-layout.routing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { IndexComponent } from '../pages/index/index.component';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [
    RouterModule.forChild(BestschoolLayoutRoutes),
    FormsModule,
    NgbModule,
    CommonModule
  ],
  declarations: [
    IndexComponent,
  ]
})
export class BestschoolLayoutModule { }
