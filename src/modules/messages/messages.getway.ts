import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ContentType } from 'src/helpers/constant';
import { MessagesService } from './messages.service';
import { InputAttachment } from './dto/input';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store userId-socket mappings
  private userSockets: Map<string, string> = new Map();

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect();
      console.error('Authorization token is missing');
      return;
    }

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      client['user'] = payload; // Store the user info in the socket instance
      const userId = payload.id;
      this.userSockets.set(userId, client.id); // Map userId to socket
      client.join(userId);
      this.server.to(userId).emit('userOnlineStatus', { id: userId, is_online: true });
    } catch (error) {
      console.log('\n--- ~ MessagesGateway ~ handleConnection ~ error::\n', error);
      client.emit('error', 'Invalid authorization token');
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client['user'];
    if (user) {
      this.userSockets.delete(user.id); // Remove user from map
      client.leave(client.id);
      console.log(`User disconnected: ${client.id}`); 
      this.server.to(user.id).emit('userOnlineStatus', { id: user.id, is_online: false });
    }
  }
  // Event handler for receiving a message and broadcasting it to the receiver
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    message: {
      id: string;
      content?: string;
      receiver_id: string;
      content_type: ContentType;
      attachments?: InputAttachment[];
    },
  ) {
    const sender_id = client['user'].id;

    const { id, content = '', receiver_id, content_type, attachments } = message;

    console.log('\n--- ~ MessagesGateway ~ handleSendMessage ~ offer_id::\n', id);

    if (!id) {
      return client.emit('error', 'ID are required.');
    }
    if (!receiver_id) {
      return client.emit('error', 'Receiver ID are required.');
    }
    if (sender_id === receiver_id) {
      return client.emit('error', 'sender_id & receiver_id can not be same');
    }

    const files = attachments && attachments.length > 0 ? attachments : [];

    try {
    
      // Broadcast the message to the receiver via their socket room
      this.server.to(receiver_id).emit('receiveMessage', {
        content: "",
        offer_id: "",
        sender_id: "",
        receiver_id: "",
        content_type: "",
        message_id: "",
        attachments:  [],
        created_at: "",
      });

      // Notify the sender that the message was sent
      client.emit('messageSent', {
        content: "",
        offer_id: "",
        sender_id: "",
        receiver_id: "",
        content_type: "",
        message_id: "",
        attachments:  [],
        created_at: "",
      });

    } catch (error) {
      console.error('Error sending message:', error?.message || error);
      return client.emit('error', 'An unexpected error occurred while sending the message.');
    }
  }

}
