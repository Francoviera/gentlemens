import { Component } from '@angular/core';
import { EventListService } from '../event-list.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public myEvents: any = [];

  constructor(private events: EventListService) {
    events.myEvents.subscribe((observable) => this.myEvents = observable);

  }

  deleteEvent(ui){
    this.events.deleteEvent(ui);
  }
}
