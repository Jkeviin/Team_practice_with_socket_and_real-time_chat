import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public io: Socket;
  private readonly URL = 'http://localhost:3000'
  constructor() {
    this.io = io(this.URL, {
      withCredentials: true,
      autoConnect: true
    });
  }
}
