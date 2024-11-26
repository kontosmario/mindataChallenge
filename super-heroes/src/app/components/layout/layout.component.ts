import { Component, OnInit } from '@angular/core';
import { SuperHeroComponent } from '../superhero/superhero.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SuperHeroComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
