import { Component, OnInit } from '@angular/core';
import {Calendar, CalendarContent, CalendarData, CalendarDataProvider, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { EventListService } from '../event-list.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from './Event';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  calendarOptions: CalendarOptions; 
  lang: string;
  

  public eventsDB: Event[] = [];
  public showModal: boolean = false;
  public eventModal: Event;

  constructor(private events: EventListService) { 
    events.eventList.subscribe((observable) => this.eventsDB = observable);
    // events.myEvents.subscribe((observable) => this.myEvents = observable);
    this.lang= navigator.language;
    events.addEvents(
      [
        {
          ui: 0,
          title: "El Pepaaa",
          start: new Date('2020-10-24T10:00'),
          end: new Date('2020-10-24T16:00')
        },
        {
          ui: 1,
          title: "El Pepe",
          start: new Date('2020-11-10T10:00'),
          end: new Date('2020-11-10T16:00')
        },
        {
          ui: 2,
          title: "El Pepa",
          start: new Date('2020-10-10T10:00'),
          end: new Date('2020-10-10T16:00')
        },
        {
          ui: 3,
          title: "El Pepa",
          start: new Date('2020-10-10T16:30'),
          end: new Date('2020-10-10T17:00')
        }
      ] 
    );
    this.calendarOptions= {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      // initialView: 'dayGridMonth', //Ver para que sirve
      events: this.eventsDB,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      // themeSystem: 'Bostrap', // Investigar como cambiar el tema del Calendario
      // timeZone: 'UTC', Se adelante por unas horas
      locale: this.lang,
      eventClick: (e) =>  {
        console.log(e); //Esto serviria para ir a otro Componente con detalles sobre el evento
        this.showModal= !this.showModal;
        let element = document.querySelector('.body');
        element.classList.toggle("modal-open");
      },      
    }
  }

  showError(value : String){
    alert(value);
  }

  hideModal(){
    this.showModal= false;
    let element = document.querySelector('.body');
    element.classList.toggle("modal-open");
  }

  //Ver como implementar el Hover para ver la description del evento
  viewDetail(item){
    console.log(item);
  }
  // viewDetail(info) {
  //   var tooltip = new Tooltip(info.el, {
  //     title: info.event.extendedProps.description,
  //     placement: 'top',
  //     trigger: 'hover',
  //     container: 'body'
  //   });
  // }

  ngOnInit(): void {
    console.log(this.lang);
  } 

}
