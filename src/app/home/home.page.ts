import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Share } from '@capacitor/share';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonTextarea, IonButton, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonNote, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shareSocialOutline, chatbubbleEllipsesOutline, linkOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonTextarea, IonButton, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonNote, IonToast]
})
export class HomePage {
  modo: 'texto' | 'enlace' | 'contacto' = 'texto';
  mensaje = '¡Hola! Este mensaje fue compartido desde Compartir Fácil.';
  enlace = 'https://ionicframework.com';
  nombre = 'Universidad Autónoma de Asunción';
  correo = 'contacto@ejemplo.com';
  aviso = '';
  mostrarAviso = false;

  constructor() {
    addIcons({ shareSocialOutline, chatbubbleEllipsesOutline, linkOutline, personOutline });
  }

  async compartir() {
    let text = '';
    let url: string | undefined;

    if (this.modo === 'texto') {
      text = this.mensaje.trim();
      if (!text) return this.notificar('Escribí un texto para compartir.');
    } else if (this.modo === 'enlace') {
      const entrada = this.enlace.trim();
      try {
        const parsed = new URL(entrada);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Protocolo inválido');
        url = parsed.toString();
      } catch {
        return this.notificar('Ingresá un enlace válido que empiece con https://');
      }
      text = 'Te comparto este enlace:';
    } else {
      const nombre = this.nombre.trim();
      const correo = this.correo.trim();
      if (!nombre || !correo) return this.notificar('Completá el nombre y el correo.');
      text = `Contacto: ${nombre}
Correo: ${correo}`;
    }

    try {
      await Share.share({ title: 'Compartir Fácil', text, ...(url ? { url } : {}), dialogTitle: 'Compartir mediante' });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      if (!/cancel|dismiss/i.test(mensaje)) this.notificar('No se pudo abrir el menú para compartir.');
    }
  }

  notificar(mensaje: string) {
    this.aviso = mensaje;
    this.mostrarAviso = true;
  }
}
