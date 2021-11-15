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
import Cookie from "js-cookie";


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

  //Events Lists by DB
  public eventsDB: Event[];
  //Event modal
  public event: Event;
  //Event Detail view
  public eventDetail: Event;


  //Booleans Views
  public modalViewDayNew: boolean;
  public modalViewDayDetail: boolean;

  //Horarios availables of day selected
  public hours: Horario[] = []; 
  //Input Horario of Form new Event
  public horarioSelected: Horario;
  //day selected in calendar
  public daySelected: Date;

  constructor(private events: EventListService, private afs: AngularFirestore) { 
    this.event= {
      ui: Date.now(),
      title: '',
      start: new Date(),
      end: new Date()
    }
    if(Cookie.get("user") != undefined){
      this.event.title= Cookie.get("user");
    }
    events.eventList.subscribe((observable) => {
      this.eventsDB = observable
    });
    this.lang= navigator.language;
    this.modalViewDayNew= false;
    this.modalViewDayDetail= false;
    
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
      dateClick: (e) => {
        if(e.view.type === "timeGridDay"){
          this.modalViewDayNew= true;
          this.daySelected= new Date(e.date);
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
      },
      eventClick: (e) =>  {
        let event : Event= {
          ui: e.event._def.extendedProps.ui,
          start: e.event.start,
          end: e.event.end,
          title: e.event.title
        };
        this.eventDetail= event;
        this.modalViewDayDetail= true;
      },      
    }
  }

  changeDateToStringFormat(date: Date){
    return new Date(date).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
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

  hideModalViewDay(){
    this.modalViewDayNew= false;
  }
  hideModalViewDetail(){
    this.modalViewDayDetail= false;
  }

  laodHorarios(events: Event[]){
    this.hours= [];
    let minute= 0;
    let hour= 15;
    while (hour != 22){
        if(this.verifyHourAvailable(hour, minute, events)){
          let horario: Horario = {
            hour: hour,
            minute: minute
          }
          this.hours.push(horario);
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
  }

  showError(value : String){
    alert(value);
  }

  async addEvent(){
    let start= new Date(this.daySelected);
    start.setMinutes(this.horarioSelected.minute);
    start.setHours(this.horarioSelected.hour);
    this.event.start= start;
    this.event.end= new Date(new Date(start).setMinutes((start.getMinutes() + 40)));
    let result = this.events.addEvent(this.event);
    if(result === null){
      this.event= {
        ui: Date.now(),
        title: '',
        start: new Date(),
        end: new Date()
      }
      this.modalViewDayNew= false;
    }else{
      // this.showError.emit(result);
      this.event.start= new Date();
      this.event.end= new Date();
      alert("Ocurrio un error");
    }
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

  } 

}
