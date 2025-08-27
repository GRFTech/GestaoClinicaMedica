import { Routes } from '@angular/router';
import {Data} from './pages/data/data';
import {Cidades} from './pages/data/cidades/cidades';

export const routes: Routes = [
  {
    path: "data",
    component: Data,
    children: [
      {
        path: "cidades",
        component: Cidades
      },
      // {
      //   path: "pacientes",
      // },
      // {
      //   path: "especialidades",
      // },
      // {
      //   path: "medicos",
      // },
      // {
      //   path: "exames",
      // },
      // {
      //   path: "consultas",
      // },
      // {
      //   path: "diarias",
      // }
    ]
  }
];
