import { Injectable } from '@angular/core';
import { options } from 'preact';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from './tab1/Event';
import { MyEvent } from './tab2/MyEvent';

import {Turnos} from './Turnos'

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserData } from './UserData';
import Cookie from "js-cookie";


@Injectable({
  providedIn: 'root'
})
export class EventListService {
  private collectionTurno: AngularFirestoreCollection<Turnos>;
  private collectionUser: AngularFirestoreCollection<UserData>;

  public eventListDb: Event[]= [];

  myEvents: BehaviorSubject<MyEvent[]> = new BehaviorSubject([]);
  eventList: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  userList: BehaviorSubject<UserData[]> = new BehaviorSubject([]);

  constructor(private afs: AngularFirestore){
    this.collectionTurno= afs.collection<Turnos>('Turnos');
    let date= new Date().getFullYear()+"/"+new Date().getMonth()+"/";
    for (let i = 0; i < 30 ; i++) {
      console.log("a")
      let turnosDb= this.collectionTurno.doc(date+i);
      turnosDb.get().subscribe(turnos =>{
        let turnosList= turnos.get("turnos");
        if(turnosList != undefined){
          for(let turno of turnosList) {
            turno.start= new Date(turno.start.toDate());
            turno.end= new Date(turno.end.toDate());
            turno.description= " ";
            this.eventListDb.push(turno);
          }
        }
        if(i == 29){
          this.addEvents();
        }
      })

    }
    // this.eventList.next(this.eventListDb);
    this.collectionUser= afs.collection<UserData>('Users');
    this.collectionUser.valueChanges().subscribe(userList =>{this.userList.next(userList)});
    this.loadMyEvents();
  }

  // verifyExistEventPending(event: Event){
  //   let array : MyEvent[]= this.myEvents;

  //   if(array[array.length-1].valueOf)
  // }
  
  addEvent(event : Event){
    if(this.timeCheck(event)){
      this.addMyEvent(event, Cookie.get("userEmail"));
      //si el turno se pudo agregar se agrega a la lista de turnos
      // if(verifyExistEventPending(event)){
        let date= new Date(event.start).getFullYear()+"/"+new Date(event.start).getMonth()+"/"+new Date(event.start).getDate();
        let turnosDb= this.collectionTurno.doc(date);
        let arrayTurnos: Turnos= {
          turnos: []
        };
        turnosDb.get().subscribe(turnos =>{
          if(turnos.exists){

            arrayTurnos.turnos= turnos.get("turnos");
            arrayTurnos.turnos.push(event);
            turnosDb.update({turnos: arrayTurnos.turnos})
            this.eventList.next(arrayTurnos.turnos);
          }else {
            arrayTurnos.turnos.push(event);
            this.collectionTurno.doc(date).set(arrayTurnos);
          }
        });

        return null;
      // }else{
      //   return "Ya posees un Turno";
      // }
    }else{
     return "Ingrese fechas de inicio y fin Validas!";
    }
  }

  addEvents(){
    // for (let event of events) {
    //   this.eventList.push(event);
    // }
    console.log(this.eventListDb)
    this.eventList.next(this.eventListDb);
  }

  timeCheck(event: Event){
    if(event.start >= event.end){
      return false
    }
    // for (let e of this.eventsDB) {
    //   if(this.event.start >= e.start && this.event.start <= e.start){
    //     console.log(e);
    //   }
    // }

    return true;
  }

  loadMyEvents(){
    let userDb= this.collectionUser.doc(Cookie.get("userEmail"));
    let array= [];
    userDb.get().subscribe(user =>{
      array= user.get("turnos");
      console.log(array)
      console.log(user)
      // userDb.update({turnos: array})
      this.myEvents.next(array);
    });
  }

  addMyEvent(event: Event, email: string){
    let value = {
      ui: event.ui,
      title: event.title,
      start: event.start,
      end: event.end,
    }
    let userDb= this.collectionUser.doc(email);
    let array= [];
    userDb.get().subscribe(user =>{
      array= user.get("turnos");
      console.log(array)
      array.push(value);
      console.log(user)
      userDb.update({turnos: array})
      this.myEvents.next(array);
    });
  }

  deleteEvent(event: Event){
    let userDb= this.collectionUser.doc(Cookie.get("userEmail"));
    let array= [];
    console.log(userDb)
    userDb.get().subscribe(user =>{
      array= user.get("turnos");
      console.log(array)
      console.log(user)
      // array.map((turno, index) => {
      //   if(turno.ui === event.ui){
      //     arrayTurnos.turnos.splice(index, 1);
      //     return null;
      //   }
      // });
      // userDb.update({turnos: array})
      // this.myEvents.next(array);
    });

    let date= new Date(event.start).getFullYear()+"/"+new Date(event.start).getMonth()+"/"+new Date(event.start).getDate();
      let turnosDb= this.collectionTurno.doc(date);
      let arrayTurnos: Turnos= {
        turnos: []
      };
      // turnosDb.get().subscribe(turnos =>{
      //   if(turnos.exists){
      //     arrayTurnos.turnos= turnos.get("turnos");
      //     arrayTurnos.turnos.map((turno, index) => {
      //       if(turno.ui === event.ui){
      //         arrayTurnos.turnos.splice(index, 1);
      //         return null;
      //       }
      //     });
      //     turnosDb.update({turnos: arrayTurnos.turnos})
      //     this.eventList.next(arrayTurnos.turnos);
      //   }else {
      //     alert("Error al Borrar");
      //   }
    // });
  }

  getTurnos(){
    return this.afs.collection("Turnos").valueChanges;
  }
}
