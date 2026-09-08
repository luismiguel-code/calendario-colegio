import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';
import { UNIFORM_DETAILS, UniformType } from '../../models/calendar.model';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-uniform-banner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <div class="uniform-card animate-fade-in" [ngClass]="currentUniformDetails().cardClass">
      <div class="card-glow"></div>
      <div class="card-content">
        <div class="top-row">
          <div class="badge-tag">
            <mat-icon>{{ currentUniformDetails().icono }}</mat-icon>
            <span>UNIFORME PARA HOY / FECHA SELECCIONADA</span>
          </div>

          <button mat-icon-button (click)="handleEditUniformClick($event)" class="edit-uniform-btn" matTooltip="Cambiar uniforme de esta fecha (Solo Administrador)">
            <mat-icon>{{ authService.isAdmin() ? 'edit_calendar' : 'lock' }}</mat-icon>
          </button>

          <mat-menu #uniformMenu="matMenu" xPosition="before">
            <div class="menu-header">Cambiar uniforme para esta fecha:</div>
            <button mat-menu-item (click)="changeUniform('gris')">
              <mat-icon class="icon-gris">checkroom</mat-icon>
              <span>Cambiar a Uniforme Gris (Diario)</span>
            </button>
            <button mat-menu-item (click)="changeUniform('rojo')">
              <mat-icon class="icon-rojo">fitness_center</mat-icon>
              <span>Cambiar a Uniforme Rojo (Deporte)</span>
            </button>
            <button mat-menu-item (click)="changeUniform('especial')">
              <mat-icon class="icon-especial">star</mat-icon>
              <span>Cambiar a Vestuario Especial</span>
            </button>
            <button mat-menu-item (click)="changeUniform('libre')">
              <mat-icon class="icon-libre">sentiment_very_satisfied</mat-icon>
              <span>Cambiar a Ropa Libre / Sin Clase</span>
            </button>
            @if (calendarService.selectedDateUniform().esOverride) {
              <hr class="menu-divider" />
              <button mat-menu-item (click)="resetUniform()">
                <mat-icon color="warn">restart_alt</mat-icon>
                <span>Restablecer según Calendario de Ciclos</span>
              </button>
            }
          </mat-menu>
        </div>

        <div class="main-info">
          <div class="icon-circle">
            <mat-icon class="uniform-main-icon">{{ currentUniformDetails().icono }}</mat-icon>
          </div>
          <div class="text-wrapper">
            <h2 class="uniform-title">{{ currentUniformDetails().nombre }}</h2>
            <p class="uniform-desc">{{ currentUniformDetails().descripcion }}</p>

            @if (calendarService.selectedDateUniform().motivo) {
              <div class="cycle-pill">
                <mat-icon>event_repeat</mat-icon>
                <span>{{ calendarService.selectedDateUniform().motivo }}</span>
              </div>
            }

            @if (calendarService.selectedDateUniform().esOverride) {
              <div class="override-pill">
                <mat-icon>notifications_active</mat-icon>
                <span>Cambio manual aplicado por Admin</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .uniform-card {
      position: relative;
      border-radius: 20px;
      padding: 24px;
      margin: 16px 0 24px 0;
      color: #ffffff;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    .card-glow {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 250px;
      height: 250px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 50%;
      pointer-events: none;
    }
    /* Variants */
    .bg-gris {
      background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .bg-rojo {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .bg-especial {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    }
    .bg-libre {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    }

    .top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .badge-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(8px);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge-tag mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .edit-uniform-btn {
      color: white !important;
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 12px !important;
    }
    .main-info {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }
    .icon-circle {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .uniform-main-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }
    .text-wrapper {
      flex: 1;
    }
    .uniform-title {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0 0 6px 0;
      line-height: 1.2;
    }
    .uniform-desc {
      font-size: 0.95rem;
      margin: 0;
      opacity: 0.92;
      line-height: 1.4;
    }
    .cycle-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.22);
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      margin-top: 10px;
      backdrop-filter: blur(4px);
    }
    .cycle-pill mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .override-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f59e0b;
      color: #78350f;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      margin-top: 10px;
      margin-left: 6px;
    }
    .override-pill mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .menu-header {
      padding: 8px 16px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
    }
    .menu-divider {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 4px 0;
    }
    .icon-gris { color: #475569; }
    .icon-rojo { color: #dc2626; }
    .icon-especial { color: #0284c7; }
    .icon-libre { color: #16a34a; }

    @media (max-width: 600px) {
      .uniform-card {
        padding: 18px;
        margin: 12px 0 18px 0;
      }
      .main-info {
        gap: 14px;
      }
      .icon-circle {
        width: 52px;
        height: 52px;
      }
      .uniform-main-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      .uniform-title {
        font-size: 1.35rem;
      }
      .uniform-desc {
        font-size: 0.85rem;
      }
    }
  `]
})
export class UniformBannerComponent {
  calendarService = inject(CalendarService);
  authService = inject(AuthService);
  private dialog = inject(MatDialog);

  currentUniformDetails = computed(() => {
    const info = this.calendarService.selectedDateUniform();
    const details = UNIFORM_DETAILS[info.tipo] || UNIFORM_DETAILS['gris'];
    return {
      ...details,
      cardClass: `bg-${info.tipo}`
    };
  });

  handleEditUniformClick(event: MouseEvent): void {
    if (!this.authService.isAdmin()) {
      event.stopPropagation();
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '90%',
        maxWidth: '420px'
      });
    }
  }

  changeUniform(tipo: UniformType): void {
    if (!this.authService.isAdmin()) {
      this.promptLogin();
      return;
    }
    const group = this.calendarService.activeGroup();
    const dateStr = this.calendarService.selectedDate();
    this.calendarService.setUniformOverride(group.id, dateStr, tipo, 'Cambio manual por Administrador');
  }

  resetUniform(): void {
    if (!this.authService.isAdmin()) {
      this.promptLogin();
      return;
    }
    const group = this.calendarService.activeGroup();
    const dateStr = this.calendarService.selectedDate();
    this.calendarService.removeUniformOverride(group.id, dateStr);
  }

  private promptLogin(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '90%',
      maxWidth: '420px'
    });
  }
}
