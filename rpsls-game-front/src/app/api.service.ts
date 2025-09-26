import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  #http = inject(HttpClient)
  #url = signal(environment.API_URL);


  private socket!: Socket;

  private socketId = signal<any | null>(null);

  public connect(): void {
    this.socket = io(this.#url(), { transports: ['websocket'] });
    this.socket.on('connect', () => {
      this.socketId.set(this.socket.id);
    });
    this.socket.on('disconnect', () => console.log('Socket desconectado'));
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined as any;
      console.log('🔌 Socket foi desconectado manualmente');
    }
  }

  public getSocketIdSignal() {
    return this.socketId.asReadonly();
  }

  // 🔊 escutar atualizações da sala
  public onRoomUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on("roomUpdate", (roomData) => {
        observer.next(roomData);
      });
    });
  }

  public onRoomsUpdate(): Observable<any> {
    return new Observable(observer => {
      if (!this.socket) return;
      this.socket.on("roomsUpdate", (roomData) => {
        observer.next(roomData);
      });
    });
  }

  public joinRoomSocket(roomName: string, playerName: string, avatar: string): void {
    if (!this.socket) return;

    this.socket.emit("joinRoom", { roomName, playerName, avatar });

  }

  public selectCard(room: any, nextPhase : boolean = false, choice?: string ): void {
    if (!this.socket) return;

    this.socket.emit("selectCard", { room, choice, nextPhase });
  }

  public httpListRooms$(): Observable<any> {
    return this.#http.get<any>(`${this.#url()}/room`)
  }
}
