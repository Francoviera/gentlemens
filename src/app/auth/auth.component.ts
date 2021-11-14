import { Component } from '@angular/core';
import { User } from './User';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import firebase from 'firebase/compat/app';

import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})

export class AuthComponent implements OnInit {
  
  public user: User;

  public isLogin: Boolean;
  
  constructor(private auth: AngularFireAuth) {
    this.isLogin= true;
    this.user= {
      email: "",
      password: "",
      name: "",
    }
    // this.userData= this.auth.authState;
  }
  login() {
    if(this.user.email != "" && this.user.password != "" ){
      // this.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
      // .then(value => {
        // this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
           this.auth.signInWithEmailAndPassword(this.user.email, this.user.password);
        // });
          // console.log("ee", this.userData);
      // })
      // .catch(err => {
      //   console.log('Something went wrong: ', err.message);
      // });
    }else{
      alert("Complete todos los campos");
    }
  }

  register() {
    if(this.user.email != "" && this.user.password != "" && this.user.name != ""){
      this.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(user => {
          console.log(user);
          this.auth.authState.subscribe(data => {

            data.updateProfile({
              displayName: this.user.name,
            })
          })
        })
      }else{
          alert("Complete todos los campos");
      }
  }

  changeModal() {
    this.isLogin= !this.isLogin;
  }

  ngOnInit() {}

}
