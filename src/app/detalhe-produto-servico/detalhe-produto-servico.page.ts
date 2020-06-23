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

  produtoServico: ProdutoServicoDTO;
  estabelecimentoID: number;
  constructor(private router: Router, private route: ActivatedRoute, private produtoServicoService: ProdutoServicoService) {
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        let a = getNav.extras.state.produtoID;
        this.estabelecimentoID = getNav.extras.state.estabelecimentoID;;
        this.produtoServicoService.findById(a)
          .subscribe(
            response => {
              this.produtoServico = response;
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

  getImageIfExists() {
    this.produtoServicoService.getImageFromServer(this.produtoServico.id)
      .subscribe(response => {
        this.produtoServico.imageUrl = `${API_CONFIG.baseUrl}/imagens/pro${this.produtoServico.id}.jpg`;
      },
        error => {
          this.produtoServico.imageUrl = '/assets/img/sem_foto.png';
        }
      );
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
