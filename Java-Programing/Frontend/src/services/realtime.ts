import { Client, type IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type JobEvent = {
  type: string;
  jobId: string;
  createdAt: string;
};

export const connectJobRealtime = (
  onEvent: (event: JobEvent) => void
): { client: Client; disconnect: () => void } => {
  const socketUrl =
    (import.meta as any).env?.VITE_BACKEND_WS_URL ?? "http://localhost:8081/ws";

  const client = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    reconnectDelay: 2000,
    debug: () => {},
    onConnect: () => {
      client.subscribe("/topic/recruitment", (message: IMessage) => {
        if (!message.body) return;
        try {
          const event = JSON.parse(message.body) as JobEvent;
          if (event?.type) onEvent(event);
        } catch {
          // ignore malformed messages
        }
      });
    },
    onStompError: () => {
      // ignore for now; UI can remain functional with normal REST fetching
    },
  });

  client.activate();

  return {
    client,
    disconnect: () => {
      try {
        client.deactivate();
      } catch {
        // ignore
      }
    },
  };
};
