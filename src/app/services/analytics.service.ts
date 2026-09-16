import { Injectable, signal } from '@angular/core';
import { db, database } from '../config/firebase.config';
import { doc, onSnapshot, updateDoc, setDoc, getDoc, increment } from 'firebase/firestore';
import { ref, onValue, onDisconnect, set, push } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  readonly totalVisits = signal<number>(0);
  readonly activeUsers = signal<number>(0);

  private initialized = false;

  constructor() {}

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    this.initVisitsCounter();
    this.initPresence();
  }

  private async initVisitsCounter(): Promise<void> {
    const statsRef = doc(db, 'estadisticas', 'general');

    try {
      // Intentar actualizar el contador
      const docSnap = await getDoc(statsRef);
      if (docSnap.exists()) {
        await updateDoc(statsRef, {
          totalVisits: increment(1)
        });
      } else {
        // Si no existe, inicializar en 1
        await setDoc(statsRef, {
          totalVisits: 1
        });
      }
    } catch (err) {
      console.warn('Error incrementando contador de visitas:', err);
    }

    // Escuchar el contador en tiempo real
    onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.totalVisits.set(data['totalVisits'] || 0);
      }
    }, (err) => {
      console.warn('Error escuchando visitas:', err);
    });
  }

  private initPresence(): void {
    // Referencia al nodo donde se guardan las conexiones activas
    const listRef = ref(database, 'active_users');
    
    // Referencia que indica si estamos conectados a Firebase (provista por Firebase mismo)
    const connectedRef = ref(database, '.info/connected');

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // Creamos una referencia única para este usuario/sesión
        const myConnectionRef = push(listRef);

        // Cuando nos desconectemos, borrar nuestro registro
        onDisconnect(myConnectionRef).remove().then(() => {
          // Mientras estemos conectados, escribir true
          set(myConnectionRef, true);
        });
      }
    });

    // Escuchar la cantidad total de usuarios activos
    onValue(listRef, (snap) => {
      if (snap.exists()) {
        const users = snap.val();
        const count = Object.keys(users).length;
        this.activeUsers.set(count);
      } else {
        this.activeUsers.set(0);
      }
    });
  }
}
