import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventosService } from '../services/eventos.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.css'],
})
export class EventsDetailComponent implements OnInit {
  evento!: Evento;
  id!: string | null;
  myform!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  constructor(
    private eventService: EventosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDetail();
    this.myform = new FormGroup({
      name: new FormControl(''),
      category: new FormControl(''),
      place: new FormControl(''),
      address: new FormControl(''),
      type: new FormControl(''),
      start_date: new FormControl(''),
      finish_date: new FormControl(''),
    });
  }
  get f() {
    return this.myform.controls;
  }

  public async getDetail() {
    this.id = this.route.snapshot.paramMap.get('id');
    const data = await new Promise<Evento>((resolve) => {
      this.eventService.getEvent(this.id!).subscribe(resolve);
    });

    this.evento = data;
    this.myform = new FormGroup({
      name: new FormControl(this.evento.name),
      category: new FormControl(this.evento.category),
      place: new FormControl(this.evento.place),
      address: new FormControl(this.evento.address),
      type: new FormControl(this.evento.type),
      start_date: new FormControl(this.evento.start_date),
      finish_date: new FormControl(this.evento.finish_date),
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myform.invalid) {
      return;
    }

    this.loading = true;
    let evento_u = this.myform.getRawValue();
    console.log(evento_u);
    const datepipe: DatePipe = new DatePipe('en-US');
    let fecha_inicio = new Date(evento_u['start_date']);
    let fecha_fin = new Date(evento_u['finish_date']);
    evento_u['start_date'] = datepipe.transform(fecha_inicio, 'YYYY-MM-dd');
    evento_u['finish_date'] = datepipe.transform(fecha_fin, 'YYYY-MM-dd');
    this.eventService.updateEvent(evento_u, this.evento.id);
    this.router.navigate(['events']);
  }
}
