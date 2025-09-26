import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { io, Socket } from 'socket.io-client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-room',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dialog-room.component.html',
  styleUrl: './dialog-room.component.scss'
})
export class DialogRoomComponent implements OnInit {

  #service = inject(ApiService);
  #route = inject(Router)
  private _snackBar = inject(MatSnackBar);

  #dialogRef = inject(MatDialogRef<DialogRoomComponent>);

  public rooms = signal<any>([])
  public playerName: string = '';



  icons: string[] = [
    '🧙‍♂️',
    '😀',
    '😎',
    '🤖',
    '👾',
    '💀',
  ];

  selectedIcon: string = this.icons[0];

  public loading = signal(true);


  statusMap: Record<string, string> = {
    waiting: 'Disponível',
    playing: 'Em andamento',
    finished: 'Finalizado'
  };


  ngOnInit(): void {
    this.#service.connect();
    this.#service.onRoomsUpdate().subscribe({
      next: (roomData) => {
        this.loading.set(true);
        setTimeout(() => {
          this.rooms.set(roomData);
          this.loading.set(false);

        }, 1500)

      },
      error: (error) => {
        this.SnackShowError()
      }
    });

    this.#service.httpListRooms$().subscribe({
      next: (next: any) => {
        this.rooms.set(next)
        this.loading.set(false);
      },
      error: (error) => {
        this.SnackShowError()
      }
    })

  }

  joinRoom(event: any) {
    const body = {
      roomName: event.roomName,
      name: this.playerName,
      avatar: this.selectedIcon
    }
    sessionStorage.setItem('player', JSON.stringify(body));
    this.#route.navigate(['/player', event.roomName])
    this.#dialogRef.close(body);
  }

  roomStatus(status: string): string {
    return this.statusMap[status] || 'Desconhecido';
  }

  SnackShowError() {
    this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        panelClass: ['white-snackbar'],
        data: { status: 'error', message: 'Error na requisição' }
      });
  }

  closeModal() {
    this.#dialogRef.close(false);
  }

}
