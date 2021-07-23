import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';

import { AppComponent } from './app.component';

import { BestschoolLayoutComponent } from './bestschool-layout/bestschool-layout.component';
import { NavbarComponent } from './navbar/navbar.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './pages/login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    BestschoolLayoutComponent,
    LoginComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
