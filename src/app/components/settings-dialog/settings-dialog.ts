import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './settings-dialog.html',
  styleUrls: ['./settings-dialog.css']
})
export class SettingsDialog {
  selectedTime: string = '19:00'; // Default 7 PM
  isSaving = false;
  
  private dialogRef = inject(MatDialogRef<SettingsDialog>);
  private pushService = inject(PushNotificationService);

  async saveSettings() {
    this.isSaving = true;
    
    // Guardamos en localstorage por conveniencia
    localStorage.setItem('notificationTime', this.selectedTime);
    
    // Suponiendo que el grupo es 1B por ahora, luego se puede dinamizar
    const grupo = localStorage.getItem('selectedGroup') || '1B';

    // Pedir permiso y suscribir
    const success = await this.pushService.subscribeToNotifications(grupo, this.selectedTime);
    
    this.isSaving = false;
    if (success) {
      this.dialogRef.close(true);
    } else {
      alert("No se pudo activar las notificaciones. Verifica que tu navegador lo permita y que estés usando HTTPS.");
      this.dialogRef.close(false);
    }
  }
}
