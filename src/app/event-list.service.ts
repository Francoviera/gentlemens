import { Injectable } from '@angular/core';
import { options } from 'preact';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from './tab1/Event';
import { MyEvent } from './tab2/MyEvent';

import {Turno} from './Turno'

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserData } from './UserData';


@Injectable({
  providedIn: 'root'
})
export class EventListService {
  private collectionTurno: AngularFirestoreCollection<Event>;
  private collectionUser: AngularFirestoreCollection<UserData>;

  myEvents: BehaviorSubject<MyEvent[]> = new BehaviorSubject([]);
  eventList: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  userList: BehaviorSubject<UserData[]> = new BehaviorSubject([]);

  constructor(private afs: AngularFirestore) {
    this.collectionTurno= afs.collection<Event>('Turnos');
    this.collectionTurno.valueChanges().subscribe(turnos =>{this.eventList.next(turnos)});

    this.collectionUser= afs.collection<UserData>('Users');
    this.collectionUser.valueChanges().subscribe(userList =>{this.userList.next(userList)});

  }

  addEvent(event : Event, email : string){
    if(this.timeCheck(event)){
      console.log(event)
      this.collectionTurno.add(event)
      let array= this.eventList.getValue();
      array.push(event);
      this.eventList.next(array);
      
      this.addMyEvent(event, email);
      // this.myEvents.next(this._myEvents);
      return null;
    }else{
     return "Ingrese fechas de inicio y fin Validas!";
    }
  }

  addEvents(events : Event[]){
    for (let event of events) {
      // this._eventList.push(event);
    }
    // this.eventList.next(this._eventList);
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
      array= user.get("turnos")
      array.push(value)
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
