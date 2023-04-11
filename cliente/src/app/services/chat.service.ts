import { Injectable } from '@angular/core';
/** un "observable" es una fuente de datos que emite valores a 
 * lo largo del tiempo. Puedes pensar en un observable como una 
 * corriente de datos que fluye continuamente. Los observables 
 * son muy útiles para trabajar con eventos asíncronos en Angular, 
 * como las respuestas de una API o las interacciones del usuario. 
 * Puedes suscribirte a un observable para recibir sus valores y actuar 
 * en consecuencia, ya sea actualizando la vista o realizando otras tareas.
 * En resumen, los observables son una herramienta fundamental para manejar 
 * datos asíncronos en aplicaciones Angular. */
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  MensajesService = new BehaviorSubject<any[]>([]);
  ConectadosService = new BehaviorSubject<any[]>([]);

  constructor(private socket: SocketService, private toastr: ToastrService) {

    this.socket.io.on('mensaje', (mensajeChat: any) => {
      this.MensajesService.next([...this.MensajesService.getValue(), mensajeChat])
    });

    this.socket.io.on('usuarios-conectados', (usuariosConectados: any) => {
      this.ConectadosService.next(usuariosConectados);
    });

    this.socket.io.on('mensaje-sistema', (mensajeSistema: any) => {
      this.toastr.success(mensajeSistema.usuario, mensajeSistema.mensaje);
    });
  }

  public verUsuarios(){
    this.socket.io.emit('verUsuarios')
  }

  public usuario_conectado (nombreUsuario: String){
    this.socket.io.emit('usuario-conectado', nombreUsuario);
  }

  public nuevo_mensaje (mensaje: String){
    this.socket.io.emit('nuevo-mensaje', mensaje);
  }

}