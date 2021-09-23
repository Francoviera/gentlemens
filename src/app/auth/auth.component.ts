import { Component } from '@angular/core';
import { User } from './User';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import firebase from 'firebase/compat/app';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})

export class AuthComponent implements OnInit {
  
  public user: User;

  public isLogin: Boolean;
  
  public userData: Observable<firebase.User>;
  
  constructor(private auth: AngularFireAuth) {
    this.isLogin= true;
    this.user= {
      email: "",
      password: "",
    }

    this.userData= this.auth.authState;
  }
  login() {
    if(this.user.email != "" && this.user.password != ""){
      this.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(value => {
        console.log(value);
        console.log("userdata", this.auth.user)
      })
      .catch(err => {
        console.log('Something went wrong: ', err.message);
      });
    }
  }

  register() {
    this.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(user => {
        console.log(user);
      })
  }
  changeModal() {
    this.isLogin= !this.isLogin;
  }

  ngOnInit() {}

}
