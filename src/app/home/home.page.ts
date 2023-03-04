import { Component, OnInit } from '@angular/core';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@awesome-cordova-plugins/file-transfer/ngx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // audio = 'https://servicios-au.s3.amazonaws.com/AAK046.mp3?AWSAccessKeyId=AKIA4EEOX66KEBXUG3XJ&Expires=1677168601&Signature=Np6Jel6EfTm3NVXZEHmKMXQdZPs%3D'
  audio = ''
  status = ''
  audioFile!: MediaObject
  fileTransfer!: FileTransferObject;


  constructor(
    private media: Media,
    private file: File,
    private transfer: FileTransfer,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.fileTransfer = this.transfer.create();
    this.http.get('http://192.168.20.20:3000/servicios-v2/ABC123').subscribe({
      next: (data: any) => {
        console.log({ data })
        this.audio = data.servicio.url
      },
      error: (error: any) => {
        console.log({ error })
      },
    })
  }

  RecordAudio() {

    this.audioFile = this.media.create(this.file.applicationStorageDirectory + 'audiofile.mp3')
    this.audioFile.release()

    this.audioFile.startRecord()
    this.status = 'recording...'
  }

  StopRecording() {
    this.audioFile.stopRecord()
    console.log("🚀 ~ file: home.page.ts:31 ~ HomePage ~ StopRecording ~ audioFile", this.audioFile)

    this.status  ='stopped'
  }

  PauseRecording() {
    this.audioFile.pauseRecord()
    console.log("🚀 ~ file: home.page.ts:31 ~ HomePage ~ StopRecording ~ audioFile", this.audioFile)

    this.status  ='pause'
  }

  ReanudingRecord() {
    this.audioFile.resumeRecord()
    this.status = 'Continue... record'
  }

  play() {
    console.log("🚀 ~ file: home.page.ts:37 ~ HomePage ~ play ~ play before")
    console.log({
      'this.audioFile': this.audioFile
    })
    this.audioFile.play()
    console.log("🚀 ~ file: home.page.ts:37 ~ HomePage ~ play ~ play")


  }

  async enviar() {

    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'AAK046.mp3',
      // headers: {
      //   'x-token': this.token,
      // },
    };


    try {
      console.log({ try: 'try', options })
      const respuestaSubirImagen = await this.fileTransfer.upload(
        this.file.applicationStorageDirectory + 'audiofile.mp3',
        'http://192.168.20.20:3000/' + 'servicios-v2/editar/subir-imagen',
        options
      );

      console.log({ respuestaSubirImagen })

      console.log({mensaje: 'Servicio Creado'});

      // this.router.navigate(['detalle-reparacion/' + codigo]);

    } catch (error) {
      console.log({ funcion: 'Subiendo Imagen', error });
      console.log({mensaje: 'ERROR SUBIENDO IMAGEN'});
    }
  }

}
