import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventosService } from '../services/eventos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  myform!: FormGroup;

  constructor(private eventoService: EventosService,private router: Router) {}

  ngOnInit(): void {
    this.myform = new FormGroup({
      name: new FormControl(''),
      category: new FormControl(''),
      place: new FormControl(''),
      address: new FormControl(''),
      start_date: new FormControl(''),
      finish_date: new FormControl(''),
    });
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.myform.invalid) {
      return;
    }

    let evento = this.myform.getRawValue();
    const datepipe: DatePipe = new DatePipe('en-US');
    let fecha_inicio = new Date(evento['start_date']);
    let fecha_fin = new Date(evento['finish_date']);
    evento['start_date'] = datepipe.transform(fecha_inicio, 'YYYY-MM-dd');
    evento['finish_date'] = datepipe.transform(fecha_fin, 'YYYY-MM-dd');
    this.eventoService.createEvent(evento);
    this.router.navigate(["events"])

  }
}
