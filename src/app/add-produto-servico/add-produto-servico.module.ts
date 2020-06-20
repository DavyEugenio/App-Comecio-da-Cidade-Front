import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddProdutoServicoPageRoutingModule } from './add-produto-servico-routing.module';
import { AddProdutoServicoPage } from './add-produto-servico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddProdutoServicoPageRoutingModule
  ],
  declarations: [AddProdutoServicoPage]
})
export class AddProdutoServicoPageModule {}
