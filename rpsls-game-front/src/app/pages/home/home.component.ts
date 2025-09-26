import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { DialogRoomComponent } from '../../components/dialog-room/dialog-room.component';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  #dialog = inject(MatDialog);
  #service = inject(ApiService);

  openDialog() {
    const dialogRef = this.#dialog.open(DialogRoomComponent, {
    data: { animal: 'panda' },
  });

  dialogRef.afterClosed().subscribe(roomData => {
    if(roomData) {
      this.#service.joinRoomSocket(roomData.roomName, roomData.name, roomData.avatar)
    }
  });
  }

}
