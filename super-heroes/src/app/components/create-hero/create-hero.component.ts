import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddHeroDialogComponent } from '../add-hero-dialog/add-hero-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-hero',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `<button
    mat-raised-button
    color="primary"
    (click)="openAddHeroDialog()"
  >
    New Hero
  </button>`
})
export class CreateHeroComponent {
  constructor(private dialog: MatDialog) {}

  openAddHeroDialog(): void {
    this.dialog.open(AddHeroDialogComponent, {
      width: '400px',
      data: { action: 'create' },
    });
  }
}
