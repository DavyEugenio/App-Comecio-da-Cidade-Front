import { ProdutoServicoService } from 'src/app/services/domain/produtoServico.service';
import { API_CONFIG } from 'src/app/config/api.config';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { EstabelecimentoService } from 'src/app/services/domain/estabelecimento.service';
import { EstabelecimentoDTO } from 'src/app/models/estabelecimento.dto';

@Component({
  selector: 'app-detalhe-estabelecimento',
  templateUrl: './detalhe-estabelecimento.page.html',
  styleUrls: ['./detalhe-estabelecimento.page.scss'],
})
export class DetalheEstabelecimentoPage implements OnInit {
  estabelecimento: EstabelecimentoDTO;
  sliderOpts = {
    zoom: false,
    slidesPerView: 4,
    centeredSlides: false,
    spaceBeetween: 10
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estabelecimentoService: EstabelecimentoService,
    private produtoServicoService: ProdutoServicoService) {

    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        let a = getNav.extras.state.estabelecimentoID;
        this.estabelecimentoService.findById(a)
          .subscribe(
            response => {
              this.estabelecimento = response;
              this.getImageOfEstabelecimentoIfExists();
              this.getImageOfProdutoServicoIfExists();
            },
            error => {
            }
          );
      }
    });
  }

  ngOnInit() {
  }

  getImageOfEstabelecimentoIfExists() {
    this.estabelecimentoService.getImageFromServer(this.estabelecimento.id)
      .subscribe(response => {
        this.estabelecimento.imageUrl = `${API_CONFIG.baseUrl}/imagens/est${this.estabelecimento.id}.jpg`;
      },
        error => {
          this.estabelecimento.imageUrl = '/assets/img/imagem.jpg';
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

  detalheProduto(id: number) {
    let dados: NavigationExtras = {
      state: {
        produtoID: id,
        estabelecimentoID: this.estabelecimento.id
      }
    };
    this.router.navigate(['tabs/detalhe-produto-servico'], dados);
  }
}
