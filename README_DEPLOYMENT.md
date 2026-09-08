# 🚀 Guía de Publicación Gratuita - Calendario Colegio 1B

Esta aplicación Angular + Angular Material está lista para alojarse totalmente gratis en varias plataformas. A continuación encuentras las mejores opciones:

---

## 1. 🔥 Firebase Hosting (Recomendado para Angular)

Firebase te da un subdominio gratis (ejemplo: `calendario-1b.web.app`), certificado SSL automático y almacenamiento de datos.

### Pasos para publicar:
1. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Inicia sesión e inicia el proyecto:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Elige tu proyecto de Firebase.
   - En **Public directory**, escribe: `dist/calendario-colegio/browser`
   - Responde **Yes** a *"Configure as a single-page app (rewrite all urls to /index.html)"*.
3. Compila y publica:
   ```bash
   npm run build
   firebase deploy
   ```
¡Listo! La URL quedará apuntando a `/1b` y funcionará de inmediato.

---

## 2. ▲ Vercel (Publicación en 1-Clic desde GitHub)

1. Sube este código a un repositorio en **GitHub** o **GitLab**.
2. Ve a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New Project"** e importa tu repositorio `calendario-colegio`.
4. Vercel detectará que es **Angular**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/calendario-colegio/browser`
5. Haz clic en **Deploy**. En 30 segundos tendrás una URL tipo `calendario-1b.vercel.app`.

---

## 3. 🌐 Netlify

1. Sube tu proyecto a GitHub.
2. Ve a [Netlify.com](https://netlify.com) -> **Add new site** -> **Import an existing project**.
3. Selecciona tu repositorio y usa los siguientes parámetros:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/calendario-colegio/browser`
4. Agrega un archivo `public/_redirects` con el siguiente contenido para soportar las rutas como `/1b`:
   ```
   /*    /index.html   200
   ```
5. Haz clic en **Deploy**.

---

## 📲 Progresiva y Mobile-First
Para que los padres tengan la mejor experiencia desde sus teléfonos móviles:
- Pueden guardar la página como **"Añadir a la pantalla de inicio"** en Safari (iOS) o Chrome (Android) y funcionará como una aplicación nativa sin pasar por las tiendas de apps.
