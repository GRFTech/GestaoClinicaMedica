import { Component } from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    Button
  ],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.scss'
})
export class Header {

}
