import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from "./login/login.component"

const routes: Routes = [
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "events",
      component: EventsComponent
    },
        {
          component: EventsDetailComponent,
          path: "events/:id",
        }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
