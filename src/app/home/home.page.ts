import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CidadeService } from 'src/app/services/domain/cidade.service';
import { CidadeDTO } from 'src/app/models/cidade.dto';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  cidadeSelecionada: CidadeDTO;
  cidades: CidadeDTO[];

  constructor(private router: Router,
    private cidadeService: CidadeService,
    private storage: StorageService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    let localCidade = this.storage.getLocalCidade();
    if (localCidade == null) {
      this.cidades = this.cidadeService.findAll();
      this.cidadeSelecionada = this.cidades[0];
    } else {
      this.router.navigate(['./tabs/tab1']);
    }
  }

  setCidade() {
    this.storage.setLocalCidade(this.cidadeSelecionada);
  }
}
