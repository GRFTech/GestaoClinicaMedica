import {inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  primeNgConfig = inject(PrimeNG);
  isDarkMode = signal(false);

  constructor() {
    this.primeNgConfig.theme.set({
      preset: Aura,
      options: {
        darkModeSelector: '.dark'
      }
    })
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');
    this.isDarkMode.set(!this.isDarkMode());
  }
}
