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
    events.myEvents.subscribe((observable) => this.myEvents = observable);

  }

  cangeModalCancelEvent(event: Event){
    this.modalViewCancelEvent= !this.modalViewCancelEvent;
    this.eventDetail= event;
  }


  cancelEvent(event: Event){
    // this.events.deleteEvent(event, "flecha@gmail.com");
    // this.cangeModalCancelEvent();
  }

}
