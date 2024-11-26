import { Component, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SuperheroService } from '../../services/super-hero.service';
import { CommonModule } from '@angular/common';
import { SuperHero } from '../../models/super-hero.model';

@Component({
  selector: 'app-add-hero-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './add-hero-dialog.component.html',
  styleUrls: ['./add-hero-dialog.component.scss'],
})
export class AddHeroDialogComponent {
  heroForm: FormGroup;
  action: 'create' | 'edit';
  heroId?: number;

  constructor(
    private dialogRef: MatDialogRef<AddHeroDialogComponent>,
    private superheroService: SuperheroService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'create' | 'edit'; hero?: SuperHero }
  ) {
    this.action = data.action;
    this.heroId = data.hero?.id;

    this.heroForm = this.fb.group({
      name: [
        data.hero?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      alterEgo: [data.hero?.alterEgo || '', Validators.required],
      strength: [
        data.hero?.strength || 100,
        [Validators.required, Validators.min(0)],
      ],
      speed: [
        data.hero?.speed || 100,
        [Validators.required, Validators.min(0)],
      ],
      intelligence: [
        data.hero?.intelligence || 100,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  save(): void {
    if (this.heroForm.valid) {
      const hero = this.heroForm.value;
      if (this.action === 'create') {
        console.log('Creating Hero:', hero);
        this.superheroService.createSuperhero(hero);
      } else if (this.action === 'edit' && this.heroId !== undefined) {
        console.log('Updating Hero:', hero);
        this.superheroService.updateSuperhero(this.heroId, hero);
      }
      this.dialogRef.close(hero);
    } else {
      console.log('Form is invalid');
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
