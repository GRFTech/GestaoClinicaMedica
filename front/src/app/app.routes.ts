import { Routes } from '@angular/router';
import {Data} from './pages/data/data';
import {Cidades} from './pages/data/cidades/cidades';
import {Home} from './pages/home/home';
import {Consultas} from './pages/data/consultas/consultas';

export const routes: Routes = [
  {
    path: "",
    redirectTo: '/home',
    pathMatch: "full"
  },
  {
    path: "home",
    component: Home
  },
  {
    path: "data",
    component: Data,
    children: [
      {
        path: "cidades",
        component: Cidades
      },
      {
        path: "consultas",
        component: Consultas
      }
    ]
  }
];
