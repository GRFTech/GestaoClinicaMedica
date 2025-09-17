import { Routes } from '@angular/router';
import {Data} from './pages/data/data';
import {Cidades} from './pages/data/cidades/cidades';
import {Home} from './pages/home/home';
import {Consultas} from './pages/data/consultas/consultas';
import {Pacientes} from './pages/data/pacientes/pacientes';
import {Medicos} from './pages/data/medicos/medicos';
import {Exames} from './pages/data/exames/exames';
import {Estados} from './pages/data/estados/estados';
import {Especialidades} from './pages/data/especialidades/especialidades';
import {Diarias} from './pages/data/diarias/diarias';

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
      },
      {
        path: "pacientes",
        component: Pacientes
      },
      {
        path: "medicos",
        component: Medicos
      },
      {
        path: "exames",
        component: Exames
      },
      {
        path: "estados",
        component: Estados
      },
      {
        path: "especialidades",
        component: Especialidades
      },
      {
        path: "diarias",
        component: Diarias
      }
    ]
  }
];
