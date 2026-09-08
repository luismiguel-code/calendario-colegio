# 🏫 Calendario Escolar Interactivo — Liceo Taller San Miguel (Grupo 1B)

[![Angular](https://img.shields.io/badge/Angular-v21.1-dd0031?style=for-the-badge&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Angular Material](https://img.shields.io/badge/Angular_Material-UI-3f51b5?style=for-the-badge&logo=angular)](https://material.angular.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://temporary-sonic-olive-qa38q98.vercel.app/1b)

Aplicación web progresiva (*Mobile-First*) diseñada para facilitar a los padres de familia del **Liceo Taller San Miguel (Grupo 1B)** la consulta rápida del uniforme escolar diario (Gris o Rojo), agenda de tareas, eventos, notas importantes y el horario oficial de clases por días de ciclo.

🌐 **Demo en Vivo:** [https://temporary-sonic-olive-qa38q98.vercel.app/1b](https://temporary-sonic-olive-qa38q98.vercel.app/1b)

---

## ✨ Características Principales

* 🔴 **Cruce Automático de Uniforme (Ciclo de 6 Días):** Mapeo completo del año escolar 2026-2027. Los días con Educación Física se destacan automáticamente con **Uniforme Rojo**, y los días normales con **Uniforme Gris**.
* 👩‍🏫 **Equipo Docente 1B:** Presentación de la dirección de grupo (*Mr Daniel Acevedo Moncada*, *Ms Diana Milena Rojas* y *Ms Sandra Quintero*).
* 📅 **Horario Oficial por Días de Ciclo:** Selector interactivo para consultar asignaturas y docentes del Día 1 al Día 6.
* 📌 **Puntos Importantes Desplegables:** Contactos de emergencia, coordinación, secretaría, reglas de cumpleaños y lista de útiles marcados para enviar desde casa.
* 🔐 **Panel de Administración con Clave:** Autenticación de administrador para registrar o eliminar tareas y realizar reemplazos manuales de vestuario.
* 📱 **Mobile-First & Responsive:** Diseñado con Angular Material y optimizaciones para teléfonos celulares y tabletas.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Angular 21 (Standalone Components & Signals)
- **UI & Iconos:** Angular Material + Material Icons Round
- **Estilos:** CSS3 flexbox/grid con diseño responsivo
- **Despliegue:** Vercel Hosting
- **Arquitectura:** Reactive State Management con Angular Signals y LocalStorage Persistence

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/luismiguel-code/calendario-colegio.git
   cd calendario-colegio
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo:**
   ```bash
   npm start
   ```
   Abre tu navegador en `http://localhost:4200/1b`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT.
