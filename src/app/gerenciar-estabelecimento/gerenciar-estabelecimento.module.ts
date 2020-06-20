import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GerenciarEstabelecimentoPageRoutingModule } from './gerenciar-estabelecimento-routing.module';

import { GerenciarEstabelecimentoPage } from './gerenciar-estabelecimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GerenciarEstabelecimentoPageRoutingModule
  ],
  declarations: [GerenciarEstabelecimentoPage]
})
export class GerenciarEstabelecimentoPageModule {}
