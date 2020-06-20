import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CidadeService } from './services/domain/cidade.service';
import { CategoriaService } from './services/domain/categoria.service';
import { AuthInterceptorProvider } from './interceptors/auth-interceptor';
import { ErrorInterceptorProvider } from './interceptors/error-interceptor';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { UsuarioService } from './services/domain/usuario.service';
import { ImageUtilService } from './services/domain/image-util.service';
import { ProdutoServicoService } from './services/domain/produtoServico.service';
import { PhotoService } from './services/photo.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, RouterModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CidadeService,
    CategoriaService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    AuthService,
    StorageService,
    UsuarioService,
    ImageUtilService,
    ProdutoServicoService,
    PhotoService,
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
