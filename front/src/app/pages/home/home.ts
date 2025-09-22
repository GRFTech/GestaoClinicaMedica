import { Component } from '@angular/core';
import {Header} from '../../core/components/header/header';

@Component({
  selector: 'app-home',
  imports: [
    Header
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.scss'
})
export class Home {

}
