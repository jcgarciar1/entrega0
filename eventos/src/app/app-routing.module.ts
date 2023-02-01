import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    component: EventsDetailComponent,
    path: 'events/:id',
  },
  {
    component: CreateEventComponent,
    path: 'create',
  },
  {
    component: RegisterComponent,
    path: 'register',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
