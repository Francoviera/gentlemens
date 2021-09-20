import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventListService } from '../event-list.service';
import { Event } from '../tab1/Event';

import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule implements OnInit {

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
    this.event.end= new Date(this.event.start.getTime()+ 45000);
    let result = await this.events.addEvent(this.event);
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
