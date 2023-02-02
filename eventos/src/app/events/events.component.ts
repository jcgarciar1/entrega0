import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventosService } from '../services/eventos.service';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventos: Evento[] = [];
  controls!: FormArray;
  constructor(private eventoService: EventosService, private authService:AuthService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getControl(index: number, field: string): FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  public logout()
  {
    this.authService.logout()
  //this.router.navigate(['login/'])
  }

  updateField(index: number, field: string) {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.eventos = this.eventos.map((e, i) => {
        if (index === i) {
          return {
            ...e,
            [field]: control.value,
          };
        }
        return e;
      });
    }
    let to_update = this.eventos[index];
    if (field == 'finish_date') {
      const datepipe: DatePipe = new DatePipe('en-US');
      let fecha = new Date(to_update['finish_date']);
      let formattedDate = datepipe.transform(fecha, 'YYYY-MM-dd');
      to_update['finish_date'] = formattedDate!;
    }

    this.eventoService.updateEvent(to_update, to_update['id']);
  }

  getEvents(): void {
    this.eventoService.getEvents().subscribe((x) => {
      this.eventos = x;
      const toGroups = x.map((entity) => {
        const a = new FormControl();
        return new FormGroup({
          name: new FormControl(entity.name, Validators.required),
          category: new FormControl(entity.category),
          place: new FormControl(entity.place),
          address: new FormControl(entity.address),
          start_date: new FormControl(entity.start_date),
          finish_date: new FormControl(entity.finish_date),
        });
      });
      this.controls = new FormArray(toGroups);
    });
  }

  deleteEvent(id: number): void {
    this.eventoService.deleteEvent(id);
    window.location.reload();
  }


}
