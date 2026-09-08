import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../../services/calendar.service';

interface ScheduleBlock {
  time: string;
  subject: string;
  teacher?: string;
  isBreak?: boolean;
  isEf?: boolean;
}

interface ScheduleDay {
  dayNum: number;
  title: string;
  hasEf: boolean;
  efTime?: string;
  blocks: ScheduleBlock[];
}

@Component({
  selector: 'app-important-notes',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule
  ],
  template: `
    <div class="important-notes-wrapper">
      <mat-accordion class="custom-accordion">
        <mat-expansion-panel [expanded]="false" class="panel-card">
          <mat-expansion-panel-header class="panel-header">
            <mat-panel-title class="panel-title">
              <mat-icon color="primary" class="header-icon">info</mat-icon>
              <span>PUNTOS IMPORTANTES {{ isGroup1B() ? 'Y HORARIO DE CLASES' : '' }}</span>
            </mat-panel-title>
            <mat-panel-description class="panel-desc">
              <span class="click-hint">Click para desplegar información general {{ isGroup1B() ? 'y horario' : '' }}</span>
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="notes-grid">
            <!-- Columna 1: Comunicación -->
            <div class="note-section section-comunicacion">
              <div class="section-header">
                <div class="icon-bubble bubble-comunicacion">
                  <mat-icon>phone_in_talk</mat-icon>
                </div>
                <h4>COMUNICACIÓN</h4>
              </div>
              
              <ul class="notes-list">
                <li>
                  <mat-icon class="list-icon">apps</mat-icon>
                  <span><strong>1. Phidias</strong></span>
                </li>
                <li>
                  <mat-icon class="list-icon">contact_phone</mat-icon>
                  <div>
                    <strong>2. Llamar a:</strong>
                    <div class="phone-box">
                      <div class="phone-item">
                        <span class="phone-label">Coordinación:</span>
                        <a href="tel:3173703604" class="phone-link">317 370 3604</a>
                      </div>
                      <div class="phone-item">
                        <span class="phone-label">Secretaría:</span>
                        <div class="phone-lines">
                          <a href="tel:6063151818" class="phone-link">(606) 315 1818 Ext. 100-101</a>
                          <a href="tel:3174284122" class="phone-link">317 428 4122</a>
                          <a href="tel:3104947437" class="phone-link">310 494 7437</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Columna 2: Informes y Cumpleaños -->
            <div class="note-section section-cumpleanos">
              <div class="section-header">
                <div class="icon-bubble bubble-cumpleanos">
                  <mat-icon>cake</mat-icon>
                </div>
                <h4>INFORMES Y CUMPLEAÑOS</h4>
              </div>

              <div class="subsection">
                <div class="sub-title">
                  <mat-icon>description</mat-icon>
                  <strong>Informes:</strong>
                </div>
                <p class="text-alert">⛔ NO informes mensuales.</p>
              </div>

              <div class="subsection">
                <div class="sub-title">
                  <mat-icon>celebration</mat-icon>
                  <strong>Celebraciones de Cumpleaños:</strong>
                </div>
                <ul class="notes-list">
                  <li><mat-icon class="bullet-icon">check_circle</mat-icon> <span>Una vez al mes</span></li>
                  <li><mat-icon class="bullet-icon">check_circle</mat-icon> <span>Compartir individual</span></li>
                  <li><mat-icon class="bullet-icon">check_circle</mat-icon> <span>Bebidas</span></li>
                  <li>
                    <mat-icon class="bullet-icon icon-warn">warning</mat-icon>
                    <span><strong>Evitar:</strong> Cremas – sorpresas – decoraciones.</span>
                  </li>
                  <li class="dinamica-box">
                    <mat-icon class="bullet-icon icon-star">videocam</mat-icon>
                    <span><strong>Dinámica:</strong> En familia realizar un video sorpresa de felicitación. <em>(Participación)</em></span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Columna 3: Enviar de Casa -->
            <div class="note-section section-casa">
              <div class="section-header">
                <div class="icon-bubble bubble-casa">
                  <mat-icon>backpack</mat-icon>
                </div>
                <h4>ENVIAR DE CASA</h4>
                <span class="marcado-badge">⚠️ TODO MARCADO</span>
              </div>

              <div class="checklist-grid">
                <div class="check-item"><mat-icon>water_drop</mat-icon> Termo con agua</div>
                <div class="check-item"><mat-icon>cleaning_services</mat-icon> Pañitos húmedos</div>
                <div class="check-item"><mat-icon>clean_hands</mat-icon> Cepillo de dientes (revisión semanal)</div>
                <div class="check-item"><mat-icon>sanitizer</mat-icon> Crema dental</div>
                <div class="check-item"><mat-icon>checkroom</mat-icon> Ropa de cambio</div>
                <div class="check-item"><mat-icon>palette</mat-icon> Delantal de arte</div>
                <div class="check-item"><mat-icon>masks</mat-icon> Tapabocas (si presenta síntoma)</div>
                <div class="check-item"><mat-icon>wb_sunny</mat-icon> Bloqueador</div>
                <div class="check-item"><mat-icon>edit</mat-icon> Cartuchera</div>
                <div class="check-item"><mat-icon>bug_report</mat-icon> Repelente</div>
                <div class="check-item"><mat-icon>face</mat-icon> Gorra</div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN DE DIRECCIÓN DE GRUPO Y HORARIO (SOLO VISIBLE EN EL GRUPO 1B) -->
          @if (isGroup1B()) {
            <!-- Dirección de Grupo 1B -->
            <div class="teachers-team-card">
              <div class="teachers-header">
                <div class="icon-bubble bubble-team">
                  <mat-icon>groups</mat-icon>
                </div>
                <div>
                  <h4>DIRECCIÓN DE GRUPO 1B</h4>
                  <p class="teachers-sub">Equipo docente y de acompañamiento del salón</p>
                </div>
              </div>

              <div class="teachers-grid">
                <div class="teacher-item">
                  <div class="teacher-role">Director de grupo</div>
                  <div class="teacher-name">Mr Daniel Acevedo Moncada</div>
                  <div class="teacher-subjects">Matemáticas, Ciencias, Inglés</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Codirectora de grupo</div>
                  <div class="teacher-name">Ms Diana Milena Rojas</div>
                  <div class="teacher-subjects">Reading Program</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Maestra asistente</div>
                  <div class="teacher-name">Ms Sandra Quintero</div>
                  <div class="teacher-subjects">Acompañamiento 1B</div>
                </div>
              </div>
            </div>

            <div class="timetable-section">
              <div class="timetable-header">
                <div class="icon-bubble bubble-horario">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div>
                  <h4>HORARIO OFICIAL DE CLASES - GRUPO 1B</h4>
                  <p class="timetable-sub">Selecciona un día del ciclo para consultar sus materias y profesores</p>
                </div>
              </div>

              <!-- Selector de Día de Ciclo -->
              <div class="day-buttons-bar">
                @for (day of scheduleDays; track day.dayNum) {
                  <button 
                    mat-stroked-button 
                    class="day-toggle-btn"
                    [class.active-day-btn]="selectedScheduleDay() === day.dayNum"
                    [class.ef-day-btn]="day.hasEf"
                    (click)="selectedScheduleDay.set(day.dayNum)"
                  >
                    <span>Día {{ day.dayNum }}</span>
                    @if (day.hasEf) {
                      <span class="ef-badge">🔴 Ed. Física</span>
                    }
                  </button>
                }
                <button 
                  mat-stroked-button 
                  class="day-toggle-btn"
                  [class.active-day-btn]="selectedScheduleDay() === 0"
                  (click)="selectedScheduleDay.set(0)"
                >
                  <span>Ver Todos los Días</span>
                </button>
              </div>

              <!-- Contenido de Materias por Día -->
              <div class="days-schedule-container">
                @for (day of displayedScheduleDays(); track day.dayNum) {
                  <div class="day-schedule-card" [class.highlight-ef-card]="day.hasEf">
                    <div class="day-card-header">
                      <span class="day-title-pill">
                        <mat-icon>calendar_view_day</mat-icon>
                        DÍA {{ day.dayNum }}
                      </span>

                      @if (day.hasEf) {
                        <span class="ef-tag">🔴 UNIFORME ROJO (Ed. Física: {{ day.efTime }})</span>
                      } @else {
                        <span class="gris-tag">🩶 UNIFORME GRIS (Clases Normales)</span>
                      }
                    </div>

                    <div class="blocks-list">
                      @for (block of day.blocks; track block.time + block.subject) {
                        <div class="block-row" [class.is-break]="block.isBreak" [class.is-ef-row]="block.isEf">
                          <span class="block-time">{{ block.time }}</span>
                          <div class="block-details">
                            <span class="block-subject">{{ block.subject }}</span>
                            @if (block.teacher) {
                              <span class="block-teacher">({{ block.teacher }})</span>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .important-notes-wrapper {
      margin: 16px 0;
    }
    .custom-accordion {
      border-radius: 16px !important;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
    }
    .panel-card {
      border: 1px solid #e2e8f0;
      border-radius: 16px !important;
      background: #ffffff;
    }
    .panel-header {
      padding: 16px 20px !important;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      min-height: 56px !important;
    }
    .panel-title {
      font-size: 0.95rem !important;
      font-weight: 800 !important;
      color: #0f172a;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      margin: 0 !important;
      overflow: visible !important;
    }
    .header-icon {
      color: #4f46e5;
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
    .panel-desc {
      justify-content: flex-end;
      align-items: center;
    }
    .click-hint {
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 500;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      padding: 20px 4px 16px 4px;
    }
    .note-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      position: relative;
    }
    .section-header h4 {
      font-size: 0.9rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .icon-bubble {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      overflow: visible;
    }
    .icon-bubble mat-icon {
      font-size: 22px !important;
      width: 22px !important;
      height: 22px !important;
      line-height: 1 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: visible !important;
    }
    .bubble-comunicacion { background: #3b82f6; }
    .bubble-cumpleanos { background: #ec4899; }
    .bubble-casa { background: #8b5cf6; }
    .bubble-horario { background: #10b981; }
    .bubble-team { background: #4f46e5; }

    .teachers-team-card {
      margin-top: 16px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
    }
    .teachers-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .teachers-header h4 {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .teachers-sub {
      font-size: 0.78rem;
      color: #64748b;
      margin: 0;
    }
    .teachers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }
    .teacher-item {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .teacher-role {
      font-size: 0.7rem;
      font-weight: 800;
      color: #4f46e5;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .teacher-name {
      font-size: 0.88rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .teacher-subjects {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .marcado-badge {
      margin-left: auto;
      font-size: 0.65rem;
      font-weight: 800;
      background: #fef3c7;
      color: #92400e;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .notes-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.82rem;
      color: #334155;
    }
    .notes-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .list-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #4f46e5;
      margin-top: 2px;
    }
    .bullet-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #10b981;
      margin-top: 2px;
    }
    .icon-warn { color: #f59e0b; }
    .icon-star { color: #ec4899; }

    .phone-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px 8px;
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .phone-item {
      display: flex;
      flex-direction: column;
    }
    .phone-label {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 600;
    }
    .phone-link {
      color: #2563eb;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.8rem;
    }
    .phone-link:hover {
      text-decoration: underline;
    }
    .phone-lines {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .subsection {
      margin-bottom: 10px;
    }
    .sub-title {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .sub-title mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #ec4899;
    }
    .text-alert {
      font-size: 0.8rem;
      font-weight: 700;
      color: #dc2626;
      margin: 0;
    }
    .dinamica-box {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-radius: 8px;
      padding: 6px;
      margin-top: 4px;
    }

    .checklist-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .check-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: #1e293b;
      background: #ffffff;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .check-item mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #8b5cf6;
    }

    /* Timetable Section */
    .timetable-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .timetable-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .timetable-header h4 {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .timetable-sub {
      font-size: 0.78rem;
      color: #64748b;
      margin: 0;
    }

    .day-buttons-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    .day-toggle-btn {
      border-radius: 12px !important;
      font-size: 0.78rem !important;
      font-weight: 700 !important;
      height: 36px !important;
      padding: 0 10px !important;
    }
    .active-day-btn {
      background-color: #4f46e5 !important;
      color: #ffffff !important;
      border-color: #4f46e5 !important;
    }
    .ef-badge {
      font-size: 0.65rem;
      margin-left: 4px;
    }

    .days-schedule-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
    }
    .day-schedule-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .highlight-ef-card {
      border-color: #fca5a5 !important;
      background: #fff5f5 !important;
    }
    .day-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #cbd5e1;
    }
    .day-title-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 800;
      font-size: 0.85rem;
      color: #0f172a;
    }
    .day-title-pill mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #4f46e5;
    }
    .ef-tag {
      font-size: 0.68rem;
      font-weight: 800;
      color: #b91c1c;
      background: #fee2e2;
      padding: 2px 6px;
      border-radius: 6px;
    }
    .gris-tag {
      font-size: 0.68rem;
      font-weight: 700;
      color: #475569;
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .blocks-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .block-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.78rem;
      padding: 4px 6px;
      border-radius: 6px;
      background: #f8fafc;
    }
    .is-break {
      background: #fef3c7 !important;
      color: #92400e;
      font-weight: 700;
    }
    .is-ef-row {
      background: #fee2e2 !important;
      border: 1px solid #fca5a5;
    }
    .block-time {
      font-weight: 700;
      color: #64748b;
      min-width: 76px;
      font-size: 0.72rem;
    }
    .block-details {
      display: flex;
      flex-direction: column;
    }
    .block-subject {
      font-weight: 700;
      color: #0f172a;
    }
    .block-teacher {
      font-size: 0.7rem;
      color: #64748b;
    }

    @media (max-width: 600px) {
      .click-hint {
        display: none !important;
      }
      .panel-header {
        padding: 12px 14px !important;
      }
      .panel-title {
        font-size: 0.82rem !important;
        gap: 6px !important;
      }
      .header-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }
      .notes-grid {
        grid-template-columns: 1fr !important;
        gap: 12px;
        padding: 14px 0 10px 0;
      }
      .teachers-grid {
        grid-template-columns: 1fr !important;
      }
      .teachers-team-card {
        padding: 12px;
      }
      .day-buttons-bar {
        overflow-x: auto;
        flex-wrap: nowrap;
        white-space: nowrap;
        padding-bottom: 8px;
        margin-bottom: 12px;
        -webkit-overflow-scrolling: touch;
      }
      .day-toggle-btn {
        flex-shrink: 0;
        height: 34px !important;
        font-size: 0.74rem !important;
        padding: 0 8px !important;
      }
      .days-schedule-container {
        grid-template-columns: 1fr !important;
      }
      .day-schedule-card {
        padding: 10px;
      }
      .day-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      .block-row {
        padding: 4px 6px;
      }
      .block-time {
        min-width: 68px;
        font-size: 0.68rem;
      }
      .block-subject {
        font-size: 0.75rem;
      }
      .block-teacher {
        font-size: 0.65rem;
        line-height: 1.2;
      }
    }
  `]
})
export class ImportantNotesComponent {
  private calendarService = inject(CalendarService);

