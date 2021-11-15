import { Component } from '@angular/core';
import { EventListService } from '../event-list.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public myEvents: any = [];

  public eventDetail: Event;

  public modalViewCancelEvent: boolean;

  constructor(private events: EventListService) {
    events.myEvents.subscribe((observable) =>{
       this.myEvents = observable;
       console.log(observable)
    });

  }

  cangeModalCancelEvent(event: Event){
    this.modalViewCancelEvent= !this.modalViewCancelEvent;
    if(event != null)
      this.eventDetail= event;
  }


  cancelEvent(event){
    this.events.deleteEvent(event);
    this.cangeModalCancelEvent(null);
  }

  changeDateToStringFormat(date: Date){
    return date;
    // return new Date(date).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
  }

  verifyAvalibleDateToCancel(date: Date){
    // console.log(date)
    // return date.valueOf() < Date.now();
  }

}
