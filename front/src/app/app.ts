import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './core/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}
