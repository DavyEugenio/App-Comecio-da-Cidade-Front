import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ProdutoServicoService } from 'src/app/services/domain/produtoServico.service';
import { ProdutoServicoDTO } from 'src/app/models/produtoServico.dto';
import { API_CONFIG } from 'src/app/config/api.config';

@Component({
  selector: 'app-detalhe-produto-servico',
  templateUrl: './detalhe-produto-servico.page.html',
  styleUrls: ['./detalhe-produto-servico.page.scss'],
})
export class DetalheProdutoServicoPage implements OnInit {

  produtoServicos: ProdutoServicoDTO[] = [];
  end: string;
  begin: string;
  estabelecimentoID: string;
  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: false,
    spaceBeetween: 1
  };
  constructor(private router: Router, private route: ActivatedRoute, private produtoServicoService: ProdutoServicoService) {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.estabelecimentoID = getNav.extras.state.estabelecimentoID;
        this.produtoServicoService.findByEstablishment(this.estabelecimentoID)
          .subscribe(
            response => {
              this.produtoServicos = response;
              this.begin = this.pr
              this.getImageIfExists();
            },
            error => {
            }
          );
      } else {
        this.router.navigate(['tabs/tab1']);
      }
    });
  }

  ngOnInit() {
    
  }

  isBeginning(id: string): boolean {
    console.log(id);
    return this.produtoServicos[0].id === id;
  }

  isEnd(id: string): boolean {
    let lenght = this.produtoServicos.length;
    return this.produtoServicos[length - 1].id === id;
  }
  getImageIfExists() {
    for (let i = 0; i < this.produtoServicos.length; i++) {
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
}
