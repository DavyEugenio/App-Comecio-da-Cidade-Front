import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { EstabelecimentoDTO } from 'src/app/models/estabelecimento.dto';
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
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
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
          this.getImageOfEstabelecimentoIfExists();
          this.getImageOfProdutoServicoIfExists();
          this.getTelefones();
          this.formatarDescricaoProdutoServico();
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
    let telefones: string[] = [];
    for (let i = 0; i < this.estabelecimento.telefones.length; i++) {
      let tel = this.estabelecimento.telefones[i];
      if (tel != null && tel.trim()) {
        telefones.push(tel);
      }
    }
    this.estabelecimento.telefone1 = telefones[0];
    if (telefones[1] != null) {
      this.estabelecimento.telefone2 = telefones[1];
    } else {
      this.estabelecimento.telefone2 = "";
    }
    if (telefones[2] != null) {
      this.estabelecimento.telefone3 = telefones[2];
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
        let value = formGroup.controls[field].value;
        let length: number = value.length;
        console.log(length);
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
          case 'cnpj':
            if (length != 14) {
              s = s + '<p><strong>CNPJ: </strong>O CNPJ deve conter 14 caráteres</p>';
            }
            break;
          case 'horario':
            if (!value) {
              s = s + '<p><strong>Horário: </strong>Preenchimento obrigatório</p>';
            }
            break;
          case 'cidadeId':
            if (!value) {
              s = s + '<p><strong>Cidade: </strong>Preenchimento obrigatório</p>';
            }
            break;
          case 'logradouro':
            if (!value) {
              s = s + '<p><strong>Logradouro: </strong>Preenchimento obrigatório</p>';
            }
            break;
          case 'numero':
            if (!value) {
              s = s + '<p><strong>Número: </strong>Preenchimento obrigatório</p>';
            }
            break;
          case 'bairro':
            if (!value) {
              s = s + '<p><strong>Bairro: </strong>Preenchimento obrigatório</p>';
            }
            break;
          case 'cep':
            if (!value) {
              s = s + '<p><strong>CEP: </strong>Preenchimento obrigatório</p>';
            } else {
              if (length < 8 || length > 9) {
                s = s + '<p><strong>CEP: </strong>O nome deve conter entre 8 e 9 caráteres</p>';
              }
            }
            break;
          case 'telefone1':
            if (!value) {
              s = s + '<p><strong>Telefone 1: </strong>Preenchimento obrigatório</p>';
            } else {
              if (length < 9 || length > 13) {
                s = s + '<p><strong>Telefone 1: </strong>O telefone deve conter entre 8 e 9 caráteres</p>';
              }
            }
            break;
          case 'telefone2':
            if (!value) {
              s = s + '<p><strong>Telefone 2: </strong>Preenchimento obrigatório</p>';
            } else {
              if (length < 9 || length > 13) {
                s = s + '<p><strong>Telefone 2: </strong>O telefone deve conter entre 8 e 9 caráteres</p>';
              }
            }
            break;
          case 'telefone3':
            if (!value) {
              s = s + '<p><strong>Telefone 3: </strong>Preenchimento obrigatório</p>';
            } else {
              if (length < 9 || length > 13) {
                s = s + '<p><strong>Telefone 3: </strong>O telefone deve conter entre 8 e 9 caráteres</p>';
              }
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
  formatarDescricaoProdutoServico(){
    let produtoServicos = this.estabelecimento.produtoServicos;
    let leng = produtoServicos.length;

    for (let i = 0; i < leng; i++){
      if (produtoServicos[i].nome.length > 7){

        this.estabelecimento.produtoServicos[i].nome = produtoServicos[i].nome.slice(0,7);
        this.estabelecimento.produtoServicos[i].nome += " ...";
      }
    }
  }
}