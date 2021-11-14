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
      ui: Date.now(),
      title: 'Corte de pelo',
      start: new Date(),
      end: new Date()
    }
  }

  @Output()
    showError: EventEmitter<String> = new EventEmitter<String>();

  async addEvent(email: string){
    this.event.end= new Date(new Date(this.event.start).setMinutes((new Date(this.event.start).getMinutes() + 40)));
    this.event.start= new Date(this.event.start);
    console.log(this.event)
    let result = this.events.addEvent(this.event, email);
    if(result === null){
      this.event= {
        ui: Date.now(),
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
