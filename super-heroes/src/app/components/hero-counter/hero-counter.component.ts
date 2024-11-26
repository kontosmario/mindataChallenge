import { Component, OnInit } from '@angular/core';
import { SuperheroService } from '../../services/super-hero.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-counter">
      <span class="icon">🦸</span>
      <span class="count">{{ totalHeroes }}</span>
    </div>
  `,
  styleUrls: ['./hero-counter.component.scss'],
})
export class HeroCounterComponent implements OnInit {
  totalHeroes: number = 0;

  constructor(private superheroService: SuperheroService) {}

  ngOnInit(): void {
    this.superheroService.getSuperheroes().subscribe((heroes) => {
      this.totalHeroes = heroes.length;
    });
  }
}
