import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event } from './tab1/Event';
// import { MyEvent } from './my-events/MyEvent';

@Injectable({
  providedIn: 'root'
})
export class EventListService {
//   private _myEvents: MyEvent[] = [];
  private _eventList: Event[] = [];

//   myEvents: BehaviorSubject<MyEvent[]> = new BehaviorSubject([]);
  eventList: BehaviorSubject<Event[]> = new BehaviorSubject([]);

  constructor() {
  }

  addEvent(event : Event){
    if(this.timeCheck(event)){
      this._eventList.push(event);
      this.eventList.next(this._eventList);
      
    //   this.addMyEvent(event);
    //   this.myEvents.next(this._myEvents);
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

  timeCheck(event){
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

//   addMyEvent(event){
//     let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
//     let value = {
//       ui: event.ui,
//       title: event.title,
//       start: new Date(event.start).toLocaleDateString("es-ES", options),
//       end: new Date(event.end).toLocaleDateString("es-ES", options),
//       description: event.description
//     }
//     this._myEvents.push(value);
//   }

  deleteEvent(ui){
    // this._myEvents.map((event, index) =>{
    //   if(event.ui == ui){
    //     this._myEvents.splice(index, 1);
    //   }
    // });
    // this.myEvents.next(this._myEvents);

    this._eventList.map((event, index) =>{
      if(event.ui == ui){
        this._eventList.splice(index, 1);
      }
    });
    this.eventList.next(this._eventList);
  }

//   getUi(){
//     return this._myEvents.length;
//   }
}
