import { Routes } from '@angular/router';
import { HomeGroupsComponent } from './components/home-groups/home-groups.component';
import { GroupCalendarComponent } from './components/group-calendar/group-calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeGroupsComponent,
    pathMatch: 'full'
  },
  {
    path: ':grupoId',
    component: GroupCalendarComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
