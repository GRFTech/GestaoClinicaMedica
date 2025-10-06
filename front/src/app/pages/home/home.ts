import { Component } from '@angular/core';
import {Header} from '../../core/components/header/header';
import {Card} from 'primeng/card';
import {Button, ButtonDirective} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {RouterLink} from '@angular/router';
import {Tag} from 'primeng/tag';
import {Panel} from 'primeng/panel';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Card,
    Button,
    Divider,
    RouterLink,
    Tag,
    Panel,
    ButtonDirective
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.scss'
})
export class Home {

}
