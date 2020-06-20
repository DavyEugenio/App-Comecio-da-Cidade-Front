import { Component, OnInit } from '@angular/core';
import { ProdutoServicoDTO } from '../models/produtoServico.dto';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ProdutoServicoService } from '../services/domain/produtoServico.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageUtilService } from '../services/domain/image-util.service';
import { PhotoService } from '../services/photo.service';
import { API_CONFIG } from '../config/api.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-gerenciar-produto-servico',
  templateUrl: './gerenciar-produto-servico.page.html',
  styleUrls: ['./gerenciar-produto-servico.page.scss'],
})
export class GerenciarProdutoServicoPage implements OnInit {

  produtoServico: ProdutoServicoDTO;
  estabelecimentoID: string;
  edit: boolean = false;
  formGroup: FormGroup;
  image;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoServicoService: ProdutoServicoService,
    public photoService: PhotoService,
    public imageUtils: ImageUtilService,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.estabelecimentoID = getNav.extras.state.estabelecimentoID;
        this.preencherProdutoServico(getNav.extras.state.produtoServicoID);
      } else {
        this.router.navigate(['tabs/profile']);
      }
    });
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      preco: [0.01, [Validators.required]],
      descricao: ['', [Validators.maxLength(120)]]
    }
    );
  }

  ngOnInit() {
  }

  preencherProdutoServico(id: string) {
    this.produtoServicoService.findById(id)
      .subscribe(
        response => {
          this.produtoServico = response;
          this.getImageOfProdutoServicoIfExists();
        },
        error => {
        }
      );
  }

  preencherForm() {
    this.formGroup.controls.nome.setValue(this.produtoServico.nome);
    this.formGroup.controls.preco.setValue(this.produtoServico.preco);
    this.formGroup.controls.descricao.setValue(this.produtoServico.descricao);
  }

  editar() {
    this.edit = true;
    this.preencherForm();
  }

  cancelarEdicao() {
    this.edit = false;
    this.formGroup.reset();
  }

  deletePicture() {
    this.produtoServicoService.deletePicture(this.produtoServico.id)
      .subscribe(response => {
        this.getImageOfProdutoServicoIfExists();
      },
        error => {
        }
      );
  }


  getImageOfProdutoServicoIfExists() {
    this.produtoServicoService.getImageFromServer(this.produtoServico.id)
      .subscribe(response => {
        this.imageUtils.blobToDataURL(response).then(dataUrl => {
          let str: string = dataUrl as string;
          this.image = this.sanitizer.bypassSecurityTrustUrl(str);
        }
        );
      },
        error => {
          this.image = '/assets/img/sem_foto.png';
        }
      );
  }

  public async getCameraPicture() {
    var photo = await this.photoService.getCameraPicture();
    await this.sendPicture(photo);
  }

  sendPicture(picture) {
    this.produtoServicoService.upLoadPicture(picture, this.produtoServico.id)
      .subscribe(response => {
        this.getImageOfProdutoServicoIfExists();
      },
        error => { }
      );
  }

  gerenciarEstabelecimento() {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: this.estabelecimentoID
      }
    };
    this.router.navigate(['tabs/gerenciar-estabelecimento'], dados);
  }

  updateProdutoServico() {
    if (this.formGroup.valid) {
      this.produtoServicoService.update(this.formGroup.value, this.produtoServico.id)
        .subscribe(response => {
          this.showAlertOk('Produto ou serviço atualizado com sucesso');
          this.cancelarEdicao();
          this.preencherProdutoServico(this.produtoServico.id);
        },
          error => { });
    } else {
      this.invalidFieldsAlert();
    }
  }

  delete() {
    this.produtoServicoService.delete(this.produtoServico.id)
      .subscribe(response => {
        this.showAlertOk('Produto ou serviço apagado com sucesso');
        this.gerenciarEstabelecimento();
      },
        error => { });
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
      }
    }
    return s;
  }

  async showAlertOk(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: message,
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  async alertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Está certo em apagar o produto/serviço ' + this.produtoServico.nome + "?",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.delete();
          }
        }
      ]
    });
    await alert.present();
  }
}
