import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private rxStomp: RxStomp;

  constructor() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: environment.wsUrl,
      reconnectDelay: 200,
    });
  }

  connect(): void {
    this.rxStomp.activate();
  }

  disconnect(): void {
    this.rxStomp.deactivate();
  }

  watch(destination: string) {
    return this.rxStomp.watch(destination);
  }

  publish(destination: string, body: any): void {
    this.rxStomp.publish({
      destination: destination,
      body: JSON.stringify(body),
    });
  }
}

// Note: Ensure 'wsUrl' is added to your environment.ts and environment.prod.ts files.
// Example: wsUrl: 'ws://localhost:8080/ws'
