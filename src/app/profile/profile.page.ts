import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/domain/usuario.service';
import { PhotoService } from 'src/app/services/photo.service';

import { UsuarioDTO } from 'src/app/models/usuario.dto';
import { ImageUtilService } from 'src/app/services/domain/image-util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsPage } from '../tabs/tabs.page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  usuario: UsuarioDTO;
  edit: boolean = false;
  image;
  formGroup: FormGroup;
  constructor(
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public photoService: PhotoService,
    public imageUtils: ImageUtilService,
    public sanitizer: DomSanitizer,
    private router: Router,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private tabs: TabsPage) {
    this.image = '/assets/img/user.jpg';
    this.preencherUsuario();
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ionViewDidEnter() {
    this.preencherUsuario();
  }

  preencherForm() {
    this.formGroup.controls.nome.setValue(this.usuario.nome);
    this.formGroup.controls.email.setValue(this.usuario.email);
  }

  async invalidFieldsAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Campos inválidos',
      message: this.listErrors(),
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  private listErrors(): string {
    let s: string = '';
    for (const field in this.formGroup.controls) {
      if (this.formGroup.controls[field].invalid) {
        let value = this.formGroup.controls[field].value;
        let length: number = value.length;
        switch (field) {
          case 'nome':
            if (!value) {
              s = s + '<p><strong>Nome: </strong>Preenchimento obrigatório</p>';
            } else {
              if (length < 4 || length > 120) {
                s = s + '<p><strong>Nome: </strong>O nome deve conter entre 4 e 120 caráteres</p>';
              }
            }
            break;
          case 'email':
            if (!value) {
              s = s + '<p><strong>Email: </strong>Preenchimento obrigatório</p>';
            } else {
              s = s + '<p><strong>Email: </strong>Email inválido</p>';
            }
            break;
          default:
            s = s + '<p><strong>' + field + ': </strong>Valor inválido</p>';
            break;
        }
      }
    }
    return s;
  }

  async showAlertOk() {
    const alert = await this.alertCtrl.create({
      header: 'Usuario alterado',
      message: 'Usuario alterado com sucesso',
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  preencherUsuario() {
    let us = this.storage.getLocalUser();
    if (us && us.email) {
      this.usuarioService.findByEmail(us.email)
        .subscribe(
          response => {
            this.usuario = response;
            this.getImageOfUsuarioIfExists();
          },
          error => {
            if (error.status == 403) {
              this.router.navigate(['tabs/tab2']);
            }
          }
        );
    } else {
      this.router.navigate(['tabs/tab2']);
    }
  }

  gerenciarEstabelecimento(id: number) {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: id
      }
    };
    this.router.navigate(['tabs/gerenciar-estabelecimento'], dados);
  }

  editarPerfil() {
    this.edit = true;
    this.preencherForm();
  }

  async confirmarEdicao() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: '<p>Está certo em alterar seus dados?</p> <p>Obs.: Caso altere seu e-mail terá que fazer o login nomente.</p>',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.editar();
          }
        }
      ]
    });
    await alert.present();
  }

  editar() {
    if (this.formGroup.valid) {
      this.usuarioService.update(this.usuario.id, this.formGroup.value).subscribe(
        response => {
          this.showAlertOk();
          if (this.usuario.email == this.formGroup.controls.email.value) {
            this.preencherUsuario();
            this.cancelarEdicao();
          } else {
            this.sair();
          }
        },
        error => {
        }
      );
    } else {
      this.invalidFieldsAlert();
    }
  }

  cancelarEdicao() {
    this.edit = false;
    this.formGroup.reset();
  }

  sair() {
    this.auth.logout();
    this.tabs.updateButton(false);
    this.router.navigate(['tabs/tab2']);
  }

  getImageOfUsuarioIfExists() {
    this.usuarioService.getImageFromServer(this.usuario.id)
      .subscribe(response => {
        this.imageUtils.blobToDataURL(response).then(dataUrl => {
          let str: string = dataUrl as string;
          this.image = this.sanitizer.bypassSecurityTrustUrl(str);
        }
        );
      },
        error => {
          this.image = '/assets/img/user.jpg';
        }
      );
  }

  public async getCameraPicture() {
    var photo = await this.photoService.getCameraPicture();
    await this.sendPicture(photo);
  }

  sendPicture(picture) {
    this.usuarioService.upLoadPicture(picture)
      .subscribe(response => {
        this.getImageOfUsuarioIfExists();
      },
        error => { }
      );
  }

  deletePicture() {
    this.usuarioService.deletePicture()
      .subscribe(response => {
        this.getImageOfUsuarioIfExists();
      },
        error => {
        }
      );
  }

  addEstabelecimento() {
    this.router.navigate(['tabs/add-estabelecimento']);
  }
}
