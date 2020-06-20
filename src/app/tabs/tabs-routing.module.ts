import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'detalhe-estabelecimento',
        loadChildren: () => import('../detalhe-estabelecimento/detalhe-estabelecimento.module').then(m => m.DetalheEstabelecimentoPageModule)
      },
      {
        path: 'detalhe-produto-servico',
        loadChildren: () => import('../detalhe-produto-servico/detalhe-produto-servico.module').then(m => m.DetalheProdutoServicoPageModule)
      },
      {
        path: 'add-produto-servico',
        loadChildren: () => import('../add-produto-servico/add-produto-servico.module').then(m => m.AddProdutoServicoPageModule)
      },
      {
        path: 'gerenciar-estabelecimento',
        loadChildren: () => import('../gerenciar-estabelecimento/gerenciar-estabelecimento.module').then(m => m.GerenciarEstabelecimentoPageModule)
      },
      {
        path: 'add-estabelecimento',
        loadChildren: () => import('../add-estabelecimento/add-estabelecimento.module').then(m => m.AddEstabelecimentoPageModule)
      },
      {
        path: 'gerenciar-produto-servico',
        loadChildren: () => import('../gerenciar-produto-servico/gerenciar-produto-servico.module').then(m => m.GerenciarProdutoServicoPageModule)
      },
      {
        path: 'alterar-senha',
        loadChildren: () => import('../alterar-senha/alterar-senha.module').then(m => m.AlterarSenhaPageModule)
      },
      {
        path: 'recuperar-senha',
        loadChildren: () => import('../recuperar-senha/recuperar-senha.module').then(m => m.RecuperarSenhaPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
