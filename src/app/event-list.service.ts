import { Injectable } from '@angular/core';
import { options } from 'preact';
import { BehaviorSubject } from 'rxjs';
import { Event } from './tab1/Event';
import { MyEvent } from './tab2/MyEvent';

@Injectable({
  providedIn: 'root'
})
export class EventListService {
  private _myEvents: MyEvent[] = [];
  private _eventList: Event[] = [];

  myEvents: BehaviorSubject<MyEvent[]> = new BehaviorSubject([]);
  eventList: BehaviorSubject<Event[]> = new BehaviorSubject([]);

  constructor() {
  }

  addEvent(event : Event){
    if(this.timeCheck(event)){
      console.log(event)
      this._eventList.push(event);
      this.eventList.next(this._eventList);
      
      this.addMyEvent(event);
      this.myEvents.next(this._myEvents);
      return null;
    }else{
     return "Ingrese fechas de inicio y fin Validas!";
    }
  }

  addEvents(events : Event[]){
    for (let event of events) {
      this._eventList.push(event);
    }
    this.eventList.next(this._eventList);
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

  addMyEvent(event: Event){
    let value = {
      ui: event.ui,
      title: event.title,
      start: new Date(event.start).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}),
      end: new Date(event.end).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}),
    }
    this._myEvents.push(value);
  }

  deleteEvent(ui: Number){
    this._myEvents.map((event, index) =>{
      if(event.ui == ui){
        this._myEvents.splice(index, 1);
      }
    });
    this.myEvents.next(this._myEvents);

    this._eventList.map((event, index) =>{
      if(event.ui == ui){
        this._eventList.splice(index, 1);
      }
    });
    this.eventList.next(this._eventList);
  }

  getUi(){
    return this._myEvents.length;
  }
}
