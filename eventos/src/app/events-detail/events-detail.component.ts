import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventosService } from '../services/eventos.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getDetail()
  }
  get f() {
    return this.myform.controls;
  }

  private createForm() {
    console.log(this.evento)
    this.myform = new FormGroup({
      name: new FormControl(''),
      category: new FormControl(''),
      place: new FormControl(''),
      address: new FormControl(''),
      start_date: new FormControl(''),
      finish_date: new FormControl(''),
    });
  }
  getDetail() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.eventService.getEvent(this.id!).subscribe((x) => {
      this.evento = x;
    });
    console.log(this.evento);
    this.createForm()
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myform.invalid) {
      return;
    }

    this.loading = true;
    console.log(this.myform.getRawValue());
  }
}
