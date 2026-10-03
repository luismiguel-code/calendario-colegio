const functions = require('firebase-functions');
const admin = require('firebase-admin');
const webpush = require('web-push');
const { DateTime } = require('luxon');

admin.initializeApp();
const db = admin.firestore();

// VAPID keys for standard Web Push
const VAPID_PUBLIC_KEY = "BHyYnbHh0n6C4rNAAG6eGT12_YfWR0FLmZNtPHp-PIh99sAgBZqO1f3CEnTTsR9cD8Ijud8EAwtEb7qcz4okMNo";
const VAPID_PRIVATE_KEY = "B2IkelbIPNBPfNRixVr9xGFedlTfk2EBnrys3GFejpE";

webpush.setVapidDetails(
  'mailto:contacto@colegio.edu.co',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Tarea programada que se ejecuta al inicio de cada hora, SOLO de Domingo a Jueves (0-4)
exports.scheduledPushNotification = functions.pubsub
  .schedule('0 * * * 0-4')
  .timeZone('America/Bogota')
  .onRun(async (context) => {
    
    // 1. Obtener la hora actual y la fecha de mañana en Bogotá
    const nowBogota = DateTime.now().setZone('America/Bogota');
    const currentHourString = nowBogota.toFormat('HH:00');
    
    const tomorrowBogota = nowBogota.plus({ days: 1 });
    const tomorrowString = tomorrowBogota.toFormat('yyyy-MM-dd'); // Formato: YYYY-MM-DD

    console.log(`Ejecutando Cron Job. Hora: ${currentHourString}, Mañana es: ${tomorrowString}`);

    try {
      // 2. Buscar las suscripciones de los padres para esta hora
      const snapshotSubs = await db.collection('pushSubscriptions')
        .where('preferredTime', '==', currentHourString)
        .get();

      if (snapshotSubs.empty) {
        console.log('No hay notificaciones programadas para esta hora.');
        return null;
      }

      // 3. Buscar TODAS las actividades y tareas programadas para el día de mañana
      const activitiesSnap = await db.collection('activities')
        .where('fecha', '==', tomorrowString)
        .get();
        
      // Organizar actividades por grupo
      const activitiesByGroup = {};
      activitiesSnap.forEach(doc => {
        const act = doc.data();
        const grupo = (act.grupoId || 'general').toLowerCase();
        
        if (!activitiesByGroup[grupo]) {
          activitiesByGroup[grupo] = { tareas: 0, eventos: 0 };
        }
        
        if (act.categoria === 'tarea' || act.categoria === 'examen' || act.categoria === 'materiales') {
          activitiesByGroup[grupo].tareas++;
        } else {
          activitiesByGroup[grupo].eventos++;
        }
      });

      const promises = [];

      // 4. Enviar notificación personalizada a cada suscripción
      snapshotSubs.forEach(docSub => {
        const data = docSub.data();
        const pushSubscription = data.subscription;
        const grupoPadre = (data.grupo || '1b').toLowerCase();
        
        let titulo = '🗓️ Recordatorio del Colegio';
        let cuerpo = 'Recuerda revisar el calendario de mañana para ver el uniforme.';
        
        const acts = activitiesByGroup[grupoPadre];
        if (acts) {
          if (acts.tareas > 0 && acts.eventos > 0) {
            titulo = '⚠️ Calendario: Tareas y Uniforme';
            cuerpo = `Para mañana hay ${acts.tareas} tarea(s) y ${acts.eventos} evento(s). ¡Ingresa para ver los detalles y el uniforme que toca!`;
          } else if (acts.tareas > 0) {
            titulo = '📚 Calendario: Tareas y Uniforme';
            cuerpo = `Para mañana hay ${acts.tareas} tarea(s) pendiente(s). ¡Ingresa para ver los detalles y el uniforme que toca!`;
          } else if (acts.eventos > 0) {
            titulo = '🎈 Calendario: Eventos y Uniforme';
            cuerpo = `Para mañana hay ${acts.eventos} evento(s). ¡Ingresa para ver de qué se trata y el uniforme que toca!`;
          }
        }

        const payload = JSON.stringify({
          notification: {
            title: titulo,
            body: cuerpo,
            icon: '/assets/icons/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: { url: `/${grupoPadre}` } // Redirigir al grupo correcto
          }
        });
        
        // Enviamos la notificación vía Web Push
        const p = webpush.sendNotification(pushSubscription, payload)
          .catch(err => {
            console.error(`Error enviando notificación al doc ${docSub.id}`, err);
            // Si el token expiró, lo borramos
            if (err.statusCode === 410 || err.statusCode === 404) {
              return docSub.ref.delete();
            }
          });
        
        promises.push(p);
      });

      await Promise.all(promises);
      console.log(`Se enviaron ${promises.length} notificaciones correctamente.`);
      
    } catch (error) {
      console.error('Error procesando las notificaciones programadas:', error);
    }
    
    return null;
  });
