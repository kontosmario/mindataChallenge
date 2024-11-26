import { Component } from '@angular/core';
import { SuperHeroSearchComponent } from '../super-hero-search/super-hero-search.component';
import { HeroCounterComponent } from '../hero-counter/hero-counter.component';
import { CreateHeroComponent } from '../create-hero/create-hero.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SuperHeroSearchComponent, HeroCounterComponent, CreateHeroComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor() {}
}
