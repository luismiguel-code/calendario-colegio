export interface BirthdayInfo {
  id: string;
  name: string;
  month: number; // 1 = Enero, ..., 12 = Diciembre
  day: number;   // 1..31
  role?: 'student' | 'teacher';
}

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const BIRTHDAYS_1B: BirthdayInfo[] = [
  // Enero
  { id: 'bday_jan_02', name: 'Violeta Marulanda', month: 1, day: 2 },
  { id: 'bday_jan_04', name: 'Ainhoa Fonseca', month: 1, day: 4 },

  // Febrero
  { id: 'bday_feb_05', name: 'Ainhoa Torres', month: 2, day: 5 },
  { id: 'bday_feb_07', name: 'Macarena Castrillón', month: 2, day: 7 },
  { id: 'bday_feb_24', name: 'Mr. Daniel Acevedo', month: 2, day: 24, role: 'teacher' },

  // Marzo
  { id: 'bday_mar_02', name: 'Ms. Diana Guzmán', month: 3, day: 2, role: 'teacher' },
  { id: 'bday_mar_29', name: 'Milagros Trujillo', month: 3, day: 29 },

  // Abril
  { id: 'bday_apr_15', name: 'Sofia Molina', month: 4, day: 15 },
  { id: 'bday_apr_22', name: 'Emiliano Osorio', month: 4, day: 22 },

  // Mayo
  { id: 'bday_may_09', name: 'Simón Cardona', month: 5, day: 9 },
  { id: 'bday_may_11', name: 'Martin Gallego', month: 5, day: 11 },
  { id: 'bday_may_22', name: 'Emilia Gallego', month: 5, day: 22 },

  // Junio
  { id: 'bday_jun_09', name: 'Emiliano Marín', month: 6, day: 9 },
  { id: 'bday_jun_17', name: 'León Ruiz', month: 6, day: 17 },

  // Julio
  { id: 'bday_jul_24', name: 'Samantha Carrillo', month: 7, day: 24 },

  // Agosto
  { id: 'bday_aug_03', name: 'Sofia Gómez', month: 8, day: 3 },
  { id: 'bday_aug_16', name: 'Julieta Restrepo', month: 8, day: 16 },

  // Septiembre
  { id: 'bday_sep_24', name: 'Evaluna Medina', month: 9, day: 24 },
  { id: 'bday_sep_27', name: 'Agustín Cardona', month: 9, day: 27 },

  // Octubre
  { id: 'bday_oct_16_1', name: 'Evaluna Echeverry', month: 10, day: 16 },
  { id: 'bday_oct_16_2', name: 'Ms. Sandra Quintero', month: 10, day: 16, role: 'teacher' },

  // Noviembre
  { id: 'bday_nov_03', name: 'Valentín Illera', month: 11, day: 3 },
  { id: 'bday_nov_06', name: 'Lía Mazariegos', month: 11, day: 6 },
  { id: 'bday_nov_14', name: 'Ignacio Mora', month: 11, day: 14 },
  { id: 'bday_nov_17', name: 'Jacobo Villada', month: 11, day: 17 },

  // Diciembre
  { id: 'bday_dec_15', name: 'Alicia Baena', month: 12, day: 15 },
  { id: 'bday_dec_18', name: 'Jacobo Ortega', month: 12, day: 18 }
];
