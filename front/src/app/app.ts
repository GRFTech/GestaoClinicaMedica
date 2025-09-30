import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from './core/services/theme-service';
import {PRIME_NG_CONFIG, PrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front');
}
