import { Injectable } from '@angular/core';
import {
  Plugins, CameraResultType, CameraPhoto, CameraSource
} from '@capacitor/core';

const { Camera } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  public async getCameraPicture() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
      promptLabelHeader: 'Selecionar fonte',
      promptLabelPhoto: 'Galeria',
      promptLabelPicture: 'Camera',
    });

    return await this.readAsBase64(capturedPhoto);
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}