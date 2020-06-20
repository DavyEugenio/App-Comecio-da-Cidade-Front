import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmailDTO } from 'src/app/models/email.dto';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
})
export class RecuperarSenhaPage implements OnInit {
	emailDTO: EmailDTO = {
    email: " "
  };
  
  constructor(
              private authService: AuthService,
              private alertCtrl:  AlertController,
              private router: Router ) { }

  ngOnInit() {
  }

  recuperar() {
    console.log(this.emailDTO);
   
  	this.authService.recuperarSenha(this.emailDTO)
    .subscribe(
      response=>{
        console.log("OK");
        console.log(response);
        this.successfully();
      },
      error=>{
        console.log(error);
      }
    );
  }

  async successfully() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperação De Senha',
      message:`Um email com o link de recuperação foi enviado para ${this.emailDTO.email}`,
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
