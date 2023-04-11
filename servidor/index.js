const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

//Guarda en la variable app la funcion de express
const app = express();
// Configurar el servidor HTTP
const server = http.createServer(app);
/**crea un servidor de Socket.io que escucha en el mismo puerto que el
 *  servidor HTTP de Express.
 * */
const io = socketIO(server, {
    /**se configura el cors (Cross-Origin Resource Sharing) 
     * para permitir solicitudes desde cualquier origen (origin: true)
     * para permitir el envío de credenciales (credentials: true). 
     * se especifican los métodos HTTP permitidos (methods: ['GET', 'POST']) */
    cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST']
    }
});


/**Configurar un arreglo para almacenar los usuarios conectados
 * en el caso de no usar una base de datos
*/
const usuariosConectados = [];

// Escuchar el evento 'connection' cuando un cliente se conecta
/**connection es el nombre del evento a escuchar
 * socket representa la conexion entre el servidor y el cliente
 * y es un callback que se ejecuta cuando se produce el evento connection */
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('verUsuarios', () => {
        io.emit('usuarios-conectados', usuariosConectados);
    });

    socket.on('usuario-conectado', (nombreUsuario) => {
        console.log(`El usuario ${nombreUsuario} se ha conectado`);

        // Agregar el usuario a la lista de usuarios conectados
        usuariosConectados.push({
            /**id hace referencia al identificador único del socket 
             * que acaba de conectarse al servidor. Este identificador 
             * es proporcionado por el paquete socket.io y se puede acceder 
             * a él a través de la propiedad id del objeto socket. */
            id: socket.id,
            /**nombre hace referencia al nombre de usuario que ha proporcionado 
             * el cliente al conectarse al chat. Este nombre se ha pasado como 
             * parámetro en el evento 'usuario-conectado'. */
            nombre: nombreUsuario
        });

        /**Emitir el evento 'usuarios-conectados' a todos los clientes conectados
         * al servidor.
         * Cada cliente que esté conectado al servidor y tenga un manejador de eventos 
         * para el evento usuarios-conectados recibirá la lista actualizada de usuarios 
         * conectados y podrá utilizarla para mostrarla en su interfaz de usuario
        */
        io.emit('usuarios-conectados', usuariosConectados);

        // Emitir el evento 'mensaje-sistema' a todos los clientes conectados
        const mensajeSistema = {
            usuario: 'Sistema',
            mensaje: `${nombreUsuario} se ha unido al chat`
        };
        io.emit('mensaje-sistema', mensajeSistema);
    });

    // Escuchar el evento 'nuevo-mensaje' cuando un cliente envía un mensaje
    socket.on('nuevo-mensaje', (mensaje) => {
        // Encontrar el usuario que envió el mensaje a traves del ID del socket que lo emitió
        if(mensaje){
            const usuario = usuariosConectados.find(u => u.id === socket.id);
            /**Crea objeto mensajeChat que contiene el nombre del usuario que
             * envio el mensaje y el mensaje en si recibido por parametro
             */

            if(usuario){
                const mensajeChat = {
                    usuario: usuario.nombre,
                    mensaje: mensaje
                };
                // Emitir el evento 'mensaje' a todos los clientes conectados
                io.emit('mensaje', mensajeChat);
            }
        }
    });

    // Escuchar el evento 'disconnect' cuando un cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
        // Encontrar el usuario de la lista de usuarios conectados y almacenar en usuarioDesconectado
        const usuarioDesconectado = usuariosConectados.find(u => u.id === socket.id);
        /**La variable usuarioDesconectado es el objeto del usuario que se ha desconectado
         * y que se va a eliminar de la lista usuariosConectados.
         * El método indexOf se utiliza para encontrar la posición del
         * objeto usuarioDesconectado en el arreglo usuariosConectados.
         *El método splice se utiliza para eliminar el objeto de la lista.
         *
         *El primer argumento del método splice indica la posición del elemento a eliminar en el arreglo. 
         *El segundo argumento indica el número de elementos que se van a eliminar a partir de esa posición. 
         *En este caso, se va a eliminar solo un elemento, que es el usuario que se ha desconectado. */
        if(usuarioDesconectado){
            usuariosConectados.splice(usuariosConectados.indexOf(usuarioDesconectado), 1);

            // Emitir el evento 'usuarios-conectados' a todos los clientes conectados
            io.emit('usuarios-conectados', usuariosConectados);
            // Emitir el evento 'mensaje-sistema' a todos los clientes conectados
            const mensajeSistema = {
                usuario: 'Sistema',
                mensaje: `${usuarioDesconectado.nombre} se ha desconectado`
            };
            io.emit('mensaje-sistema', mensajeSistema);
        }
    });
});

// Iniciar el servidor HTTP
server.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});