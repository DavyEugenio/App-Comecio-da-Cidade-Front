import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
})
export class RecuperarSenhaPage implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  recuperar() {
    if (this.formGroup.controls.email.valid) {
      this.authService.recuperarSenha(this.formGroup.value)
        .subscribe(
          response => {
            this.successfully();
          },
          error => {
          }
        );
    } else {
      this.invalidFieldsAlert();
    }
  }

  async invalidFieldsAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Campo inválido',
      message: this.error(),
      backdropDismiss: false,
      buttons: [{
        text: 'Ok'
      }]
    });
    await alert.present();
  }

  error() {
    if (!this.formGroup.controls.email) {
      return "<strong>Email: </strong>Preenchimento obrigatório"
    } else {
      return "<strong>Email: </strong>Email inválido"
    }
  }

  async successfully() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperação De Senha',
      message: `Um email com o link de recuperação foi enviado para ${this.formGroup.controls.email.value}`,
      backdropDismiss: false,
      buttons: [{
        text: 'Ok',
        handler: data => {
          this.router.navigate(['./tabs/tab2']);
        }
      }]

    });
    await alert.present();
  }
}
