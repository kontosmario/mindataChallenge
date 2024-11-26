import { SuperHero } from '../../models/super-hero.model';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SuperheroService } from '../../services/super-hero.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddHeroDialogComponent } from '../add-hero-dialog/add-hero-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SuperheroDetailComponent } from '../super-hero-detail/super-hero-detail.component';

@Component({
  selector: 'app-superhero',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './superhero.component.html',
  styleUrl: './superhero.component.scss',
})
export class SuperHeroComponent implements OnInit {
  superheroes: SuperHero[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalHeroes: number = 0;

  constructor(
    private superheroService: SuperheroService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.superheroService
      .getSuperheroesPaginated(page, this.itemsPerPage)
      .subscribe((heroes) => {
        this.superheroes = heroes;
        this.currentPage = page;
        this.updateTotalHeroes();
      });
  }

  updateTotalHeroes(): void {
    this.superheroService.getSuperheroes().subscribe((heroes) => {
      this.totalHeroes = heroes.length;
    });
  }

  totalPages(): number {
    return Math.ceil(this.totalHeroes / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
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

  deleteHero(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Acción',
        message: '¿Estás seguro de que deseas eliminar este superhéroe?',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.superheroService.deleteSuperhero(id);
        this.loadPage(this.currentPage);
        this.dialog.closeAll();
        console.log('Superhéroe eliminado');
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  editHero(hero: SuperHero): void {
    this.dialog.open(AddHeroDialogComponent, {
      data: { action: 'edit', hero },
    });
  }
}
