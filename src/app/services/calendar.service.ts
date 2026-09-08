import { Injectable, signal, computed } from '@angular/core';
import { Activity, DayUniformOverride, GroupInfo, UniformType } from '../models/calendar.model';
import { SAN_MIGUEL_CYCLES_1B } from '../data/school-cycles.data';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly STORAGE_KEY_ACTIVITIES = 'calendario_colegio_activities_v1';
  private readonly STORAGE_KEY_OVERRIDES = 'calendario_colegio_overrides_v1';

  // State Signals
  readonly groups = signal<GroupInfo[]>([
    {
      id: '1b',
      nombre: 'Grupo 1B',
      grado: '1er Grado - Liceo Taller San Miguel',
      maestra: 'Mr. Daniel Acevedo Moncada (Director) / Ms. Diana Milena Rojas (Codirectora)',
      uniformeDefault: {
        1: 'gris',
        2: 'rojo',
        3: 'gris',
        4: 'rojo',
        5: 'gris'
      }
    },
    {
      id: '1a',
      nombre: 'Grupo 1A',
      grado: '1er Grado - Liceo Taller San Miguel',
      maestra: 'Profra. Ana Gómez',
      uniformeDefault: {
        1: 'rojo',
        2: 'gris',
        3: 'rojo',
        4: 'gris',
        5: 'gris'
      }
    }
  ]);

  readonly activeGroupId = signal<string>('1b');
  readonly selectedDate = signal<string>(this.formatDateToString(new Date()));

  readonly activities = signal<Activity[]>([]);
  readonly uniformOverrides = signal<DayUniformOverride[]>([]);

  // Computed Values
  readonly activeGroup = computed(() => {
    const id = this.activeGroupId();
    return this.groups().find(g => g.id.toLowerCase() === id.toLowerCase()) || this.groups()[0];
  });

  readonly selectedDateUniform = computed(() => {
    const group = this.activeGroup();
    const dateStr = this.selectedDate();
    return this.getUniformForDate(group.id, dateStr);
  });

  readonly activeGroupActivitiesForSelectedDate = computed(() => {
    const group = this.activeGroup();
    const dateStr = this.selectedDate();
    return this.activities().filter(a => a.grupoId.toLowerCase() === group.id.toLowerCase() && a.fecha === dateStr);
  });

  constructor() {
    this.loadFromStorage();
  }

  setActiveGroup(groupId: string): void {
    if (groupId) {
      this.activeGroupId.set(groupId.toLowerCase());
    }
  }

  setSelectedDate(dateStr: string): void {
    this.selectedDate.set(dateStr);
  }

  getUniformForDate(groupId: string, dateStr: string): { tipo: UniformType; esOverride: boolean; motivo?: string } {
    // 1. Revisar si hay un override manual de los papás/maestros
    const override = this.uniformOverrides().find(o => o.grupoId.toLowerCase() === groupId.toLowerCase() && o.fecha === dateStr);
    if (override) {
      return { tipo: override.tipo, esOverride: true, motivo: override.motivo };
    }

    // 2. Si es el Grupo 1B, usar el Calendario Oficial por Ciclos de San Miguel
    if (groupId.toLowerCase() === '1b') {
      const cycleInfo = SAN_MIGUEL_CYCLES_1B[dateStr];
      if (cycleInfo) {
        let motivo = '';
        if (cycleInfo.eventoEspecial) {
          motivo = cycleInfo.eventoEspecial;
        } else if (cycleInfo.educacionFisica) {
          motivo = `Ciclo ${cycleInfo.ciclo} - Día ${cycleInfo.diaCiclo}: Educación Física (Uniforme Rojo)`;
        } else if (cycleInfo.diaCiclo > 0) {
          motivo = `Ciclo ${cycleInfo.ciclo} - Día ${cycleInfo.diaCiclo}: Clases Normales (Uniforme Gris)`;
        }
        return { tipo: cycleInfo.uniforme, esOverride: false, motivo };
      }
    }

    // 3. Regla por defecto para fin de semana u otros grupos
    const dateObj = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = dateObj.getDay(); // 0 = Dom, 6 = Sáb

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { tipo: 'libre', esOverride: false, motivo: 'Fin de semana' };
    }

    const group = this.groups().find(g => g.id.toLowerCase() === groupId.toLowerCase()) || this.groups()[0];
    const defaultTipo = group.uniformeDefault[dayOfWeek as 1|2|3|4|5] || 'gris';

    return { tipo: defaultTipo, esOverride: false };
  }

  getActivitiesForMonth(groupId: string, year: number, monthZeroBased: number): Activity[] {
    const monthStr = (monthZeroBased + 1).toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    return this.activities().filter(a => a.grupoId.toLowerCase() === groupId.toLowerCase() && a.fecha.startsWith(prefix));
  }

  addActivity(activity: Omit<Activity, 'id'>): void {
    const newActivity: Activity = {
      ...activity,
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.activities.update(prev => [...prev, newActivity]);
    this.saveActivitiesToStorage();
  }

  deleteActivity(id: string): void {
    this.activities.update(prev => prev.filter(a => a.id !== id));
    this.saveActivitiesToStorage();
  }

  setUniformOverride(groupId: string, fecha: string, tipo: UniformType, motivo?: string): void {
    this.uniformOverrides.update(prev => {
      const filtered = prev.filter(o => !(o.grupoId.toLowerCase() === groupId.toLowerCase() && o.fecha === fecha));
      return [...filtered, { grupoId: groupId.toLowerCase(), fecha, tipo, motivo }];
    });
    this.saveOverridesToStorage();
  }

  removeUniformOverride(groupId: string, fecha: string): void {
    this.uniformOverrides.update(prev => prev.filter(o => !(o.grupoId.toLowerCase() === groupId.toLowerCase() && o.fecha === fecha)));
    this.saveOverridesToStorage();
  }

  formatDateToString(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadFromStorage(): void {
    try {
      const storedActivities = localStorage.getItem(this.STORAGE_KEY_ACTIVITIES);
      const storedOverrides = localStorage.getItem(this.STORAGE_KEY_OVERRIDES);

      if (storedActivities) {
        this.activities.set(JSON.parse(storedActivities));
      } else {
        const todayStr = this.formatDateToString(new Date());
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = this.formatDateToString(tomorrow);

        const initialActivities: Activity[] = [
          {
            id: 'act_1',
            grupoId: '1b',
            titulo: 'Traer libro de Matemáticas y cuaderno de cuadrícula',
            descripcion: 'Revisión de ejercicios de sumas y restas simples.',
            fecha: todayStr,
            categoria: 'tarea',
            destacado: true,
            creadoPor: 'Mr. Daniel Acevedo Moncada'
          },
          {
            id: 'act_2',
            grupoId: '1b',
            titulo: 'Traer 1 manzana y 1 plátano para clase de Ciencias',
            descripcion: 'Actividad práctica sobre alimentación saludable.',
            fecha: todayStr,
            categoria: 'materiales',
            creadoPor: 'Mamá de Mateo'
          },
          {
            id: 'act_3',
            grupoId: '1b',
            titulo: 'Examen corto de Español (Vocales y sílabas)',
            descripcion: 'Estudiar lecciones 1 a 4 del libro de texto.',
            fecha: tomorrowStr,
            categoria: 'examen',
            destacado: true,
            creadoPor: 'Mr. Daniel Acevedo Moncada'
          }
        ];
        this.activities.set(initialActivities);
        this.saveActivitiesToStorage();
      }

      if (storedOverrides) {
        this.uniformOverrides.set(JSON.parse(storedOverrides));
      }
    } catch (err) {
      console.error('Error cargando almacenamiento:', err);
    }
  }

  private saveActivitiesToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_ACTIVITIES, JSON.stringify(this.activities()));
    } catch (err) {
      console.error('Error guardando actividades:', err);
    }
  }

  private saveOverridesToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_OVERRIDES, JSON.stringify(this.uniformOverrides()));
    } catch (err) {
      console.error('Error guardando uniformes:', err);
    }
  }
}
