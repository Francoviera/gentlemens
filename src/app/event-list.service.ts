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

  public myEventsDb: Event[]= [];


  myEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
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
  
  verifyExistEventPending(event: Event){
    // let array : Event[]= this.myEventsDb;
    // console.log(array)
    // console.log(array[array.length-1].start <= event.start);
    // if(array == undefined){
    //   return true;
    // }
    return true;
  }
  
  addEvent(event : Event){
    if(this.timeCheck(event)){
      this.addMyEvent(event, Cookie.get("userEmail"));
      // si el turno se pudo agregar se agrega a la lista de turnos
      // this.verifyExistEventPending(event);
      if(this.verifyExistEventPending(event)){
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
      }else{
        return "Ya posees un Turno";
      }
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

  // Función para calcular los días transcurridos entre dos fechas
  restaFechas = function(f1 : Date,f2: Date){
    let fechaInicio = f1.getTime();
    let fechaFin    = f2.getTime();
    
    let dif = fechaFin - fechaInicio;

    let dias = Math.floor(dif / (1000 * 60 * 60 * 24));

    return dias;
  }

  async timeCheck(event: Event){
    debugger;
    if(event.start >= event.end){
      return false;
    }else if(new Date(event.start) < new Date(Date.now())){
      return false;
    } 

    for (let e of this.myEventsDb) {
      let result= this.restaFechas(new Date(e.start), new Date(event.start));
        
      if(e.start > event.start || result < 7)
        return false;
    }

    return true;
  }
  loadMyEvents(){
    console.log(Cookie.get("userEmail"))
    let userDb= this.collectionUser.doc(Cookie.get("userEmail"));
    console.log(userDb)

    let array= [];
    userDb.get().subscribe(user =>{
      array= user.get("turnos");
      console.log(user)
      array.map(item => {
        let eventValue= item;
        item.start= eventValue.start.toDate();
        item.end= eventValue.end.toDate();
      });
      // userDb.update({turnos: array})
      console.log(array)

      this.myEvents.next(array);
      this.myEventsDb= array;
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
      
      if(array === undefined){
        array= [];
        array.push(value);
        this.collectionUser.doc(Cookie.get("userEmail")).set({
          turnos: array
        })

      }else{
        array.push(value);
        console.log(user)
        userDb.update({turnos: array})
      }
      this.myEvents.next(array);
    });
  }

  deleteEvent(event: Event){
    // debugger;
    let userDb= this.collectionUser.doc(Cookie.get("userEmail"));
    // let array= [];
    // console.log(userDb)
    // userDb.get().subscribe(user =>{
    //   array= user.get(Cookie.get("userEmail"));
    //   console.log(array)
    //   console.log(user)
    //   array.map((turno, index) => {
    //     if(turno.ui === event.ui){
    //       array.splice(index, 1);
    //       return null;
    //     }
    //   });
    //   userDb.update({turnos: array})
    //   this.myEvents.next(array);
    // });

    let date= new Date(event.start).getFullYear()+"/"+new Date(event.start).getMonth()+"/"+new Date(event.start).getDate();
      let turnosDb= this.collectionTurno.doc(date);
      let arrayTurnos = []; 
      turnosDb.get().subscribe(turnos =>{
        if(turnos.exists){
          console.log(turnos)
          console.log(turnos.get("turnos"))
          arrayTurnos= turnos.get("turnos");
            arrayTurnos.map((turno, index) => {
              if(turno.ui === event.ui){
                arrayTurnos.splice(index, 1);
                return null;
              }
            });
          console.log(arrayTurnos)
          
        }else {
          alert("Error al Borrar");
        }
    });
    let values= this.myEvents.getValue();
    console.log(values)
    values.map((turno, index) => {
      if(turno.ui === event.ui){
        values.splice(index, 1);
        return null;
      }
    });
    userDb.update({turnos: values})
    this.eventList.next(values);
  }

  getTurnos(){
    return this.afs.collection("Turnos").valueChanges;
  }
}
