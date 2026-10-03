const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/components/important-notes/important-notes.component.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

// 1. Add isGroup1A and SAN_MIGUEL_CYCLES_1A
fileContent = fileContent.replace(
  "import { SAN_MIGUEL_CYCLES_1B } from '../../data/school-cycles.data';",
  "import { SAN_MIGUEL_CYCLES_1B, SAN_MIGUEL_CYCLES_1A } from '../../data/school-cycles.data';"
);

fileContent = fileContent.replace(
  "isGroup1B = computed(() => this.calendarService.activeGroupId().toLowerCase() === '1b');",
  "isGroup1B = computed(() => this.calendarService.activeGroupId().toLowerCase() === '1b');\n  isGroup1A = computed(() => this.calendarService.activeGroupId().toLowerCase() === '1a');"
);

// Update title logic
fileContent = fileContent.replace(
  "isGroup1B() ? ' Y HORARIO' : ''",
  "(isGroup1B() || isGroup1A()) ? ' Y HORARIO' : ''"
).replace(
  "isGroup1B() ? 'y horario' : ''",
  "(isGroup1B() || isGroup1A()) ? 'y horario' : ''"
);

// 2. Add todayCycleInfo for 1A
fileContent = fileContent.replace(
  /todayCycleInfo = computed\(\(\) => \{[\s\S]*?\}\);/,
  `todayCycleInfo = computed(() => {
    const dateStr = this.calendarService.selectedDate();
    if (this.isGroup1A()) {
      return SAN_MIGUEL_CYCLES_1A[dateStr] || null;
    }
    return SAN_MIGUEL_CYCLES_1B[dateStr] || null;
  });`
);

// 3. Add displayedScheduleDays for 1A
fileContent = fileContent.replace(
  /displayedScheduleDays\(\): ScheduleDay\[\] \{[\s\S]*?return this\.scheduleDays\.filter\(d => d\.dayNum === selected\);\n  \}/,
  `displayedScheduleDays(): ScheduleDay[] {
    const selected = this.effectiveSelectedDay();
    const days = this.isGroup1A() ? this.scheduleDays1A : this.scheduleDays;
    if (selected === 0) {
      return days;
    }
    return days.filter(d => d.dayNum === selected);
  }`
);

// Update template for the selector to use scheduleDays1A if 1A
fileContent = fileContent.replace(
  "@for (day of scheduleDays; track day.dayNum)",
  "@for (day of (isGroup1A() ? scheduleDays1A : scheduleDays); track day.dayNum)"
);