  selectedScheduleDay = signal<number>(1);

  isGroup1B = computed(() => this.calendarService.activeGroupId().toLowerCase() === '1b');

  readonly scheduleDays: ScheduleDay[] = [
    {
      dayNum: 1,
      title: 'Día 1',
      hasEf: true,
      efTime: '14:00 - 14:45',
      blocks: [
        { time: '08:15 - 08:55', subject: 'English+', teacher: 'Mr Daniel Acevedo Moncada / Ms Diana Milena Rojas' },
        { time: '08:55 - 09:35', subject: 'Lenguaje', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '09:35 - 10:35', subject: 'Desayuno / Receso 🍎', isBreak: true },
        { time: '10:35 - 11:30', subject: 'Ajedrez', teacher: 'Levy de la Pava' },
        { time: '11:30 - 12:25', subject: 'Mathematics', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '12:25 - 13:10', subject: 'Almuerzo 🍲', isBreak: true },
        { time: '13:10 - 14:00', subject: 'Progrentis Elemental', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '14:00 - 14:45', subject: 'Educación Física 🔴', teacher: 'Hugo Hernández (SA1)', isEf: true }
      ]
    },
    {
      dayNum: 2,
      title: 'Día 2',
      hasEf: false,
      blocks: [
        { time: '08:15 - 08:55', subject: 'Danzas', teacher: 'Eliana García (Performing Arts)' },
        { time: '08:55 - 09:35', subject: 'Teatro', teacher: 'Fanny Rosas (Performing Arts)' },
        { time: '09:35 - 10:35', subject: 'Desayuno / Receso 🍎', isBreak: true },
        { time: '10:35 - 11:30', subject: 'Lenguaje', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '11:30 - 12:25', subject: 'English', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '12:25 - 13:10', subject: 'Almuerzo 🍲', isBreak: true },
        { time: '13:10 - 14:00', subject: 'Science', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '14:00 - 14:45', subject: 'Lenguaje', teacher: 'Mr Daniel Acevedo Moncada' }
      ]
    },
    {
      dayNum: 3,
      title: 'Día 3',
      hasEf: false,
      blocks: [
        { time: '08:15 - 08:55', subject: 'Science', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '08:55 - 09:35', subject: 'Ciencias Sociales', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '09:35 - 10:35', subject: 'Desayuno / Receso 🍎', isBreak: true },
        { time: '10:35 - 12:25', subject: 'Arts', teacher: 'Valentina Salazar (Art Studio)' },
        { time: '12:25 - 13:10', subject: 'Almuerzo 🍲', isBreak: true },
        { time: '13:10 - 14:00', subject: 'Mathematics', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '14:00 - 14:45', subject: 'Mathematics', teacher: 'Mr Daniel Acevedo Moncada' }
      ]
    },
    {
      dayNum: 4,
      title: 'Día 4',
      hasEf: true,
      efTime: '13:10 - 14:00',
      blocks: [
        { time: '08:15 - 09:35', subject: 'Ciencias Sociales', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '09:35 - 10:35', subject: 'Desayuno / Receso 🍎', isBreak: true },
        { time: '10:35 - 11:30', subject: 'Lenguaje', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '11:30 - 12:25', subject: 'English', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '12:25 - 13:10', subject: 'Almuerzo 🍲', isBreak: true },
        { time: '13:10 - 14:00', subject: 'Educación Física 🔴', teacher: 'Hugo Hernández (SA1)', isEf: true },
        { time: '14:00 - 14:45', subject: 'Lenguaje', teacher: 'Mr Daniel Acevedo Moncada' }
      ]
    },
    {
      dayNum: 5,
      title: 'Día 5',
      hasEf: false,
      blocks: [
        { time: '08:15 - 09:35', subject: 'Identidad San Miguel', teacher: 'Jira Giraldo' },
        { time: '09:35 - 10:35', subject: 'Desayuno / Receso 🍎', isBreak: true },
        { time: '10:35 - 12:25', subject: 'Mathematics', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '12:25 - 13:10', subject: 'Almuerzo 🍲', isBreak: true },
        { time: '13:10 - 14:00', subject: 'Música', teacher: 'Carlos Ramírez (Music Hall)' },
        { time: '14:00 - 14:45', subject: 'Homeroom', teacher: 'Mr Daniel Acevedo Moncada / Ms Diana Milena Rojas' }
      ]
    },
    {
      dayNum: 6,
      title: 'Día 6',
      hasEf: false,
      blocks: [
        { time: '08:15 - 09:35', subject: 'Science', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '09:35 - 10:35', subject: 'Desayuno / Receso 🍎', isBreak: true },
        { time: '10:35 - 11:30', subject: 'Lenguaje', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '11:30 - 12:25', subject: 'Ciencias Sociales', teacher: 'Mr Daniel Acevedo Moncada' },
        { time: '12:25 - 13:10', subject: 'Almuerzo 🍲', isBreak: true },
        { time: '13:10 - 14:45', subject: 'English+ / Reading', teacher: 'Mr Daniel Acevedo Moncada / Ms Diana Milena Rojas' }
      ]
    }
  ];

  displayedScheduleDays(): ScheduleDay[] {
    const selected = this.selectedScheduleDay();
    if (selected === 0) {
      return this.scheduleDays;
    }
    return this.scheduleDays.filter(d => d.dayNum === selected);
  }
}
