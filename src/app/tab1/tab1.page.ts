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
import { Horario } from './Horario';

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

  public horarios: Horario[] = []; 

  public horarioSelected: Horario;

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

        if(e.view.type === "timeGridDay"){
          this.modalViewDay= true;
          this.horarioSelected= {
            hour: new Date(e.date).getHours(),
            minute: new Date(e.date).getMinutes()
          }
        }else{
          let turnosByDay= this.findTurnosByDay(e.date);
          this.laodHorarios(turnosByDay);

          e.view.calendar.changeView("timeGridDay", e.date);
          this.calendarOptions.slotDuration= "00:40:00";
          this.calendarOptions.slotMinTime= "15:00:00";
          this.calendarOptions.slotMaxTime= "22:00:00";

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


  verifyHourAvailable(hour: number, minute: number, events: Event[]){
    let status= true;
    events.map(event => {
      if(new Date(event.start).getHours() === hour && new Date(event.start).getMinutes() === minute){
        status= false;
        return;
      }
    })

    return status;
  }

  laodHorarios(events: Event[]){
    this.horarios= [];
    let minute= 0;
    let hour= 15;
    while (hour != 22){
        if(this.verifyHourAvailable(hour, minute, events)){
          let horario: Horario = {
            hour: hour,
            minute: minute
          }
          this.horarios.push(horario);
        }
        if(minute === 0){ 
          minute= 40;
        }else if(minute === 20){
          minute = 0; 
          hour++;
        }else {
          minute = 20;
          hour++;
        }
      
    }
    console.log(this.horarios)
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

  addEvent(email: string){
   console.log(this.horarioSelected);
  }

  findTurnosByDay(date : Date){
    let events: Event[]= [];
    this.eventsDB.map(event => {
     if(new Date(event.start).getDay() == new Date(date).getDay() && event.end.getMonth() == new Date(date).getMonth())
      events.push(event)
    })
    return events;
  }

  ngOnInit(): void {
    // this.events.eventList.subscribe((observable) => {
    //   console.log(observable);
    // });
    this.events.eventList.subscribe((observable) =>{ 
      this.calendarOptions.events= observable;
    });
    console.log(this.horarioSelected)

  } 

}
