import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../services/domain/categoria.service';
import { EstabelecimentoService } from '../services/domain/estabelecimento.service';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../services/domain/usuario.service';
import { UsuarioDTO } from '../models/usuario.dto';
import { PhotoService } from '../services/photo.service';
import { ImageUtilService } from '../services/domain/image-util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoriaDTO } from '../models/categoria.dto';
import { CidadeDTO } from '../models/cidade.dto';
import { CidadeService } from '../services/domain/cidade.service';

@Component({
  selector: 'app-add-estabelecimento',
  templateUrl: './add-estabelecimento.page.html',
  styleUrls: ['./add-estabelecimento.page.scss'],
})
export class AddEstabelecimentoPage {

  formGroup: FormGroup;
  usuario: UsuarioDTO;
  categorias: CategoriaDTO[];
  image;
  photo: string = null;
  cidades: CidadeDTO[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private estabelecimentoService: EstabelecimentoService,
    public cidadeService: CidadeService,
    private storage: StorageService,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public usuarioService: UsuarioService,
    public photoService: PhotoService,
    public imageUtils: ImageUtilService,
    public sanitizer: DomSanitizer) {
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      cnpj: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      instagram: ['', []],
      facebook: ['', []],
      site: ['', []],
      horario: ['', [Validators.required]],
      categorias: ['', [Validators.required, Validators.maxLength(2)]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', []],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidadeId: ['', [Validators.required]],
      usuarioId: ['', []],
      telefone1: ['', [Validators.required]],
      telefone2: ['', []],
      telefone3: ['', []]
    });
  }

  ionViewDidEnter() {
    let us = this.storage.getLocalUser();
    if (us && us.email) {
      this.usuarioService.findByEmail(us.email)
        .subscribe(
          response => {
            this.usuario = response;
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
    this.image = '/assets/img/sem_foto.png';
    this.categoriaService.findAll().subscribe(
      response => {
        this.categorias = response;
      }
    );
    this.cidades = this.cidadeService.findAll();
  }

  public async getCameraPicture() {
    var photo = await this.photoService.getCameraPicture();
    let picutreBlob = await this.imageUtils.dataUriToBlob(photo);
    this.imageUtils.blobToDataURL(picutreBlob).then(dataUrl => {
      let str: string = dataUrl as string;
      this.image = this.sanitizer.bypassSecurityTrustUrl(str);
    }
    );
    this.photo = photo;
  }

  removeImage() {
    this.photo = null;
    this.image = '/assets/img/sem_foto.png';
  }

  sendPicture(id) {
    this.estabelecimentoService.upLoadPicture(this.photo, id)
      .subscribe(response => {
      },
        error => { }
      );
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
        s = s + '<p><strong>' + field + ': </strong>Valor inválido</p>';
        if (field == 'categorias' && this.formGroup.controls.categorias.value != null) {
          if (this.formGroup.controls[field].value.length > 2) {
            s = s + '<p><strong>' + field + ': </strong>Máximo de 2 categorias</p>';
          }
        }
      }
    }
    return s;
  }

  addEstabelecimento() {
    this.formGroup.controls.usuarioId.setValue(this.usuario.id);
    if (this.formGroup.valid) {
      let cats: string = '';
      cats = this.formGroup.controls.categorias.value[0];
      if (this.formGroup.controls.categorias.value[1] != null) {
        cats = cats + "," + this.formGroup.controls.categorias.value[1];
      }
      this.formGroup.controls.categorias.setValue(cats);
      console.log(this.formGroup.value);
      this.estabelecimentoService.insert(this.formGroup.value)
        .subscribe(response => {
          if (this.photo != null) {
            this.sendPicture(response.body);
          }
          this.formGroup.reset();
          this.removeImage();
          this.showInsertOk();
          this.router.navigate(['tabs/profile']);
        },
          error => {
            this.formGroup.controls.categorias.setValue(null);
          });
    } else {
      this.invalidFieldsAlert();
    }
  }

  async showInsertOk() {
    const alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Estabelecimento cadastrado',
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  cancelar() {
    this.formGroup.reset();
    this.removeImage();
    this.router.navigate(['tabs/profile']);
  }

  profile() {
    this.router.navigate(['tabs/profile']);
  }
}