// 4. Inject 1A UI next to 1B
const ui1A = `
          <!-- SECCIÓN DE DIRECCIÓN DE GRUPO Y HORARIO (SOLO VISIBLE EN EL GRUPO 1A) -->
          @if (isGroup1A()) {
            <!-- Dirección de Grupo 1A -->
            <div class="teachers-team-card">
              <div class="teachers-header">
                <div class="icon-bubble bubble-team">
                  <mat-icon>groups</mat-icon>
                </div>
                <div>
                  <h4>DIRECCIÓN DE GRUPO 1A</h4>
                  <p class="teachers-sub">Equipo docente y de acompañamiento del salón</p>
                </div>
              </div>

              <div class="teachers-grid">
                <div class="teacher-item">
                  <div class="teacher-role">Directora de grupo</div>
                  <div class="teacher-name">Ms Daniela Mesa Pérez</div>
                  <div class="teacher-subjects">Matemáticas, Ciencias, Inglés</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Codirectora de grupo</div>
                  <div class="teacher-name">Ms Valentina Salazar</div>
                  <div class="teacher-subjects">Artes</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Maestra asistente</div>
                  <div class="teacher-name">Ms Sandra Granados</div>
                  <div class="teacher-subjects">Acompañamiento 1A</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Docente Danzas</div>
                  <div class="teacher-name">Ms Eliana Garcia</div>
                  <div class="teacher-subjects">Danzas</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Docente Teatro</div>
                  <div class="teacher-name">Mr Henry Rosas</div>
                  <div class="teacher-subjects">Teatro</div>
                </div>

                <div class="teacher-item">
                  <div class="teacher-role">Docente Identidad</div>
                  <div class="teacher-name">Ms Jana Catalina Gómez</div>
                  <div class="teacher-subjects">Identidad San Miguel</div>
                </div>
              </div>
            </div>

            <div class="timetable-section">
              <div class="timetable-header">
                <div class="icon-bubble bubble-horario">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="timetable-title-group">
                  <div class="timetable-title-row">
                    <h4>HORARIO OFICIAL DE CLASES - GRUPO 1A</h4>
                    @if (currentCycleDayNum(); as currentDay) {
                      <span class="today-schedule-badge">
                        <mat-icon class="badge-icon">event_available</mat-icon>
                        Hoy: Día {{ currentDay }}@if (todayCycleInfo(); as info){ (Ciclo {{ info.ciclo }})}
                      </span>
                    }
                  </div>
                  <p class="timetable-sub">
                    @if (todayCycleInfo(); as info) {
                      @if (info.eventoEspecial) {
                        <span>📌 Evento de hoy: <strong>{{ info.eventoEspecial }}</strong></span>
                      } @else if (currentCycleDayNum()) {
                        <span>Horario precargado automáticamente para la fecha seleccionada (Día {{ currentCycleDayNum() }}).</span>
                      } @else {
                        <span>Selecciona un día del ciclo para consultar sus materias y profesores</span>
                      }
                    } @else {
                      <span>Selecciona un día del ciclo para consultar sus materias y profesores</span>
                    }
                  </p>
                </div>
              </div>

              <!-- Selector de Día de Ciclo -->
              <div class="day-buttons-bar">
                @for (day of scheduleDays1A; track day.dayNum) {
                  <button 
                    mat-stroked-button 
                    class="day-toggle-btn"
                    [class.active-day-btn]="effectiveSelectedDay() === day.dayNum"
                    [class.today-day-btn]="currentCycleDayNum() === day.dayNum"
                    [class.ef-day-btn]="day.hasEf"
                    (click)="selectScheduleDay(day.dayNum)"
                  >
                    <span>Día {{ day.dayNum }}</span>
                    @if (currentCycleDayNum() === day.dayNum) {
                      <span class="hoy-chip">⭐ HOY</span>
                    } @else if (day.hasEf) {
                      <span class="ef-badge">🔴 Uniforme Rojo</span>
                    }
                  </button>
                }
                <button 
                  mat-stroked-button 
                  class="day-toggle-btn"
                  [class.active-day-btn]="effectiveSelectedDay() === 0"
                  (click)="selectScheduleDay(0)"
                >
                  <span>Ver Todos los Días</span>
                </button>

                @if (userSelectedDay() !== null && currentCycleDayNum()) {
                  <button 
                    mat-flat-button
                    color="primary"
                    class="day-toggle-btn reset-today-btn"
                    (click)="resetToToday()"
                  >
                    <mat-icon>today</mat-icon>
                    <span>Volver a Hoy (Día {{ currentCycleDayNum() }})</span>
                  </button>
                }
              </div>

              <!-- Contenido de Materias por Día -->
              <div class="days-schedule-container">
                @for (day of displayedScheduleDays(); track day.dayNum) {
                  <div class="day-schedule-card" [class.highlight-ef-card]="day.hasEf" [class.highlight-today-card]="day.dayNum === currentCycleDayNum()">
                    @if (day.dayNum === currentCycleDayNum()) {
                      <div class="today-banner">
                        <mat-icon>stars</mat-icon>
                        <span>HORARIO PRECARGADO DE HOY — Día {{ day.dayNum }}@if (todayCycleInfo(); as info){ (Ciclo {{ info.ciclo }})}</span>
                      </div>
                    }
                    <div class="day-card-header">
                      <span class="day-title-pill">
                        <mat-icon>calendar_view_day</mat-icon>
                        DÍA {{ day.dayNum }}
                      </span>

                      @if (day.hasEf) {
                        <span class="ef-tag">🔴 UNIFORME ROJO {{ day.efTime ? '(' + day.efTime + ')' : '' }}</span>
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
`;

fileContent = fileContent.replace(
  "<!-- SECCIÓN DE DIRECCIÓN DE GRUPO Y HORARIO (SOLO VISIBLE EN EL GRUPO 1B) -->",
  ui1A + "\n          <!-- SECCIÓN DE DIRECCIÓN DE GRUPO Y HORARIO (SOLO VISIBLE EN EL GRUPO 1B) -->"
);


