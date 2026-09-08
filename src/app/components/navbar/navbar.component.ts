import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <header class="navbar-header">
      <div class="navbar-container">
        <!-- Logo & Title -->
        <div class="brand" (click)="onLogoClick()" matTooltip="Volver a la selección de grupos">
          <div class="brand-icon">
            <mat-icon>calendar_today</mat-icon>
          </div>
          <div class="brand-text">
            <h1>Colegio <span>Calendario</span></h1>
            <p class="subtitle">Grupo {{ calendarService.activeGroup().id.toUpperCase() }}</p>
          </div>
        </div>

        <!-- Group Selector & Actions -->
        <div class="actions">
          <!-- Botón o Badge de Admin -->
          @if (authService.isAdmin()) {
            <button mat-stroked-button color="accent" class="admin-badge-btn" [matMenuTriggerFor]="adminMenu">
              <mat-icon color="accent">verified_user</mat-icon>
              <span>Admin</span>
            </button>
            <mat-menu #adminMenu="matMenu" xPosition="before">
              <div class="menu-header">Sesión de Administrador Activa</div>
              <button mat-menu-item (click)="authService.logout()">
                <mat-icon color="warn">logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          } @else {
            <button mat-icon-button class="admin-lock-btn" (click)="openLoginModal()" matTooltip="Iniciar sesión como Administrador">
              <mat-icon class="lock-icon">lock</mat-icon>
            </button>
          }

          <div class="group-selector">
            <button mat-stroked-button [matMenuTriggerFor]="groupMenu" class="group-btn">
              <mat-icon class="group-icon">groups</mat-icon>
              <span>{{ calendarService.activeGroup().nombre }}</span>
              <mat-icon class="arrow-icon">arrow_drop_down</mat-icon>
            </button>

            <mat-menu #groupMenu="matMenu" xPosition="before" class="custom-group-menu">
              @for (group of availableGroups; track group.id) {
                <button mat-menu-item (click)="switchGroup(group.id)" [class.active-item]="group.id === calendarService.activeGroupId()">
                  <mat-icon [color]="group.id === calendarService.activeGroupId() ? 'primary' : ''">school</mat-icon>
                  <span class="group-item-name">{{ group.nombre }}</span>
                  <span class="group-item-sub">({{ group.maestra }})</span>
                </button>
              }
              <hr class="menu-divider" />
              <button mat-menu-item (click)="onLogoClick()">
                <mat-icon color="primary">apps</mat-icon>
                <span>Ver todos los grupos</span>
              </button>
            </mat-menu>
          </div>

          <button mat-flat-button color="primary" class="add-btn" (click)="openAddModal.emit()">
            <mat-icon>add</mat-icon>
            <span class="btn-text">Agregar Actividad</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .navbar-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    .brand-icon {
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      color: white;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
    }
    .brand-text h1 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      margin: 0;
    }
    .brand-text h1 span {
      color: #4f46e5;
    }
    .brand-text .subtitle {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .admin-lock-btn {
      color: #64748b !important;
    }
    .admin-badge-btn {
      border-radius: 20px !important;
      font-weight: 700 !important;
      padding: 0 12px !important;
      height: 38px !important;
      border-color: #ec4899 !important;
      color: #be185d !important;
      background: #fdf2f8 !important;
    }
    .group-btn {
      border-radius: 20px !important;
      border-color: #cbd5e1 !important;
      font-weight: 600 !important;
      padding: 0 14px !important;
      height: 40px !important;
    }
    .group-icon {
      color: #4f46e5;
      margin-right: 4px;
    }
    .add-btn {
      border-radius: 20px !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
      height: 40px !important;
      padding: 0 16px !important;
    }
    .group-item-name {
      font-weight: 600;
      margin-right: 8px;
    }
    .group-item-sub {
      font-size: 0.8rem;
      color: #64748b;
    }
    .active-item {
      background-color: #eff6ff;
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
    @media (max-width: 600px) {
      .navbar-container {
        padding: 8px 12px;
      }
      .brand-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }
      .brand-icon mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      .brand-text h1 {
        font-size: 0.98rem;
      }
      .brand-text .subtitle {
        font-size: 0.68rem;
      }
      .group-btn {
        height: 36px !important;
        padding: 0 10px !important;
        font-size: 0.78rem !important;
      }
      .btn-text {
        display: none;
      }
      .add-btn {
        min-width: 36px !important;
        padding: 0 !important;
        border-radius: 50% !important;
        width: 36px !important;
        height: 36px !important;
      }
      .add-btn mat-icon {
        margin: 0 !important;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class NavbarComponent {
  calendarService = inject(CalendarService);
  authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @Output() openAddModal = new EventEmitter<void>();

  get availableGroups() {
    return this.calendarService.groups().filter(g => g.id === '1b' || g.id === '1a');
  }

  openLoginModal(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '90%',
      maxWidth: '420px'
    });
  }

  switchGroup(groupId: string): void {
    this.router.navigate(['/', groupId.toLowerCase()]);
  }

  onLogoClick(): void {
    this.router.navigate(['/']);
  }
}
