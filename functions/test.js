const admin = require('firebase-admin');
const webpush = require('web-push');

// Configuración VAPID (Las mismas de index.js)
const VAPID_PUBLIC_KEY = "BHyYnbHh0n6C4rNAAG6eGT12_YfWR0FLmZNtPHp-PIh99sAgBZqO1f3CEnTTsR9cD8Ijud8EAwtEb7qcz4okMNo";
const VAPID_PRIVATE_KEY = "B2IkelbIPNBPfNRixVr9xGFedlTfk2EBnrys3GFejpE";

webpush.setVapidDetails(
  'mailto:contacto@colegio.edu.co',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Inicializa Firebase Admin usando tus credenciales de CLI
admin.initializeApp();
const db = admin.firestore();

async function testPush() {
  console.log("Buscando suscripciones en Firestore...");
  const snapshot = await db.collection('pushSubscriptions').get();
  
  if (snapshot.empty) {
    console.log("❌ No hay ninguna suscripción guardada. Ve a localhost:4200, dale a la campanita y suscríbete primero.");
    return;
  }

  console.log(`✅ Se encontraron ${snapshot.size} suscripciones. Enviando notificación de prueba...`);

  const payload = JSON.stringify({
    notification: {
      title: '🗓️ Prueba Real',
      body: '¡Esta es una prueba desde el backend Node.js!',
      icon: '/assets/icons/icon-192x192.png'
    }
  });

  let successCount = 0;
  for (const doc of snapshot.docs) {
    const sub = doc.data().subscription;
    try {
      await webpush.sendNotification(sub, payload);
      successCount++;
    } catch (e) {
      console.error(`❌ Falló una (puede estar expirada): ${e.message}`);
    }
  }

  console.log(`🎉 Se enviaron ${successCount} notificaciones correctamente al navegador.`);
}

testPush();
