import { Component } from '@angular/core';
import { EventListService } from '../event-list.service';
import { Event } from '../tab1/Event';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public myEvents: Event[];

  public eventDetail: Event;

  public modalViewCancelEvent: boolean;

  constructor(private events: EventListService) {
    events.myEvents.subscribe((observable) =>{
      let array= observable;
      // array.sort((a, b) => a.start > b.start)
       this.myEvents = array;
    });

  }

  cangeModalCancelEvent(event: Event){
    this.modalViewCancelEvent= !this.modalViewCancelEvent;
    if(event != null)
      this.eventDetail= event;
  }


  cancelEvent(event){
    //que se puede cancelar 2 horas antes
    this.events.deleteEvent(event);
    this.cangeModalCancelEvent(null);
  }

  changeDateToStringFormat(date: Date){
    return new Date(date).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
  }

  verifyAvalibleDateToCancel(date: Date){
    let dateNow= new Date(Date.now());
    return date.getFullYear() === dateNow.getFullYear() && date.getMonth() === dateNow.getMonth() && date.getDate() >= dateNow.getDate();
  }

}
