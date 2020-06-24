import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ProdutoServicoService } from '../services/domain/produtoServico.service';
import { ProdutoServicoDTO } from '../models/produtoServico.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ImageUtilService } from '../services/domain/image-util.service';
import { PhotoService } from '../services/photo.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-produto-servico',
  templateUrl: './add-produto-servico.page.html',
  styleUrls: ['./add-produto-servico.page.scss'],
})
export class AddProdutoServicoPage implements OnInit {

  produtoServico: ProdutoServicoDTO;
  estabelecimentoID: string;
  formGroup: FormGroup;
  image;
  photo: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private produtoServicoService: ProdutoServicoService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public photoService: PhotoService,
    public imageUtils: ImageUtilService,
    public sanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.estabelecimentoID = getNav.extras.state.estabelecimentoID;
      } else {
        this.router.navigate(['tabs/profile']);
      }
    });
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      preco: [0.01, [Validators.required]],
      descricao: ['', [Validators.maxLength(120)]],
      estabelecimentoId: [this.estabelecimentoID]
    }
    );
    this.image = '/assets/img/sem_foto.png';
  }

  ngOnInit() {
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

  addProdutoServico() {
    this.formGroup.controls.estabelecimentoId.setValue(this.estabelecimentoID);
    let preco = this.formGroup.controls.preco.value;
    if (!preco) {
      preco = 0;
    }
    if (this.formGroup.valid && preco >= 0.01) {
      this.produtoServicoService.insert(this.formGroup.value)
        .subscribe(response => {
          if (this.photo != null) {
            this.sendPicture(response.body);
          }
          this.formGroup.reset();
          this.removeImage();
          this.showInsertOk();
        },
          error => {
          }
        );
    } else {
      this.invalidFieldsAlert();
    }
  }

  sendPicture(id) {
    this.produtoServicoService.upLoadPicture(this.photo, id)
      .subscribe(response => {
      },
        error => { }
      );
  }

  async showInsertOk() {
    let alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Produto adicionado com sucesso!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.gerenciarEstabelecimento();
          }
        }
      ]
    });
    await alert.present();
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
      let value = this.formGroup.controls[field].value;
      if (value == null) {
        value = '';
      }
      if (this.formGroup.controls[field].invalid || field == 'preco' && value < 0.01) {
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
          case 'preco':
            if (length == 0) {
              s = s + '<p><strong>Preço: </strong>Preenchimento obrigatório</p>';
            } else {
              if (value < 0.01) {
                s = s + '<p><strong>Preço: </strong>Mínimo de R$0,01</p>';
              }
            }
            break;
          case 'descricao':
            if (length > 120) {
              s = s + '<p><strong>Descrição: </strong>A descrição deve conter no máximo 120 carácteres</p>';
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

  gerenciarEstabelecimento() {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: this.estabelecimentoID
      }
    };
    this.router.navigate(['tabs/gerenciar-estabelecimento'], dados);
  }
}
