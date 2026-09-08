import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';
import { UniformBannerComponent } from '../uniform-banner/uniform-banner.component';
import { ImportantNotesComponent } from '../important-notes/important-notes.component';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ActivityCategory } from '../../models/calendar.model';

interface MonthDayCell {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  uniformTipo: string;
  activitiesCount: number;
}

@Component({
  selector: 'app-group-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    UniformBannerComponent,
    ImportantNotesComponent
  ],
  template: `
    <div class="group-calendar-container animate-fade-in">

      <!-- Days Quick Selector Bar -->
      <div class="quick-dates-bar">
        <button mat-stroked-button [class.active-quick]="isTodaySelected" (click)="selectToday()">
          <mat-icon>today</mat-icon>
          Hoy
        </button>
        <button mat-stroked-button [class.active-quick]="isTomorrowSelected" (click)="selectTomorrow()">
          Mañana
        </button>
        
        <div class="date-picker-wrapper">
          <input class="hidden-input" [matDatepicker]="picker" (dateChange)="onDatePicked($event.value)" />
          <button mat-flat-button color="primary" class="picker-btn" (click)="picker.open()">
            <mat-icon>calendar_month</mat-icon>
            <span>{{ formattedSelectedDateLabel }}</span>
          </button>
          <mat-datepicker #picker></mat-datepicker>
        </div>
      </div>

      <!-- Hero Banner: Uniforme del Día (Gris vs Rojo) -->
      <app-uniform-banner></app-uniform-banner>

      <!-- Panel Desplegable: Puntos Importantes a Tener en Cuenta -->
      <app-important-notes></app-important-notes>

      <!-- Main Tabs: Agenda Diaria / Calendario Mensual -->
      <mat-tab-group animationDuration="200ms" class="custom-tabs" (selectedIndexChange)="activeTabIndex.set($event)">
        
        <!-- Tab 1: Agenda Diaria -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">view_day</mat-icon>
            <span>Actividades del Día ({{ calendarService.activeGroupActivitiesForSelectedDate().length }})</span>
          </ng-template>

          <div class="tab-content">
            <div class="agenda-header">
              <h3>
                {{ formattedFullDate }}
              </h3>
              <button mat-button color="primary" (click)="openAddModal()">
                <mat-icon>add_circle</mat-icon>
                <span>Nueva actividad</span>
              </button>
            </div>

            <!-- List of Activities -->
            @if (calendarService.activeGroupActivitiesForSelectedDate().length > 0) {
              <div class="activity-cards-list">
                @for (act of calendarService.activeGroupActivitiesForSelectedDate(); track act.id) {
                  <div class="activity-card" [ngClass]="'category-border-' + act.categoria">
                    <div class="card-left">
                      <div class="category-icon-wrapper" [ngClass]="'cat-bg-' + act.categoria">
                        <mat-icon>{{ getCategoryIcon(act.categoria) }}</mat-icon>
                      </div>
                    </div>

                    <div class="card-body">
                      <div class="card-top-tags">
                        <span class="category-badge" [ngClass]="'cat-tag-' + act.categoria">
                          {{ getCategoryLabel(act.categoria) }}
                        </span>
                        @if (act.destacado) {
                          <span class="destacado-badge">⭐ Importante</span>
                        }
                      </div>

                      <h4 class="activity-title">{{ act.titulo }}</h4>
                      @if (act.descripcion) {
                        <p class="activity-desc">{{ act.descripcion }}</p>
                      }

                      @if (act.creadoPor) {
                        <div class="card-footer-info">
                          <mat-icon class="author-icon">person_outline</mat-icon>
                          <span>Registrado por: <strong>{{ act.creadoPor }}</strong></span>
                        </div>
                      }
                    </div>

                    <div class="card-actions">
                      <button mat-icon-button color="warn" (click)="deleteActivityProtected(act.id)" [matTooltip]="authService.isAdmin() ? 'Eliminar actividad' : 'Eliminar actividad (Requiere clave de Admin)'">
                        <mat-icon>{{ authService.isAdmin() ? 'delete_outline' : 'lock_clock' }}</mat-icon>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state-card">
                <div class="empty-illustration">
                  <mat-icon>task_alt</mat-icon>
                </div>
                <h4>¡Todo al día para este día!</h4>
                <p>No hay tareas o avisos registrados para el {{ formattedFullDate }}.</p>
                <button mat-flat-button color="primary" (click)="openAddModal()">
                  <mat-icon>add</mat-icon>
                  Agregar aviso o tarea
                </button>
              </div>
            }
          </div>
        </mat-tab>

        <!-- Tab 2: Vista Calendario Mensual -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">calendar_view_month</mat-icon>
            <span>Vista Mensual</span>
          </ng-template>

          <div class="tab-content">
            <div class="month-navigation">
              <button mat-icon-button (click)="prevMonth()">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <h3>{{ monthYearLabel }}</h3>
              <button mat-icon-button (click)="nextMonth()">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>

            <!-- Leyenda de colores -->
            <div class="legend-bar">
              <span class="legend-item"><span class="dot dot-gris"></span> Uniforme Gris</span>
              <span class="legend-item"><span class="dot dot-rojo"></span> Uniforme Rojo</span>
              <span class="legend-item"><span class="dot dot-especial"></span> Especial</span>
              <span class="legend-item"><span class="dot dot-libre"></span> Ropa Libre</span>
            </div>

            <!-- Grid del Mes -->
            <div class="calendar-grid">
              <div class="grid-weekday">Dom</div>
              <div class="grid-weekday">Lun</div>
              <div class="grid-weekday">Mar</div>
              <div class="grid-weekday">Mié</div>
              <div class="grid-weekday">Jue</div>
              <div class="grid-weekday">Vie</div>
              <div class="grid-weekday">Sáb</div>

              @for (cell of monthGridCells(); track cell.dateStr) {
                <div 
                  class="grid-cell"
                  [class.other-month]="!cell.isCurrentMonth"
                  [class.is-today]="cell.isToday"
                  [class.is-selected]="cell.isSelected"
                  (click)="selectGridCell(cell)"
                >
                  <span class="cell-day-num">{{ cell.dayNumber }}</span>

                  @if (cell.isCurrentMonth) {
                    <div class="cell-uniform-indicator" [ngClass]="'dot-' + cell.uniformTipo" [matTooltip]="'Uniforme: ' + cell.uniformTipo"></div>

                    @if (cell.activitiesCount > 0) {
                      <div class="cell-activity-count">
                        {{ cell.activitiesCount }} {{ cell.activitiesCount === 1 ? 'tarea' : 'tareas' }}
                      </div>
                    }
                  }
                </div>
              }
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .group-calendar-container {
      max-width: 900px;
      margin: 0 auto;
      padding-top: 12px;
    }
    .quick-dates-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .active-quick {
      background-color: #e0e7ff !important;
      border-color: #6366f1 !important;
      color: #4338ca !important;
      font-weight: 700 !important;
    }
    .date-picker-wrapper {
      position: relative;
    }
    .hidden-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .picker-btn {
      border-radius: 20px !important;
      font-weight: 600 !important;
    }

    .custom-tabs {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .tab-icon {
      margin-right: 6px;
    }
    .tab-content {
      padding: 20px;
    }
    .agenda-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .agenda-header h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      text-transform: capitalize;
    }

    /* Cards de Actividad */
    .activity-cards-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .activity-card {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .activity-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    }
    .category-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    .cat-bg-tarea { background: #3b82f6; }
    .cat-bg-examen { background: #ef4444; }
    .cat-bg-materiales { background: #8b5cf6; }
    .cat-bg-evento { background: #ec4899; }
    .cat-bg-aviso { background: #f59e0b; }

    .card-body {
      flex: 1;
    }
    .card-top-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .category-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      text-transform: uppercase;
    }
    .cat-tag-tarea { background: #dbeafe; color: #1e40af; }
    .cat-tag-examen { background: #fee2e2; color: #991b1b; }
    .cat-tag-materiales { background: #f3e8ff; color: #6b21a8; }
    .cat-tag-evento { background: #fce7f3; color: #9d174d; }
    .cat-tag-aviso { background: #fef3c7; color: #92400e; }

    .destacado-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #b45309;
      background: #fffbeb;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .activity-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }
    .activity-desc {
      font-size: 0.9rem;
      color: #475569;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    .card-footer-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
      color: #64748b;
    }
    .author-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* Estado Vacío */
    .empty-state-card {
      text-align: center;
      padding: 40px 20px;
      background: #f8fafc;
      border-radius: 16px;
      border: 2px dashed #cbd5e1;
    }
    .empty-illustration {
      width: 64px;
      height: 64px;
      background: #e0e7ff;
      color: #4f46e5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px auto;
    }
    .empty-illustration mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .empty-state-card h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 4px 0;
    }
    .empty-state-card p {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0 0 16px 0;
    }

    /* Vista Mensual Grid */
    .month-navigation {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .month-navigation h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      text-transform: capitalize;
    }
    .legend-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 16px;
      font-size: 0.8rem;
      color: #475569;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot-gris { background: #475569; }
    .dot-rojo { background: #dc2626; }
    .dot-especial { background: #0284c7; }
    .dot-libre { background: #16a34a; }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
    }
    .grid-weekday {
      text-align: center;
      font-weight: 700;
      font-size: 0.8rem;
      color: #64748b;
      padding: 8px 0;
    }
    .grid-cell {
      aspect-ratio: 1;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
    }
    .grid-cell:hover {
      border-color: #6366f1;
      background: #faf5ff;
    }
    .other-month {
      opacity: 0.35;
      background: #f8fafc;
    }
    .is-today {
      border: 2px solid #4f46e5 !important;
    }
    .is-selected {
      background: #eff6ff !important;
      box-shadow: inset 0 0 0 2px #3b82f6;
    }
    .cell-day-num {
      font-weight: 700;
      font-size: 0.85rem;
      color: #1e293b;
    }
    .cell-uniform-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: absolute;
      top: 6px;
      right: 6px;
    }
    .cell-activity-count {
      font-size: 0.65rem;
      font-weight: 700;
      background: #e0e7ff;
      color: #3730a3;
      padding: 1px 4px;
      border-radius: 6px;
      text-align: center;
    }

    @media (max-width: 600px) {
      .tab-content {
        padding: 12px;
      }
      .activity-card {
        padding: 12px;
        gap: 12px;
      }
      .grid-cell {
        padding: 4px;
        border-radius: 8px;
      }
      .cell-day-num {
        font-size: 0.75rem;
      }
      .cell-activity-count {
        font-size: 0.55rem;
        padding: 0 2px;
      }
    }
  `]
})
export class GroupCalendarComponent implements OnInit {
  calendarService = inject(CalendarService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  activeTabIndex = signal<number>(0);
  currentViewYear = signal<number>(new Date().getFullYear());
  currentViewMonth = signal<number>(new Date().getMonth());

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const gId = params.get('grupoId');
      if (gId) {
        this.calendarService.setActiveGroup(gId);
      }
    });
  }

  get isTodaySelected(): boolean {
    const todayStr = this.calendarService.formatDateToString(new Date());
    return this.calendarService.selectedDate() === todayStr;
  }

  get isTomorrowSelected(): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.calendarService.selectedDate() === this.calendarService.formatDateToString(tomorrow);
  }

  get formattedSelectedDateLabel(): string {
    const dStr = this.calendarService.selectedDate();
    const dObj = new Date(dStr + 'T12:00:00');
    return dObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  get formattedFullDate(): string {
    const dStr = this.calendarService.selectedDate();
    const dObj = new Date(dStr + 'T12:00:00');
    return dObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  get monthYearLabel(): string {
    const dObj = new Date(this.currentViewYear(), this.currentViewMonth(), 1);
    return dObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  selectToday(): void {
    this.calendarService.setSelectedDate(this.calendarService.formatDateToString(new Date()));
  }

  selectTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.calendarService.setSelectedDate(this.calendarService.formatDateToString(tomorrow));
  }

  onDatePicked(val: Date | null): void {
    if (val) {
      this.calendarService.setSelectedDate(this.calendarService.formatDateToString(val));
    }
  }

  prevMonth(): void {
    let m = this.currentViewMonth() - 1;
    let y = this.currentViewYear();
    if (m < 0) {
      m = 11;
      y--;
    }
    this.currentViewMonth.set(m);
    this.currentViewYear.set(y);
  }

  nextMonth(): void {
    let m = this.currentViewMonth() + 1;
    let y = this.currentViewYear();
    if (m > 11) {
      m = 0;
      y++;
    }
    this.currentViewMonth.set(m);
    this.currentViewYear.set(y);
  }

  selectGridCell(cell: MonthDayCell): void {
    this.calendarService.setSelectedDate(cell.dateStr);
    this.activeTabIndex.set(0); // Switch back to agenda view for that day
  }

  deleteActivityProtected(actId: string): void {
    if (!this.authService.isAdmin()) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '90%',
        maxWidth: '420px'
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.calendarService.deleteActivity(actId);
        }
      });
    } else {
      this.calendarService.deleteActivity(actId);
    }
  }

  openAddModal(): void {
    const group = this.calendarService.activeGroup();
    const dateStr = this.calendarService.selectedDate();

    const dialogRef = this.dialog.open(AddActivityDialogComponent, {
      width: '90%',
      maxWidth: '520px',
      data: {
        groupId: group.id,
        groupName: group.nombre,
        initialDate: dateStr
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.calendarService.addActivity(res);
      }
    });
  }

  getCategoryIcon(cat: ActivityCategory): string {
    switch (cat) {
      case 'tarea': return 'assignment';
      case 'examen': return 'quiz';
      case 'materiales': return 'palette';
      case 'evento': return 'celebration';
      case 'aviso': return 'campaign';
      default: return 'event';
    }
  }

  getCategoryLabel(cat: ActivityCategory): string {
    switch (cat) {
      case 'tarea': return 'Tarea';
      case 'examen': return 'Examen';
      case 'materiales': return 'Materiales';
      case 'evento': return 'Evento';
      case 'aviso': return 'Aviso';
      default: return 'Actividad';
    }
  }

  monthGridCells = computed(() => {
    const year = this.currentViewYear();
    const month = this.currentViewMonth();
    const groupId = this.calendarService.activeGroup().id;
    const selectedDate = this.calendarService.selectedDate();
    const todayStr = this.calendarService.formatDateToString(new Date());

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Dom
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const cells: MonthDayCell[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const pDay = prevMonthLastDay - i;
      const pDate = new Date(year, month - 1, pDay);
      const pStr = this.calendarService.formatDateToString(pDate);
      cells.push({
        dateStr: pStr,
        dayNumber: pDay,
        isCurrentMonth: false,
        isToday: pStr === todayStr,
        isSelected: pStr === selectedDate,
        uniformTipo: 'libre',
        activitiesCount: 0
      });
    }

    // Current month days
    const monthActivities = this.calendarService.getActivitiesForMonth(groupId, year, month);

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dObj = new Date(year, month, day);
      const dStr = this.calendarService.formatDateToString(dObj);
      const uniformInfo = this.calendarService.getUniformForDate(groupId, dStr);
      const count = monthActivities.filter(a => a.fecha === dStr).length;

      cells.push({
        dateStr: dStr,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedDate,
        uniformTipo: uniformInfo.tipo,
        activitiesCount: count
      });
    }

    // Next month padding to complete 35 or 42 cells grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nDate = new Date(year, month + 1, i);
      const nStr = this.calendarService.formatDateToString(nDate);
      cells.push({
        dateStr: nStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: nStr === todayStr,
        isSelected: nStr === selectedDate,
        uniformTipo: 'libre',
        activitiesCount: 0
      });
    }

    return cells;
  });
}
