import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  activo: boolean = true;

  usuariosConectados: any;
  mensajes: any = [];

  nombreUsuario: String = '';
  mensaje: String = '';

  constructor(private chat: ChatService) {
    this.chat.ConectadosService.subscribe((ConectadosService) => {
      this.usuariosConectados = ConectadosService;
    });

    this.chat.MensajesService.subscribe((MensajesService) => {
      this.mensajes = MensajesService;
    });
  }

  conectar() {
    if (this.nombreUsuario != '') {
      this.chat.usuario_conectado(this.nombreUsuario);
      this.activo = false;
    } else {
      alert('ERROR');
    }
  }

  enviarMensaje() {
    if (this.mensaje.trim() !== '') {
      
      this.chat.nuevo_mensaje(this.mensaje);
      this.mensaje = '';
    }
  }
}
