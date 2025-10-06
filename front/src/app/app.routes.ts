import { Routes } from '@angular/router';
import {Data} from './pages/data/data';
import {Cidades} from './pages/data/cidades/cidades';
import {Home} from './pages/home/home';
import {Consultas} from './pages/data/consultas/consultas';
import {Pacientes} from './pages/data/pacientes/pacientes';
import {Medicos} from './pages/data/medicos/medicos';
import {Exames} from './pages/data/exames/exames';
import {Especialidades} from './pages/data/especialidades/especialidades';
import {Diarias} from './pages/data/diarias/diarias';
import {IMC} from './pages/data/pacientes/imc/imc';
import {ConsultaMedico} from './pages/data/medicos/consulta-medico/consulta-medico';
import {Faturamento} from './pages/data/faturamento/faturamento';

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
    path: "app",
    children: [
      {
        path: "imc",
        component: IMC
      },
      {
        path: "consulta-medico",
        component: ConsultaMedico
      },
      {
        path: "faturamento",
        component: Faturamento
      }
    ]
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
