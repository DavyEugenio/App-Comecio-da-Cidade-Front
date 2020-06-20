import { UsuarioService } from './../services/domain/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { CredenciaisDTO } from 'src/app/models/credenciais.dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  formGroup: FormGroup;
  creds: CredenciaisDTO;
  constructor(private router: Router,
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public UsuarioService: UsuarioService,
    private tabs: TabsPage) {
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.initCreds();
  }

  ngOnInit() {
    this.initCreds();
  }

  initCreds() {
    this.creds = {
      email: "",
      senha: ""
    }
  }

  segmentChanged(ev: any) {
    if (ev.detail.value === "login") {
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.creds = null;
        this.tabs.updateButton(true);
        this.router.navigate(['tabs/profile']);
      }, error => {
      });
    this.initCreds();
  }

  async invalidFieldsAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Campos inválidos',
      message: this.listErrors(),
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  private listErrors(): string {
    let s: string = '';
    for (const field in this.formGroup.controls) {
      if (this.formGroup.controls[field].invalid) {
        s = s + '<p><strong>' + field + ': </strong>Valor inválido</p>';
      }
    }
    if (!this.compararSenhas()) {
      s = s + '<p><strong>confirmarSenha: </strong>Senhas não coincidem</p>';
    }
    return s;
  }

  login() {
    this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.tabs.updateButton(true);
        this.router.navigate(['tabs/profile']);
        this.initCreds();
      }, error => { });
  }

  compararSenhas() {
    return this.formGroup.controls.senha.value == this.formGroup.controls.confirmarSenha.value;
  }

  signupUser() {
    if (this.formGroup.valid && this.compararSenhas()) {
      this.UsuarioService.insert(this.formGroup.value)
        .subscribe(response => {
          this.creds = {
            email: this.formGroup.controls.email.value,
            senha: this.formGroup.controls.senha.value
          }
          this.showInsertOk();
          this.login();
          this.formGroup.reset();
        },
          error => { });
    } else {
      this.invalidFieldsAlert();
    }
  }

  async showInsertOk() {
    const alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Usuario cadastrado',
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

}
