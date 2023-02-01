import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from "./login/login.component"

const routes: Routes = [
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "home",
      component: EventsComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
