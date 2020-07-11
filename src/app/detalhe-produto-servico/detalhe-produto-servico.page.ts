import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ProdutoServicoService } from 'src/app/services/domain/produtoServico.service';
import { ProdutoServicoDTO } from 'src/app/models/produtoServico.dto';
import { API_CONFIG } from 'src/app/config/api.config';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-detalhe-produto-servico',
  templateUrl: './detalhe-produto-servico.page.html',
  styleUrls: ['./detalhe-produto-servico.page.scss'],
})

export class DetalheProdutoServicoPage {

  produtoServicos: ProdutoServicoDTO[] = [];
  estabelecimentoID: string;
  page: number = 0;
  rightArrow: boolean = false;
  leftArrow: boolean = false;
  linesPerPage: number = 10;
  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: false,
    spaceBeetween: 1
  };
  @ViewChild('slides') slides: IonSlides;
  constructor(private router: Router, private route: ActivatedRoute, private produtoServicoService: ProdutoServicoService) {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.estabelecimentoID = getNav.extras.state.estabelecimentoID;
      } else {
        this.router.navigate(['tabs/tab1']);
      }
    });
  }

  ionViewDidEnter() {
    this.page = 0;
    this.produtoServicos = [];
    this.slides.slideTo(0);
    if (this.estabelecimentoID) {
      this.loadData();
      this.controlArrows();
    }
  }

  loadData() {
    this.produtoServicoService.findPageByEstablishment(this.page, this.linesPerPage, this.estabelecimentoID)
      .subscribe(
        response => {
          let start = this.produtoServicos.length;
          this.produtoServicos = this.produtoServicos.concat(response['content']);
          let end = this.produtoServicos.length;
          if (start != end) {
            this.getImageIfExists(start, end);
            this.controlArrows();
          }
        },
        error => {
        }
      );
  }

  controlArrows() {
    this.slides.getActiveIndex().then((index: number) => {
      let length = this.produtoServicos.length;
      if (length > 1) {
        if (index > 0 && index < (length - 1)) {
          this.leftArrow = true;
          this.rightArrow = true;
        }
        if (index == 0) {
          this.leftArrow = false;
          this.rightArrow = length != 1;
        }
        if (index == (length - 1)) {
          this.leftArrow = true;
          if (length >= this.linesPerPage) {
            this.doInfinite();
          }
          this.rightArrow = index != (length - 1);
        }
      } else {
        this.leftArrow = false;
        this.rightArrow = false;
      }
    });
  }

  slideNext() {
    this.slides.slideNext();
  }

  slidePrev() {
    this.slides.slidePrev();
  }

  getImageIfExists(start: number, end: number) {
    for (let i = start; i < end; i++) {
      let ps = this.produtoServicos[i];
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

  detalheEstabelecimento() {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: this.estabelecimentoID
      }
    };
    this.router.navigate(['tabs/detalhe-estabelecimento'], dados);
  }

  doInfinite() {
    this.page++;
    this.loadData();
  }
}
