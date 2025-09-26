import { Routes } from '@angular/router';
import { ComputerComponent } from './pages/computer/computer.component';
import { PlayerComponent } from './pages/player/player.component';
import { HomeComponent } from './pages/home/home.component';
import { canActivateGuard } from './guard/can-activate.guard';

export const routes: Routes = [
  {
    path:'',
    title: 'Home',
    component: HomeComponent
  },
  {
    path:'computer',
    title: 'Computer',
    component: ComputerComponent
  },
  {
    path:'player/:roomName',
    title: 'Player',
    component: PlayerComponent,
    canActivate: [canActivateGuard]
  },
    {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
