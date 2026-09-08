export type UniformType = 'gris' | 'rojo' | 'especial' | 'libre';

export type ActivityCategory = 'tarea' | 'examen' | 'evento' | 'materiales' | 'aviso';

export interface Activity {
  id: string;
  grupoId: string;
  titulo: string;
  descripcion?: string;
  fecha: string; // Formato YYYY-MM-DD
  categoria: ActivityCategory;
  destacado?: boolean;
  creadoPor?: string;
}

export interface DayUniformOverride {
  grupoId: string;
  fecha: string; // Formato YYYY-MM-DD
  tipo: UniformType;
  motivo?: string;
}

export interface GroupInfo {
  id: string; // ej. '1b', '1a', '2b'
  nombre: string; // ej. 'Grupo 1B'
  grado: string; // ej. '1er Grado Primaria'
  maestra: string; // ej. 'Profra. María Elena'
  uniformeDefault: {
    1: UniformType; // Lunes
    2: UniformType; // Martes
    3: UniformType; // Miércoles
    4: UniformType; // Jueves
    5: UniformType; // Viernes
  };
}

export const UNIFORM_DETAILS: Record<UniformType, { nombre: string; icono: string; descripcion: string; badgeClass: string }> = {
  gris: {
    nombre: 'Uniforme Gris',
    icono: 'checkroom',
    descripcion: 'Formal / Diario',
    badgeClass: 'badge-gris'
  },
  rojo: {
    nombre: 'Uniforme Rojo',
    icono: 'fitness_center',
    descripcion: 'Deportivo / Ed. Física',
    badgeClass: 'badge-rojo'
  },
  especial: {
    nombre: 'Uniforme Especial',
    icono: 'star',
    descripcion: 'Vestuario Especial',
    badgeClass: 'badge-especial'
  },
  libre: {
    nombre: 'Ropa Libre',
    icono: 'sentiment_very_satisfied',
    descripcion: 'Sin Clase / Ropa Libre',
    badgeClass: 'badge-libre'
  }
};
