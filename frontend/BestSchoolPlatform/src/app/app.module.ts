import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';

import { AppComponent } from './app.component';

import { BestschoolLayoutComponent } from './bestschool-layout/bestschool-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    BestschoolLayoutComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
