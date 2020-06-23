import { API_CONFIG } from 'src/app/config/api.config';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CidadeDTO } from 'src/app/models/cidade.dto';
import { CategoriaDTO } from 'src/app/models/categoria.dto';
import { CategoriaService } from 'src/app/services/domain/categoria.service';
import { EstabelecimentoDTO } from 'src/app/models/estabelecimento.dto';
import { EstabelecimentoService } from 'src/app/services/domain/estabelecimento.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  cidade: CidadeDTO;
  categorias: CategoriaDTO[] = [];
  estabelecimentos: EstabelecimentoDTO[] = [];
  categoria: CategoriaDTO;
  nome: string = "";
  sliderOpts = {
    zoom: false,
    slidesPerView: 4,
    centeredSlides: false,
    spaceBeetween: 5
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private estabelecimentoService: EstabelecimentoService,
    private storage: StorageService) {
    this.cidade = this.storage.getLocalCidade();
    this.getEstabelecimentos();
  }
  
  ionViewDidEnter() {
    this.cidade = this.storage.getLocalCidade();
    this.categoriaService.findAll().subscribe(
      response => {
        this.categorias = response;
        this.getImageOfCategoriaIfExists();
      }
    );
    this.getEstabelecimentos();
  }

  getEstabelecimentos() {
    this.estabelecimentoService.findByCidade(this.cidade.id).subscribe(
      response => {
        this.estabelecimentos = response;
        this.getImageOfEstabelecimentoIfExists();
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

  getImageOfEstabelecimentoIfExists() {
    for (let i = 0; i < this.estabelecimentos.length; i++) {
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
      this.estabelecimentoService.getImageFromServer(cat.id)
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
          this.estabelecimentos = response['content'];
          this.getImageOfEstabelecimentoIfExists();
        },
        error => {
        }
      );
  }
}
