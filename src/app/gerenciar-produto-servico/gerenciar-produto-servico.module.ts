import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GerenciarProdutoServicoPageRoutingModule } from './gerenciar-produto-servico-routing.module';

import { GerenciarProdutoServicoPage } from './gerenciar-produto-servico.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    GerenciarProdutoServicoPageRoutingModule
  ],
  declarations: [GerenciarProdutoServicoPage]
})
export class GerenciarProdutoServicoPageModule {}
