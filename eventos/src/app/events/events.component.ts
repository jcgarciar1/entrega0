import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventosService } from '../services/eventos.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {


  eventos: Evento[] = []

  constructor(private eventoService: EventosService) { }

  ngOnInit(): void {
    this.getEvents()
  }

  getEvents(): void {
    this.eventoService.getEvents().subscribe(x => {
      console.log(x)
      this.eventos = x
    })
  }
}
