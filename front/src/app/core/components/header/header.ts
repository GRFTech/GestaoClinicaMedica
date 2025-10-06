import {Component, OnInit} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {Toolbar} from 'primeng/toolbar';
import {RouterLink} from '@angular/router';
import {ThemeService} from '../../services/theme-service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    ButtonDirective,
    Menubar,
    Button,
    Toolbar,
    RouterLink
  ],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  constructor(protected themeService: ThemeService) {
  }

  title = "Sistema Clínica Médica";

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Página Inicial',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'Dados',
        icon: 'pi pi-table',
        items: [
          {
            label: 'Cidades',
            icon: 'pi pi-building',
            routerLink: '/data/cidades'
          },
          {
            label: 'Consultas',
            icon: 'pi pi-calendar',
            routerLink: '/data/consultas'
          },
          {
            label: 'Pacientes',
            icon: 'pi pi-user',
            routerLink: '/data/pacientes'
          },
          {
            label: 'Médicos',
            icon: 'pi pi-wave-pulse',
            routerLink: '/data/medicos'
          },
          {
            label: 'Exames',
            icon: 'pi pi-file',
            routerLink: '/data/exames'
          },
          {
            label: 'Estados',
            icon: 'pi pi-map',
            routerLink: '/data/estados'
          },
          {
            label: 'Especialidades',
            icon: 'pi pi-heart',
            routerLink: '/data/especialidades'
          },
          {
            label: 'Diárias',
            icon: 'pi pi-money-bill',
            routerLink: '/data/diarias'
          }
        ]
      },
      {
        label: 'Sobre',
        icon: 'pi pi-info-circle',
        command: () => {
          window.open('https://github.com/GRFTech/GestaoClinicaMedica', '_blank');
        }
      }
    ]
  }
}
