import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CalendarService } from '../../services/calendar.service';
import { BIRTHDAYS_1B, BirthdayInfo, MONTH_NAMES_ES } from '../../data/birthdays-1b.data';

@Component({
  selector: 'app-monthly-birthdays',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    @if (isGroup1B()) {
      <div class="monthly-birthdays-wrapper">
        <mat-accordion class="custom-accordion">
          <mat-expansion-panel [expanded]="false" class="panel-card">
            <mat-expansion-panel-header class="panel-header">
              <mat-panel-title class="panel-title">
                <mat-icon class="header-icon">cake</mat-icon>
                <span class="panel-title-text">CUMPLES DEL MES ({{ currentMonthName().toUpperCase() }})</span>
                <span class="count-chip">{{ monthBirthdays().length }}</span>
              </mat-panel-title>
              <mat-panel-description class="panel-desc">
                <span class="click-hint">Click para ver cumpleaños del mes</span>
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="birthdays-panel-body">
              <div class="birthdays-sub-header">
                <div>
                  <p class="subtitle">Celebraciones del salón 1B para este mes. Toca un cumpleaños para ir a ese día en la agenda.</p>
                </div>

                <button mat-stroked-button class="view-all-btn" (click)="showAllMonths.set(!showAllMonths())">
                  <mat-icon>{{ showAllMonths() ? 'expand_less' : 'calendar_month' }}</mat-icon>
                  <span>{{ showAllMonths() ? 'Ver solo mes actual' : 'Ver año completo' }}</span>
                </button>
              </div>

              <!-- Muestra de Cumpleaños del Mes Actual -->
              @if (!showAllMonths()) {
                @if (monthBirthdays().length > 0) {
                  <div class="birthdays-grid">
                    @for (bday of monthBirthdays(); track bday.id) {
                      <div 
                        class="bday-item-card" 
                        [class.is-today-bday]="isTodayBirthday(bday)"
                        (click)="selectBirthdayDate(bday)"
                      >
                        <div class="bday-day-badge">
                          <span class="day-num">{{ bday.day.toString().padStart(2, '0') }}</span>
                          <span class="day-month">{{ currentMonthName().substring(0, 3) }}</span>
                        </div>

                        <div class="bday-info">
                          <div class="bday-name">
                            {{ bday.name }}
                            @if (bday.role === 'teacher') {
                              <span class="teacher-tag">🎓 Docente</span>
                            }
                          </div>

                          @if (isTodayBirthday(bday)) {
                            <span class="today-bday-tag">🎉 ¡HOY ES SU CUMPLEAÑOS! 🥳</span>
                          } @else {
                            <span class="click-hint-item">Toca para ir al {{ bday.day }} de {{ currentMonthName() }}</span>
                          }
                        </div>

                        <mat-icon class="arrow-icon">arrow_forward_ios</mat-icon>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="no-birthdays-box">
                    <mat-icon class="empty-icon">sentiment_satisfied</mat-icon>
                    <span>No hay cumpleaños registrados en el mes de {{ currentMonthName() }}.</span>
                  </div>
                }
              } @else {
                <!-- Muestra del Año Completo (Todos los meses) -->
                <div class="all-months-grid">
                  @for (monthIdx of [1,2,3,4,5,6,7,8,9,10,11,12]; track monthIdx) {
                    <div class="month-box" [class.active-month-box]="monthIdx === currentMonthNum()">
                      <div class="month-box-header">
                        <span>{{ MONTH_NAMES_ES[monthIdx - 1] }}</span>
                        <span class="month-count-badge">{{ getBirthdaysForMonth(monthIdx).length }}</span>
                      </div>

                      <div class="month-box-list">
                        @for (bday of getBirthdaysForMonth(monthIdx); track bday.id) {
                          <div class="month-bday-row" (click)="selectBirthdayDate(bday)">
                            <span class="bday-day-chip">{{ bday.day.toString().padStart(2, '0') }}</span>
                            <span class="bday-person-name">{{ bday.name }}</span>
                          </div>
                        }
                        @if (getBirthdaysForMonth(monthIdx).length === 0) {
                          <span class="empty-month-text">Sin cumpleaños</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </div>
    }
  `,
  styles: [`
    .monthly-birthdays-wrapper {
      margin: 16px 0;
    }
    .custom-accordion {
      border-radius: 16px !important;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.05) !important;
    }
    .panel-card {
      border: 1px solid #fbcfe8;
      border-radius: 16px !important;
      background: #ffffff;
    }
    .panel-header {
      padding: 0 16px !important;
      background: #fdf2f8;
      border-bottom: 1px solid #fbcfe8;
      height: 48px !important;
      min-height: 48px !important;
    }
    .panel-title {
      font-size: 0.88rem !important;
      font-weight: 800 !important;
      color: #831843;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      margin: 0 !important;
      white-space: nowrap !important;
      flex: 1 1 auto !important;
      min-width: 0 !important;
    }
    .panel-title-text {
      white-space: nowrap !important;
      font-weight: 800 !important;
    }
    .header-icon {
      color: #ec4899;
      font-size: 24px !important;
      width: 24px !important;
      height: 24px !important;
      line-height: 1 !important;
      flex-shrink: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: visible !important;
    }
    .count-chip {
      font-size: 0.68rem;
      font-weight: 800;
      background: #fce7f3;
      color: #be185d;
      padding: 1px 7px;
      border-radius: 6px;
      margin-left: 2px;
      flex-shrink: 0;
    }
    .panel-desc {
      justify-content: flex-end;
      align-items: center;
      flex: 0 0 auto !important;
      margin-left: auto !important;
    }
    .click-hint {
      font-size: 0.78rem;
      color: #9d174d;
      font-weight: 500;
    }

    .birthdays-panel-body {
      padding: 16px 4px 8px 4px;
    }
    .birthdays-sub-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .subtitle {
      font-size: 0.78rem;
      color: #9d174d;
      margin: 0;
    }
    .view-all-btn {
      border-radius: 10px !important;
      font-size: 0.75rem !important;
      font-weight: 700 !important;
      color: #be185d !important;
      border-color: #fbcfe8 !important;
    }

    .birthdays-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 10px;
    }
    .bday-item-card {
      background: #ffffff;
      border: 1px solid #fbcfe8;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .bday-item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(236, 72, 153, 0.12);
    }
    .is-today-bday {
      background: #fdf2f8 !important;
      border: 2px solid #ec4899 !important;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2) !important;
    }
    .bday-day-badge {
      width: 42px;
      height: 42px;
      background: #fce7f3;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #be185d;
      flex-shrink: 0;
    }
    .day-num {
      font-size: 0.95rem;
      font-weight: 800;
      line-height: 1;
    }
    .day-month {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1;
      margin-top: 1px;
    }
    .bday-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .bday-name {
      font-size: 0.88rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .teacher-tag {
      font-size: 0.65rem;
      font-weight: 800;
      background: #e0e7ff;
      color: #3730a3;
      padding: 1px 5px;
      border-radius: 4px;
    }
    .click-hint-item {
      font-size: 0.72rem;
      color: #64748b;
    }
    .today-bday-tag {
      font-size: 0.72rem;
      font-weight: 800;
      color: #be185d;
    }
    .arrow-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
      color: #94a3b8;
    }

    .no-birthdays-box {
      background: #ffffff;
      border: 1px dashed #fbcfe8;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #9d174d;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .empty-icon {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
      color: #ec4899;
    }

    /* Full Year Grid */
    .all-months-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    .month-box {
      background: #ffffff;
      border: 1px solid #f3e8ff;
      border-radius: 10px;
      padding: 10px;
    }
    .active-month-box {
      border: 2px solid #ec4899;
      background: #fdf2f8;
    }
    .month-box-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.78rem;
      font-weight: 800;
      color: #831843;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid #fbcfe8;
    }
    .month-count-badge {
      font-size: 0.65rem;
      background: #fce7f3;
      color: #be185d;
      padding: 1px 5px;
      border-radius: 4px;
    }
    .month-box-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .month-bday-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.74rem;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .month-bday-row:hover {
      background: #fce7f3;
    }
    .bday-day-chip {
      font-weight: 800;
      color: #be185d;
      background: #fce7f3;
      padding: 1px 4px;
      border-radius: 4px;
      font-size: 0.68rem;
    }
    .bday-person-name {
      color: #1e293b;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .empty-month-text {
      font-size: 0.7rem;
      color: #94a3b8;
      font-style: italic;
    }

    @media (max-width: 600px) {
      .click-hint {
        display: none !important;
      }
      .panel-header {
        padding: 0 12px !important;
        height: 44px !important;
        min-height: 44px !important;
      }
      .panel-title {
        font-size: 0.8rem !important;
        gap: 6px !important;
      }
      .header-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }
      .birthdays-sub-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .view-all-btn {
        width: 100%;
      }
      .birthdays-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MonthlyBirthdaysComponent {
  private calendarService = inject(CalendarService);

  showAllMonths = signal<boolean>(false);
  readonly MONTH_NAMES_ES = MONTH_NAMES_ES;

  isGroup1B = computed(() => this.calendarService.activeGroupId().toLowerCase() === '1b');

  // Mes numérico (1..12) de la fecha seleccionada en el calendario
  currentMonthNum = computed(() => {
    const dateStr = this.calendarService.selectedDate();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return parseInt(parts[1], 10);
    }
    return new Date().getMonth() + 1;
  });

  currentMonthName = computed(() => {
    const month = this.currentMonthNum();
    return MONTH_NAMES_ES[month - 1];
  });

  monthBirthdays = computed(() => {
    const month = this.currentMonthNum();
    return BIRTHDAYS_1B.filter(b => b.month === month);
  });

  getBirthdaysForMonth(m: number): BirthdayInfo[] {
    return BIRTHDAYS_1B.filter(b => b.month === m);
  }

  isTodayBirthday(bday: BirthdayInfo): boolean {
    const dateStr = this.calendarService.selectedDate();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      return bday.month === month && bday.day === day;
    }
    return false;
  }

  selectBirthdayDate(bday: BirthdayInfo): void {
    const selectedStr = this.calendarService.selectedDate();
    const parts = selectedStr.split('-');
    const year = parts.length === 3 ? parts[0] : '2026';
    const monthStr = bday.month.toString().padStart(2, '0');
    const dayStr = bday.day.toString().padStart(2, '0');
    const targetDateStr = `${year}-${monthStr}-${dayStr}`;

    this.calendarService.setSelectedDate(targetDateStr);
  }
}
