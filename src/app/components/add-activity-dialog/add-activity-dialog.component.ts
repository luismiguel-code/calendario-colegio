import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivityCategory } from '../../models/calendar.model';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-add-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">post_add</mat-icon>
        Nueva Actividad para {{ data.groupName }}
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="activity-form">
        <!-- Título -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título de la actividad / aviso</mat-label>
          <input matInput formControlName="titulo" placeholder="ej. Traer cartulina blanca y tijeras" required />
          <mat-icon matSuffix>edit</mat-icon>
          @if (form.get('titulo')?.hasError('required')) {
            <mat-error>El título es obligatorio</mat-error>
          }
        </mat-form-field>

        <div class="two-columns">
          <!-- Categoría -->
          <mat-form-field appearance="outline">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoria">
              <mat-option value="tarea">📝 Tarea</mat-option>
              <mat-option value="examen">🎯 Examen / Evaluación</mat-option>
              <mat-option value="materiales">🎨 Materiales requeridos</mat-option>
              <mat-option value="evento">🎉 Evento / Convivio</mat-option>
              <mat-option value="aviso">📢 Aviso general</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Fecha -->
          <mat-form-field appearance="outline">
            <mat-label>Fecha de entrega / evento</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="fechaObj" required readonly (click)="picker.open()" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <!-- Descripción -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Detalles / Indicaciones adicionales (Opcional)</mat-label>
          <textarea matInput formControlName="descripcion" rows="3" placeholder="ej. Entregar a primera hora en la carpeta verde."></textarea>
        </mat-form-field>

        <!-- Registrado Por -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de quien registra</mat-label>
          <input matInput formControlName="creadoPor" placeholder="ej. Mamá de Sofía / Maestra" />
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">
        <mat-icon>check</mat-icon>
        Guardar Actividad
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px 8px 24px;
    }
    .dialog-title {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      margin: 0 !important;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dialog-content {
      padding: 16px 24px !important;
    }
    .activity-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .full-width {
      width: 100%;
    }
    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .dialog-actions {
      padding: 12px 24px 20px 24px !important;
    }
    @media (max-width: 600px) {
      .two-columns {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }
  `]
})
export class AddActivityDialogComponent {
  private dialogRef = inject(MatDialogRef<AddActivityDialogComponent>);
  private calendarService = inject(CalendarService);
  private fb = inject(FormBuilder);
  data = inject<{ groupId: string; groupName: string; initialDate?: string }>(MAT_DIALOG_DATA);

  form = this.fb.group({
    titulo: ['', Validators.required],
    categoria: ['tarea' as ActivityCategory, Validators.required],
    fechaObj: [this.data.initialDate ? new Date(this.data.initialDate + 'T12:00:00') : new Date(), Validators.required],
    descripcion: [''],
    creadoPor: ['Padre / Tutor 1B']
  });

  save(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    const dateObj: Date = val.fechaObj || new Date();
    const dateStr = this.calendarService.formatDateToString(dateObj);

    this.dialogRef.close({
      grupoId: this.data.groupId,
      titulo: val.titulo!,
      categoria: val.categoria!,
      fecha: dateStr,
      descripcion: val.descripcion || '',
      creadoPor: val.creadoPor || 'Padre de familia'
    });
  }
}
