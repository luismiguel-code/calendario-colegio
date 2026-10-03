import { Injectable, inject } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

// VAPID KEY estándar para Web Push (Independiente de FCM)
const VAPID_PUBLIC_KEY = "BHyYnbHh0n6C4rNAAG6eGT12_YfWR0FLmZNtPHp-PIh99sAgBZqO1f3CEnTTsR9cD8Ijud8EAwtEb7qcz4okMNo";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private swPush = inject(SwPush);
  private db = db;

  constructor() { }

  /**
   * Pide permiso al usuario para notificaciones, genera el token Push
   * y lo guarda en Firestore junto con el horario elegido.
   */
  async subscribeToNotifications(grupo: string, time: string): Promise<boolean> {
    try {
      if (!this.swPush.isEnabled) {
        console.warn("Service Worker o Push Notifications no están soportados.");
        return false;
      }

      // 1. Pedir permiso y obtener suscripción Web Push
      const pushSubscription = await this.swPush.requestSubscription({
        serverPublicKey: VAPID_PUBLIC_KEY
      });

      // 2. Guardar en Firestore
      // Usamos el endpoint de la suscripción (que es único) como ID del documento
      const subJSON = pushSubscription.toJSON();
      const docId = btoa(subJSON.endpoint || '').slice(0, 50); // ID seguro

      await setDoc(doc(this.db, 'pushSubscriptions', docId), {
        subscription: subJSON,
        grupo: grupo,
        preferredTime: time,
        createdAt: new Date().toISOString()
      });

      console.log('Suscripción guardada exitosamente en Firestore');
      return true;

    } catch (error) {
      console.error('Error al suscribirse a las notificaciones', error);
      return false;
    }
  }
}
