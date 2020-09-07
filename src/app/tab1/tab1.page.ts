import { API_CONFIG } from 'src/app/config/api.config';
import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CidadeDTO } from 'src/app/models/cidade.dto';
import { CategoriaDTO } from 'src/app/models/categoria.dto';
import { CategoriaService } from 'src/app/services/domain/categoria.service';
import { EstabelecimentoDTO } from 'src/app/models/estabelecimento.dto';
import { EstabelecimentoService } from 'src/app/services/domain/estabelecimento.service';
import { StorageService } from 'src/app/services/storage.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  page: number = 0;
  cidade: CidadeDTO;
  categorias: CategoriaDTO[] = null;
  estabelecimentos: EstabelecimentoDTO[] = [];
  categoria: CategoriaDTO;
  nome: string = "";
  tempo: number = 0;
  sliderOpts = {
    zoom: false,
    slidesPerView: 4,
    centeredSlides: false,
    spaceBeetween: 5
  };

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private categoriaService: CategoriaService,
    private estabelecimentoService: EstabelecimentoService,
    private storage: StorageService) {
    this.tempo = 0;
    this.cidade = this.storage.getLocalCidade();
  }

  ionViewDidEnter() {
    this.presentLoading();
  }

  loadData() {
    this.categoriaService.findAll().subscribe(
      response => {
        this.categorias = response;
        this.getImageOfCategoriaIfExists();
      }
    );
    this.getEstabelecimentos();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...'
    });
    await loading.present();
    if (this.categorias) {
      loading.dismiss();
    } else {
      this.dataLoading(loading);
    }
  }

  dataLoading(loading) {
    if (this.tempo != 10) {
      setTimeout(() => {
        this.estabelecimentos = [];
        this.loadData();
        if (!this.categorias) {
          this.dataLoading(loading);
        } else {
          loading.dismiss();
        }
      }, 1000);
      this.tempo = this.tempo + 0.5;
    } else {
      loading.dismiss();
      this.nullCidade();
      this.alert();
    }
  }

  async alert() {
    let alert = await this.alertCtrl.create({
      header: 'Tempo máximo excedido',
      message: 'Servidor incontactável,<br> por favor tente acessar novamente mais tarde',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
  }

  getEstabelecimentos() {
    this.estabelecimentoService.findPageByCidade(this.cidade.id, this.page, 10).subscribe(
      response => {
        let start = this.estabelecimentos.length;
        this.estabelecimentos = this.estabelecimentos.concat(response['content']);
        let end = this.estabelecimentos.length;
        this.getImageOfEstabelecimentoIfExists(start, end);
      }
    );
  }

  detalheEstabelecimento(id: number) {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: id
      }
    };
    this.router.navigate(['tabs/detalhe-estabelecimento'], dados);
  }

  nullCidade() {
    this.storage.setLocalCidade(null);
    this.router.navigate(['home']);
  }

  getImageOfEstabelecimentoIfExists(start: number, end: number) {
    for (let i = start; i < end; i++) {
      let est = this.estabelecimentos[i];
      this.estabelecimentoService.getImageFromServer(est.id)
        .subscribe(response => {
          est.imageUrl = `${API_CONFIG.baseUrl}/imagens/est${est.id}.jpg`;
        },
          error => {
            est.imageUrl = '/assets/img/imagem.jpg';
          }
        );
    }
  }

  getImageOfCategoriaIfExists() {
    for (let i = 0; i < this.categorias.length; i++) {
      let cat = this.categorias[i];
      this.categoriaService.getImageFromServer(cat.id)
        .subscribe(response => {
          cat.imageUrl = `${API_CONFIG.baseUrl}/imagens/cat${cat.id}.jpg`;
        },
          error => {
            cat.imageUrl = '/assets/img/imagem.jpg';
          }
        );
    }
  }

  changeCategoria(cat: CategoriaDTO) {
    this.categoria = cat;
    this.search();
  }

  clearCategoria() {
    this.categoria = null;
    this.page = 0;
    this.estabelecimentos = [];
    this.getEstabelecimentos();
  }

  search() {
    let categoriaId = null;
    if (this.categoria != null) {
      categoriaId = this.categoria.id;
    }
    this.estabelecimentoService.search(this.nome, this.cidade.id, categoriaId)
      .subscribe(
        response => {
          let start = 0;
          this.estabelecimentos = response['content'];
          let end = this.estabelecimentos.length;
          this.getImageOfEstabelecimentoIfExists(start, end);
        },
        error => {
        }
      );
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getEstabelecimentos();
    setTimeout(() => {
      infiniteScroll.target.complete();
    }, 1000);
  }
}
