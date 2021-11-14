import { Component, OnInit } from '@angular/core';
import {Calendar, CalendarContent, CalendarData, CalendarDataProvider, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { EventListService } from '../event-list.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from './Event';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Turnos } from '../Turnos';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  calendarOptions: CalendarOptions; 
  lang: string;

  private collectionTurno: AngularFirestoreCollection<Turnos>;
  
  private turnos: Turnos[];

  public modalViewDay: boolean;


  public eventsDB: Event[];
  public showModal: boolean = false;
  public eventModal: Event;

  public event: Event;


  constructor(private events: EventListService, private afs: AngularFirestore) { 
    this.event= {
      ui: Date.now(),
      title: '',
      start: new Date(),
      end: new Date()
    }
    events.eventList.subscribe((observable) => {
      this.eventsDB = observable
      console.log(observable)
    });
    this.lang= navigator.language;
    this.modalViewDay= false;
    
    this.calendarOptions= {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth', //Ver para que sirve
      events: this.eventsDB,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      // themeSystem: 'Bostrap', // Investigar como cambiar el tema del Calendario
      // timeZone: 'UTC', Se adelante por unas horas
      locale: this.lang,
      dateClick: (e) => {
        console.log(new Date(e.date))
        // this.calendarOptions.initialView= "dayGridWeek";
        if(e.view.type === "timeGridDay"){
          this.modalViewDay= true;
          console.log(this.modalViewDay)
        }else{
          e.view.calendar.changeView("timeGridDay");
        }
        console.log(e.view)
      },
      navLinkDayClick: (e) => {
        console.log("click", e)
      },
      eventClick: (e) =>  {
        let event : Event= {
          ui: e.event._def.extendedProps.ui,
          start: e.event.start,
          end: e.event.end,
          title: e.event.title
        };
        console.log(event);

        console.log(e); //Esto serviria para ir a otro Componente con detalles sobre el evento
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
    // this.events.eventList.subscribe((observable) => {
    //   console.log(observable);
    // });
    this.events.eventList.subscribe((observable) =>{ 
      this.calendarOptions.events= observable;
    });
  } 

}
