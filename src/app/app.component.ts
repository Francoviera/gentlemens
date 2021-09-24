import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isLogued: Boolean;

  constructor(private auth: AngularFireAuth) {
    this.isLogued= false;
    auth.authState.subscribe(user => {
      if(user){
        this.isLogued= true;
      }else{
        this.isLogued= false;
      }
    });
  }

  logout(){
    this.auth.signOut();
  }
}
