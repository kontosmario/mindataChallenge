import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
} from '@angular/material/dialog';
import { SuperHero } from '../../models/super-hero.model';
import { AddHeroDialogComponent } from '../add-hero-dialog/add-hero-dialog.component';
import { SuperheroService } from '../../services/super-hero.service';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-superhero-detail',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions],
  templateUrl: './super-hero-detail.component.html',
  styleUrl: './super-hero-detail.component.scss',
})
export class SuperheroDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<SuperheroDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public hero: SuperHero,
    public dialog: MatDialog,
    public superheroService: SuperheroService
  ) {}

  edit(hero: SuperHero): void {
    this.dialog.open(AddHeroDialogComponent, {
      data: { action: 'edit', hero },
    });
    this.dialogRef.close({ action: 'edit', data: this.hero });
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
        this.dialog.closeAll();
      } else {
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
