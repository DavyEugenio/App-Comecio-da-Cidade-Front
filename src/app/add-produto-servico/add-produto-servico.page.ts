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

  gerenciarEstabelecimento() {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: this.estabelecimentoID
      }
    };
    this.router.navigate(['tabs/gerenciar-estabelecimento'], dados);
  }
}
