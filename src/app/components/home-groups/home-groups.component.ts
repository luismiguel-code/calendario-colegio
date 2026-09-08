import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CalendarService } from '../../services/calendar.service';
import { GroupInfo } from '../../models/calendar.model';

@Component({
  selector: 'app-home-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="home-container animate-fade-in">
      <!-- Banner de Bienvenida -->
      <div class="hero-welcome">
        <div class="hero-badge">
          <mat-icon>school</mat-icon>
          <span>Calendario Escolar</span>
        </div>
        <h2>Selecciona el Grupo de tu Hijo/a</h2>
        <p>Consulta las tareas, avisos importantes y el color de uniforme diario (Gris o Rojo).</p>
      </div>

      <!-- Rejilla de Grupos -->
      <div class="groups-grid">
        @for (group of availableGroups; track group.id) {
          <div class="group-card" (click)="selectGroup(group.id)">
            <div class="card-header-accent" [ngClass]="group.id === '1b' ? 'accent-1b' : 'accent-other'">
              <span class="group-tag">{{ group.id.toUpperCase() }}</span>
              <mat-icon class="arrow-go">arrow_forward</mat-icon>
            </div>

            <div class="card-body">
              <h3 class="group-title">{{ group.nombre }}</h3>
              <p class="group-grade">{{ group.grado }}</p>

              <div class="info-row">
                <mat-icon class="info-icon">person</mat-icon>
                <span>Maestra: <strong>{{ group.maestra }}</strong></span>
              </div>

              <div class="uniform-summary">
                <div class="summary-title">Horario de Uniforme:</div>
                <div class="uniform-days">
                  <span class="day-chip chip-gris">Lun: Gris</span>
                  <span class="day-chip chip-rojo">Mar: Rojo</span>
                  <span class="day-chip chip-gris">Mié: Gris</span>
                  <span class="day-chip chip-rojo">Jue: Rojo</span>
                  <span class="day-chip chip-gris">Vie: Gris</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button mat-flat-button color="primary" class="enter-btn">
                <mat-icon>calendar_today</mat-icon>
                Entrar al Grupo {{ group.id.toUpperCase() }}
              </button>
            </div>
          </div>
        }
      </div>

      <div class="admin-note">
        <mat-icon>info</mat-icon>
        <span>¿Necesitas agregar otro grupo o salón? Los salones son administrados internamente.</span>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 0 60px 0;
    }
    .hero-welcome {
      text-align: center;
      margin-bottom: 24px;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e0e7ff;
      color: #4338ca;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .hero-welcome h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px 0;
    }
    .hero-welcome p {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
      max-width: 540px;
      margin: 0 auto;
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 24px 0 32px 0;
    }
    .group-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .group-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(79, 70, 229, 0.12);
      border-color: #818cf8;
    }
    .card-header-accent {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
    }
    .accent-1b {
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
    }
    .accent-other {
      background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
    }
    .group-tag {
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: 1px;
    }
    .arrow-go {
      opacity: 0.9;
    }

    .card-body {
      padding: 20px;
      flex: 1;
    }
    .group-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .group-grade {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0 0 16px 0;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #334155;
      margin-bottom: 16px;
    }
    .info-icon {
      color: #4f46e5;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .uniform-summary {
      background: #f8fafc;
      border-radius: 12px;
      padding: 10px 12px;
      border: 1px solid #f1f5f9;
    }
    .summary-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .uniform-days {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .day-chip {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 6px;
    }
    .chip-gris {
      background: #e2e8f0;
      color: #334155;
    }
    .chip-rojo {
      background: #fee2e2;
      color: #b91c1c;
    }

    .card-footer {
      padding: 0 20px 20px 20px;
    }
    .enter-btn {
      width: 100%;
      border-radius: 14px !important;
      font-weight: 700 !important;
      height: 44px !important;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2) !important;
    }

    .admin-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #f1f5f9;
      color: #64748b;
      padding: 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      text-align: center;
    }
    .admin-note mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class HomeGroupsComponent {
  private calendarService = inject(CalendarService);
  private router = inject(Router);

  // Solamente los grupos creados (por ahora 1B y 1A)
  get availableGroups(): GroupInfo[] {
    return this.calendarService.groups().filter(g => g.id === '1b' || g.id === '1a');
  }

  selectGroup(groupId: string): void {
    this.router.navigate(['/', groupId.toLowerCase()]);
  }
}
