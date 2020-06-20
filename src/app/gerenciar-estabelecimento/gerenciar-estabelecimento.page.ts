import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { EstabelecimentoDTO } from 'src/app/models/estabelecimento.dto';
import { EnderecoDTO } from 'src/app/models/endereco.dto';
import { CidadeDTO } from 'src/app/models/cidade.dto';
import { EstabelecimentoService } from 'src/app/services/domain/estabelecimento.service';
import { PhotoService } from 'src/app/services/photo.service';
import { CidadeService } from 'src/app/services/domain/cidade.service';
import { API_CONFIG } from 'src/app/config/api.config';
import { ProdutoServicoService } from '../services/domain/produtoServico.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ImageUtilService } from '../services/domain/image-util.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gerenciar-estabelecimento',
  templateUrl: './gerenciar-estabelecimento.page.html',
  styleUrls: ['./gerenciar-estabelecimento.page.scss'],
})
export class GerenciarEstabelecimentoPage {
  sliderOpts = {
    zoom: false,
    slidesPerView: 4,
    centeredSlides: false,
    spaceBeetween: 10
  };
  estabelecimento: EstabelecimentoDTO;
  edit: boolean = false;
  editEndereco: boolean = false;
  formEstabelecimento: FormGroup;
  formEndereco: FormGroup;
  image;
  cidades: CidadeDTO[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estabelecimentoService: EstabelecimentoService,
    private cidadeService: CidadeService,
    public photoService: PhotoService,
    public imageUtils: ImageUtilService,
    public sanitizer: DomSanitizer,
    public produtoServicoService: ProdutoServicoService,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController) {
    this.cidades = this.cidadeService.findAll();
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.preencherEstabelecimento(getNav.extras.state.estabelecimentoID);
      } else {
        this.router.navigate(['tabs/profile']);
      }
    });
    this.formEstabelecimento = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      cnpj: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      instagram: ['', []],
      facebook: ['', []],
      site: ['', []],
      horario: ['', [Validators.required]],
      telefone1: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      telefone2: ['', [Validators.minLength(9), Validators.maxLength(13)]],
      telefone3: ['', [Validators.minLength(9), Validators.maxLength(13)]]
    });
    this.formEndereco = this.formBuilder.group({
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', []],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidadeId: [0, [Validators.required]]
    });
  }

  preencherEstabelecimento(id: string) {
    this.estabelecimentoService.findById(id)
      .subscribe(
        response => {
          this.estabelecimento = response;
          console.log(this.estabelecimento);
          this.getImageOfEstabelecimentoIfExists();
          this.getImageOfProdutoServicoIfExists();
          this.getTelefones();
        },
        error => {
        }
      );
  }

  preencherFormEstabelecimento() {
    this.formEstabelecimento.controls.nome.setValue(this.estabelecimento.nome);
    this.formEstabelecimento.controls.cnpj.setValue(this.estabelecimento.cnpj);
    this.formEstabelecimento.controls.instagram.setValue(this.estabelecimento.instagram);
    this.formEstabelecimento.controls.facebook.setValue(this.estabelecimento.facebook);
    this.formEstabelecimento.controls.site.setValue(this.estabelecimento.site);
    this.formEstabelecimento.controls.horario.setValue(this.estabelecimento.horario);
    this.formEstabelecimento.controls.telefone1.setValue(this.estabelecimento.telefone1);
    this.formEstabelecimento.controls.telefone2.setValue(this.estabelecimento.telefone2);
    this.formEstabelecimento.controls.telefone3.setValue(this.estabelecimento.telefone3);
  }

  preencherFormEndereco() {
    this.formEndereco.controls.logradouro.setValue(this.estabelecimento.endereco.logradouro);
    this.formEndereco.controls.numero.setValue(this.estabelecimento.endereco.numero);
    this.formEndereco.controls.complemento.setValue(this.estabelecimento.endereco.complemento);
    this.formEndereco.controls.bairro.setValue(this.estabelecimento.endereco.bairro);
    this.formEndereco.controls.cep.setValue(this.estabelecimento.endereco.cep);
    this.formEndereco.controls.cidadeId.setValue(this.estabelecimento.endereco.cidade.id);
  }

  getTelefones() {
    this.estabelecimento.telefone1 = this.estabelecimento.telefones[0];
    if (this.estabelecimento.telefones[1] != null) {
      this.estabelecimento.telefone2 = this.estabelecimento.telefones[1];
    } else {
      this.estabelecimento.telefone2 = "";
    }
    if (this.estabelecimento.telefones[2] != null) {
      this.estabelecimento.telefone3 = this.estabelecimento.telefones[2];
    } else {
      this.estabelecimento.telefone3 = "";
    }
  }

  editarEstabelecimento() {
    this.edit = true;
    this.preencherFormEstabelecimento();
  }

  editarEndereco() {
    this.edit = false;
    this.editEndereco = true;
    this.preencherFormEndereco();
  }

  cancelarEdicaoEstabelecimento() {
    this.edit = false;
    this.editEndereco = false;
    this.formEstabelecimento.reset();
  }
  
  cancelarEdicaoEndereco() {
    this.editEndereco = false;
    this.edit = true;
  }

  updateEstabelecimento() {
    if (this.formEstabelecimento.valid) {
      this.estabelecimentoService.update(this.formEstabelecimento.value, this.estabelecimento.id)
        .subscribe(
          response => {
            this.showUpdateOk('Estabelecimento Atualizado com sucesso');
            this.cancelarEdicaoEstabelecimento();
            this.preencherEstabelecimento(this.estabelecimento.id);
          },
          error => {
          }
        );
    } else {
      this.invalidFieldsAlert(this.formEstabelecimento);
    }
  }

  updateEndereco() {
    if (this.formEndereco.valid) {
      this.estabelecimentoService.updateEndereco(this.formEndereco.value, this.estabelecimento.id)
        .subscribe(
          response => {
            this.showUpdateOk('Endereço atualizado com sucesso');
            this.cancelarEdicaoEndereco();
            this.preencherEstabelecimento(this.estabelecimento.id);
          },
          error => {
          }
        );
    } else {
      this.invalidFieldsAlert(this.formEndereco);
    }
  }


  getImageOfEstabelecimentoIfExists() {
    this.estabelecimentoService.getImageFromServer(this.estabelecimento.id)
      .subscribe(response => {
        this.imageUtils.blobToDataURL(response).then(dataUrl => {
          let str: string = dataUrl as string;
          this.image = this.sanitizer.bypassSecurityTrustUrl(str);
        }
        );
      },
        error => {
          this.image = '/assets/img/imagem.jpg';
        }
      );
  }

  getImageOfProdutoServicoIfExists() {
    for (let i = 0; i < this.estabelecimento.produtoServicos.length; i++) {
      let ps = this.estabelecimento.produtoServicos[i];
      this.produtoServicoService.getImageFromServer(ps.id)
        .subscribe(response => {
          ps.imageUrl = `${API_CONFIG.baseUrl}/imagens/pro${ps.id}.jpg`;
        },
          error => {
            ps.imageUrl = '/assets/img/sem_foto.png';
          }
        );
    }
  }

  addProdutoServico() {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: this.estabelecimento.id
      }
    };
    this.router.navigate(['tabs/add-produto-servico'], dados);
  }

  findCidade(id: string) {
    for (let i = 0; i < this.cidades.length; i++) {
      if (this.cidades[i]['id'] == id) {
        return this.cidades[i];
      }
    }
  }

  public async getCameraPicture() {
    var photo = await this.photoService.getCameraPicture();
    await this.sendPicture(photo);
  }

  sendPicture(picture) {
    this.estabelecimentoService.upLoadPicture(picture, this.estabelecimento.id)
      .subscribe(response => {
        this.getImageOfEstabelecimentoIfExists();
      },
        error => { }
      );
  }

  gerenciarProdutoServico(id: string) {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: this.estabelecimento.id,
        produtoServicoID: id
      }
    };
    this.router.navigate(['tabs/gerenciar-produto-servico'], dados);
  }

  deletePicture() {
    this.estabelecimentoService.deletePicture(this.estabelecimento.id)
      .subscribe(response => {
        this.getImageOfEstabelecimentoIfExists();
      },
        error => {
        }
      );
  }

  delete() {
    this.estabelecimentoService.delete(this.estabelecimento.id)
      .subscribe(response => {
        this.router.navigate(['tabs/profile']);
      },
        error => { });
  }

  async invalidFieldsAlert(formGroup: FormGroup) {
    const alert = await this.alertCtrl.create({
      header: 'Campos inválidos',
      message: this.listErrors(formGroup),
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  private listErrors(formGroup: FormGroup): string {
    let s: string = '';
    for (const field in formGroup.controls) {
      if (formGroup.controls[field].invalid) {
        s = s + '<p><strong>' + field + ': </strong>Valor inválido</p>';
      }
    }
    return s;
  }

  async showUpdateOk(message: string) {
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
      message: 'Está certo em apagar o estabelecimento ' + this.estabelecimento.nome + "?",
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

  profile() {
    this.cancelarEdicaoEstabelecimento();
    this.router.navigate(['tabs/profile']);
  }
}