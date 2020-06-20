import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'detalhe-estabelecimento',
    loadChildren: () => import('./detalhe-estabelecimento/detalhe-estabelecimento.module').then( m => m.DetalheEstabelecimentoPageModule)
  },
  {
    path: 'gerenciar-estabelecimento',
    loadChildren: () => import('./gerenciar-estabelecimento/gerenciar-estabelecimento.module').then( m => m.GerenciarEstabelecimentoPageModule)
  },
  {
    path: 'detalhe-produto-servico',
    loadChildren: () => import('./detalhe-produto-servico/detalhe-produto-servico.module').then( m => m.DetalheProdutoServicoPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'add-produto-servico',
    loadChildren: () => import('./add-produto-servico/add-produto-servico.module').then( m => m.AddProdutoServicoPageModule)
  },
  {
    path: 'detalhe-produto-servico',
    loadChildren: () => import('./detalhe-produto-servico/detalhe-produto-servico.module').then( m => m.DetalheProdutoServicoPageModule)
  },
  {
    path: 'add-estabelecimento',
    loadChildren: () => import('./add-estabelecimento/add-estabelecimento.module').then( m => m.AddEstabelecimentoPageModule)
  },
  {
    path: 'gerenciar-produto-servico',
    loadChildren: () => import('./gerenciar-produto-servico/gerenciar-produto-servico.module').then( m => m.GerenciarProdutoServicoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}