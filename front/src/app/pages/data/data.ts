import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-data',
  imports: [
    RouterOutlet
  ],
  templateUrl: './data.html',
  standalone: true,
  styleUrl: './data.scss'
})
export class Data {

}
