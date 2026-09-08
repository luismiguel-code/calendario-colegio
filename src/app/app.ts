import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NavbarComponent } from './components/navbar/navbar.component';
import { CalendarService } from './services/calendar.service';
import { AddActivityDialogComponent } from './components/add-activity-dialog/add-activity-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    MatDialogModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  calendarService = inject(CalendarService);
  private dialog = inject(MatDialog);

  openAddModal(): void {
    const group = this.calendarService.activeGroup();
    const dateStr = this.calendarService.selectedDate();

    const dialogRef = this.dialog.open(AddActivityDialogComponent, {
      width: '90%',
      maxWidth: '520px',
      data: {
        groupId: group.id,
        groupName: group.nombre,
        initialDate: dateStr
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.calendarService.addActivity(res);
      }
    });
  }
}
