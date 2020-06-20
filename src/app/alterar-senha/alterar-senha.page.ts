import { Component, OnInit } from '@angular/core';
import { SenhaUpdateDTO } from 'src/app/models/senhaUpdate.dto';
import { UsuarioService } from 'src/app/services/domain/usuario.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
@Component({
	selector: 'app-alterar-senha',
	templateUrl: './alterar-senha.page.html',
	styleUrls: ['./alterar-senha.page.scss'],
})
export class AlterarSenhaPage implements OnInit {
	update: SenhaUpdateDTO;
	confirmarNovaSenha: string = "";

	constructor(
		private usuarioService: UsuarioService,
		public alertCtrl: AlertController,
		private router: Router,
		public storage: StorageService) {
		this.carregarUsuario();
		this.limparSenhas();
	}

	carregarUsuario() {
		let us = this.storage.getLocalUser();
		if (us && us.email) {
			this.usuarioService.findByEmail(us.email)
				.subscribe(
					response => {
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

	limparSenhas() {
		this.update = {
			senhaAntiga: '',
			senhaNova: ''
		}
		this.confirmarNovaSenha = '';
	}

	alterar() {
		if (this.update.senhaNova == this.confirmarNovaSenha) {
			this.usuarioService.updatePassword(this.update)
				.subscribe(
					response => {
						this.alert('Sucesso', 'Senha alterada com sucesso');
						this.limparSenhas();
						this.router.navigate(['tabs/profile']);
					},
					error => {
					}
				);
		} else {
			this.alert('Erro', 'As senhas não coincidem');
		}
	}

	async alert(header, message) {
		const alert = await this.alertCtrl.create({
			header: header,
			message: message,
			backdropDismiss: false,
			buttons: [{
				text: 'Ok',
				handler: data => {

				}
			}]
		});
		await alert.present();
	}
}
