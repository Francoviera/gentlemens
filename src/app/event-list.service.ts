import { Injectable } from '@angular/core';
import { options } from 'preact';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from './tab1/Event';
import { MyEvent } from './tab2/MyEvent';

import {Turnos} from './Turnos'

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserData } from './UserData';
import { ArrayType } from '@angular/compiler';


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

  }

  addEvent(event : Event, email : string){
    if(this.timeCheck(event)){
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

      this.addMyEvent(event, email);
      return null;
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

  addMyEvent(event: Event, email: string){
    let value = {
      ui: event.ui,
      title: event.title,
      start: new Date(event.start).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}),
      end: new Date(event.end).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}),
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

  deleteEvent(ui: Number){
    // this._myEvents.map((event, index) =>{
    //   if(event.ui == ui){
    //     this._myEvents.splice(index, 1);
    //   }
    // });
    // this.myEvents.next(this._myEvents);

    // this._eventList.map((event, index) =>{
    //   if(event.ui == ui){
    //     this._eventList.splice(index, 1);
    //   }
    // });
    // this.eventList.next(this._eventList);
  }

  getTurnos(){
    return this.afs.collection("Turnos").valueChanges;
  }
}
