import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BestschoolLayoutRoutes } from './bestschool-layout.routing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

import { LoginComponent } from '../pages/login/login.component';
import { IndexComponent } from '../pages/index/index.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BestschoolLayoutRoutes),
    FormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  declarations: [
    LoginComponent,
    IndexComponent
  ]
})
export class BestschoolLayoutModule { }
