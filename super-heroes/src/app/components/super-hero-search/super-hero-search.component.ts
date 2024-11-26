import { Component, OnInit } from '@angular/core';
import { SuperHero } from '../../models/super-hero.model';
import { SuperheroService } from '../../services/super-hero.service';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuperheroDetailComponent } from '../super-hero-detail/super-hero-detail.component';

@Component({
  selector: 'app-superhero-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatListModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
  ],
  template: `
    <div class="search-container">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Search heroes</mat-label>
        <input
          matInput
          [formControl]="searchQuery"
          [matAutocomplete]="auto"
          (keydown)="handleKeydown($event)"
        />
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option
            *ngFor="let hero of filteredSuperheroes; let i = index"
            [value]="hero.name"
            [class.highlighted]="i === selectedIndex"
            (click)="selectHero(hero)"
          >
            {{ hero.name }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .search-container {
        max-width: 400px;
        margin: auto;
      }
      .full-width {
        width: 100%;
      }
      .highlighted {
        background-color: #f0f0f0;
      }
    `,
  ],
})
export class SuperHeroSearchComponent implements OnInit {
  superheroes: SuperHero[] = [];
  filteredSuperheroes: SuperHero[] = [];
  searchQuery = new FormControl('');
  selectedIndex: number = -1;

  constructor(
    private superheroService: SuperheroService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.superheroService.getSuperheroes().subscribe((heroes) => {
      this.superheroes = heroes;
    });

    this.searchQuery.valueChanges.subscribe((query) => {
      this.searchHeroes(query || '');
    });
  }

  searchHeroes(query: string): void {
    if (query.trim()) {
      this.superheroService.searchSuperheroes(query).subscribe((heroes) => {
        this.filteredSuperheroes = heroes;
        this.selectedIndex = -1;
      });
    } else {
      this.filteredSuperheroes = [];
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    const key = event.key;

    // Manejo de flechas y Enter
    if (
      key === 'ArrowDown' &&
      this.selectedIndex < this.filteredSuperheroes.length - 1
    ) {
      this.selectedIndex++;
    } else if (key === 'ArrowUp' && this.selectedIndex > 0) {
      this.selectedIndex--;
    } else if (key === 'Enter') {
      const query = this.searchQuery.value?.trim(); // Asegura que no sea null
      if (this.selectedIndex >= 0) {
        // Selecciona el héroe resaltado
        this.selectHero(this.filteredSuperheroes[this.selectedIndex]);
      } else if (query) {
        // Si no hay selección, buscar el primer héroe que coincida
        const matchingHero = this.filteredSuperheroes.find(
          (hero) => hero.name.toLowerCase() === query.toLowerCase()
        );
        if (matchingHero) {
          this.selectHero(matchingHero);
        } else {
          console.log('No matching hero found');
        }
      }
    }
  }

  selectHero(hero: SuperHero): void {
    this.searchQuery.setValue(hero.name);
    this.filteredSuperheroes = [];
    this.openHeroDetailsModal(hero);
  }

  openHeroDetailsModal(hero: SuperHero): void {
    const dialogRef = this.dialog.open(SuperheroDetailComponent, {
      width: '400px',
      data: hero,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit') {
        console.log('Edit:', result.data);
      } else if (result?.action === 'delete') {
        console.log('Delete:', result.data);
      }
    });
  }
}
