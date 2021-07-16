import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
//import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';

//interface
export interface Item { name: string; }
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  constructor(afs: AngularFirestore, public auth: AngularFireAuth) {
    this.itemsCollection = afs.collection<Item>('items');
    this.items = this.itemsCollection.valueChanges(
      { name: 'test1' }
    );
  }

  ngOnInit(): void {

  }

  addItem(item: Item) {
    this.itemsCollection.add(item);
  }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  

}
