
import { Component, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { trace } from '@angular/fire/performance';
import { Inject } from '@angular/core';
import firebase from 'firebase/app';
import { isPlatformServer } from '@angular/common';
//import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//interface
export interface Item { name: string; }
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private readonly userDisposable: Subscription | undefined;
  showLoginButton = false;
  constructor(public readonly auth: AngularFireAuth, @Inject(PLATFORM_ID) platformId: object, private router: Router) {
    if (!isPlatformServer(platformId)) {
      this.userDisposable = this.auth.authState.pipe(
        trace('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
      });
    }
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }
  async login() {
    const user = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    // TODO sign into offline app
    this.router.navigate(['/index']);
  }

  showLoadingAni(){
    Swal.fire({
      title: 'Loading!',
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    });
  }


}
