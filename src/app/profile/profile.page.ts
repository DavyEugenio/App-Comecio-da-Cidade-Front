import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/domain/usuario.service';
import { PhotoService } from 'src/app/services/photo.service';

import { UsuarioDTO } from 'src/app/models/usuario.dto';
import { ImageUtilService } from 'src/app/services/domain/image-util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  usuario: UsuarioDTO;
  edit: boolean = false;
  image;

  constructor(
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public photoService: PhotoService,
    public imageUtils: ImageUtilService,
    public sanitizer: DomSanitizer,
    private router: Router,
    public auth: AuthService,
    private tabs: TabsPage) {
    this.image = '/assets/img/user.jpg';
    let us = this.storage.getLocalUser();
    if (us && us.email) {
      this.usuarioService.findByEmail(us.email)
        .subscribe(
          response => {
            this.usuario = response;
            this.getImageOfUsuarioIfExists();
            this.preencherUsuario();
          },
          error => {
            if (error.status == 403) {
              this.router.navigate(['tabs/tab2']);
            }
          }
        );
    } else {
      this.router.navigate(['tabs/tab2']);
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.preencherUsuario();
  }

  preencherUsuario() {
    this.usuarioService.findById(this.usuario.id).subscribe(
      response => {
        this.usuario = response;
        this.getImageOfUsuarioIfExists();
      },
      error => {
        if (error.status == 403) {
          this.router.navigate(['tabs/tab2']);
        }
      }
    );
  }

  gerenciarEstabelecimento(id: number) {
    let dados: NavigationExtras = {
      state: {
        estabelecimentoID: id
      }
    };
    this.router.navigate(['tabs/gerenciar-estabelecimento'], dados);
  }

  editarPerfil() {
    this.edit = true;
  }

  confirmarEdicao() {
    this.usuarioService.update(this.usuario).subscribe(
      response => {
        this.preencherUsuario();
      },
      error => {
      }
    );
    this.edit = false;
  }

  cancelarEdicao() {
    this.edit = false;
    this.preencherUsuario();
  }

  sair() {
    this.auth.logout();
    this.tabs.updateButton(false);
    this.router.navigate(['tabs/tab2']);
  }

  getImageOfUsuarioIfExists() {
    this.usuarioService.getImageFromServer(this.usuario.id)
      .subscribe(response => {
        this.imageUtils.blobToDataURL(response).then(dataUrl => {
          let str: string = dataUrl as string;
          this.image = this.sanitizer.bypassSecurityTrustUrl(str);
        }
        );
      },
        error => {
          this.image = '/assets/img/user.jpg';
        }
      );
  }

  public async getCameraPicture() {
    var photo = await this.photoService.getCameraPicture();
    await this.sendPicture(photo);
  }

  sendPicture(picture) {
    this.usuarioService.upLoadPicture(picture)
      .subscribe(response => {
        this.getImageOfUsuarioIfExists();
      },
        error => { }
      );
  }

  deletePicture() {
    this.usuarioService.deletePicture()
      .subscribe(response => {
        this.getImageOfUsuarioIfExists();
      },
        error => {
        }
      );
  }

  addEstabelecimento() {
    this.router.navigate(['tabs/add-estabelecimento']);
  }
}
