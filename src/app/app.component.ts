import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import Cookie from "js-cookie";



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
        console.log(user)
        Cookie.set("user", user.displayName);
        Cookie.set("userEmail", user.email);

        this.isLogued= true;
      }else{
        this.isLogued= false;
      }
    });
  }

  logout(){
    this.auth.signOut();
    Cookie.remove("user");
    Cookie.remove("userEmail");

  }
}