const data1A = \`
  readonly scheduleDays1A: ScheduleDay[] = [
    {
      dayNum: 1,
      title: 'Día 1',
      hasEf: false,
      blocks: [
        { time: '08:15 - 08:55', subject: 'Teatro', teacher: 'Henry Rosas' },
        { time: '08:55 - 09:35', subject: 'Reading Institutional Program', teacher: 'Daniela Mesa / Diana Milena Rojas' },
        { time: '09:35 - 10:35', subject: 'Breakfast 🍎', isBreak: true },
        { time: '10:35 - 11:20', subject: 'Science', teacher: 'Daniela Mesa' },
        { time: '11:20 - 12:00', subject: 'Ajedrez', teacher: 'Levy de la Pava' },
        { time: '12:00 - 13:10', subject: 'Lunch 🍲', isBreak: true },
        { time: '13:10 - 14:45', subject: 'Identidad San Miguel', teacher: 'Jana Gomez' }
      ]
    },
    {
      dayNum: 2,
      title: 'Día 2',
      hasEf: true,
      efTime: '13:10 - 13:50',
      blocks: [
        { time: '08:15 - 08:55', subject: 'Música', teacher: 'Carlos Ramirez' },
        { time: '08:55 - 09:35', subject: 'Mathematics', teacher: 'Daniela Mesa' },
        { time: '09:35 - 10:35', subject: 'Breakfast 🍎', isBreak: true },
        { time: '10:35 - 12:00', subject: 'Science', teacher: 'Daniela Mesa' },
        { time: '12:00 - 13:10', subject: 'Lunch 🍲', isBreak: true },
        { time: '13:10 - 13:50', subject: 'Educación Física 🔴', teacher: 'Hugo Hernandez', isEf: true },
        { time: '13:50 - 14:45', subject: 'Ciencias Sociales', teacher: 'Daniel Acevedo' }
      ]
    },
    {
      dayNum: 3,
      title: 'Día 3',
      hasEf: false,
      blocks: [
        { time: '08:15 - 09:35', subject: 'Arts', teacher: 'Valentina Salazar' },
        { time: '09:35 - 10:35', subject: 'Breakfast 🍎', isBreak: true },
        { time: '10:35 - 12:00', subject: 'Progrentis Elementar', teacher: 'Daniel Acevedo' },
        { time: '12:00 - 13:10', subject: 'Lunch 🍲', isBreak: true },
        { time: '13:10 - 13:50', subject: 'Lenguaje', teacher: 'Daniel Acevedo' },
        { time: '13:50 - 14:45', subject: 'Mathematics', teacher: 'Daniela Mesa' }
      ]
    },
    {
      dayNum: 4,
      title: 'Día 4',
      hasEf: true,
      efTime: '13:10 - 13:50',
      blocks: [
        { time: '08:15 - 09:35', subject: 'English', teacher: 'Daniela Mesa' },
        { time: '09:35 - 10:35', subject: 'Breakfast 🍎', isBreak: true },
        { time: '10:35 - 12:00', subject: 'Mathematics', teacher: 'Daniela Mesa' },
        { time: '12:00 - 13:10', subject: 'Lunch 🍲', isBreak: true },
        { time: '13:10 - 13:50', subject: 'Educación Física 🔴', teacher: 'Hugo Hernandez', isEf: true },
        { time: '13:50 - 14:45', subject: 'Ciencias Sociales', teacher: 'Daniel Acevedo' }
      ]
    },
    {
      dayNum: 5,
      title: 'Día 5',
      hasEf: true,
      efTime: 'Día de Juguetes',
      blocks: [
        { time: '08:15 - 08:55', subject: 'Lenguaje', teacher: 'Daniel Acevedo' },
        { time: '08:55 - 09:35', subject: 'Science', teacher: 'Daniela Mesa' },
        { time: '09:35 - 10:35', subject: 'Breakfast 🍎', isBreak: true },
        { time: '10:35 - 11:20', subject: 'Danzas', teacher: 'Eliana Garcia' },
        { time: '11:20 - 12:00', subject: 'Ciencias Sociales', teacher: 'Daniel Acevedo' },
        { time: '12:00 - 13:10', subject: 'Lunch 🍲', isBreak: true },
        { time: '13:10 - 13:50', subject: 'Lenguaje', teacher: 'Daniel Acevedo' },
        { time: '13:50 - 14:45', subject: 'Homeroom', teacher: 'Daniela Mesa / Daniel Acevedo / Diana Milena Rojas / Valentina Salazar' }
      ]
    },
    {
      dayNum: 6,
      title: 'Día 6',
      hasEf: false,
      blocks: [
        { time: '08:15 - 08:55', subject: 'Lenguaje', teacher: 'Daniel Acevedo' },
        { time: '08:55 - 09:35', subject: 'Ciencias Sociales', teacher: 'Daniel Acevedo' },
        { time: '09:35 - 10:35', subject: 'Breakfast 🍎', isBreak: true },
        { time: '10:35 - 12:00', subject: 'Reading Institutional Program', teacher: 'Daniela Mesa / Diana Milena Rojas' },
        { time: '12:00 - 13:10', subject: 'Lunch 🍲', isBreak: true },
        { time: '13:10 - 13:50', subject: 'Lenguaje', teacher: 'Daniel Acevedo' },
        { time: '13:50 - 14:45', subject: 'Mathematics', teacher: 'Daniela Mesa' }
      ]
    }
  ];
\`;

fileContent = fileContent.replace(
  "readonly scheduleDays: ScheduleDay[] = [",
  data1A + "\n  readonly scheduleDays: ScheduleDay[] = ["
);

fs.writeFileSync(filePath, fileContent);
console.log("updated important-notes");
