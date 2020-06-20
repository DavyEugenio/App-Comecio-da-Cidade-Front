import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerenciarProdutoServicoPage } from './gerenciar-produto-servico.page';

const routes: Routes = [
  {
    path: '',
    component: GerenciarProdutoServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciarProdutoServicoPageRoutingModule {}
