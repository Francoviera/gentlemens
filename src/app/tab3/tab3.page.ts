import { Component } from '@angular/core';

import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventListService } from '../event-list.service';
import { Event } from '../tab1/Event';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public event: Event;

  constructor(private events: EventListService) { 
    this.event= {
      ui: this.events.getUi(),
      title: '',
      start: new Date(),
      end: new Date()
    }
  }

  @Output()
    showError: EventEmitter<String> = new EventEmitter<String>();

  async addEvent(){
    this.event.end= new Date(new Date(this.event.end).setMinutes(new Date(this.event.start).getMinutes() + 45));
    this.event.start= new Date(this.event.start);

    let result = this.events.addEvent(this.event);
    if(result === null){
      this.event= {
        ui: this.events.getUi(),
        title: '',
        start: new Date(),
        end: new Date()
      }
    }else{
      this.showError.emit(result);
      this.event.start= new Date();
      this.event.end= new Date();
    }
  }

  ngOnInit(): void {
  }
}
