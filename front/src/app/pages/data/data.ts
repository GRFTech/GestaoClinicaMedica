import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from '../../core/components/header/header';

@Component({
  selector: 'app-data',
  imports: [
    RouterOutlet,
    Header
  ],
  templateUrl: './data.html',
  standalone: true,
  styleUrl: './data.scss'
})
export class Data {

}
