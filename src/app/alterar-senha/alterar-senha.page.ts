import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/domain/usuario.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
	selector: 'app-alterar-senha',
	templateUrl: './alterar-senha.page.html',
	styleUrls: ['./alterar-senha.page.scss'],
})
export class AlterarSenhaPage implements OnInit {
	formGroup: FormGroup;

	constructor(
		private usuarioService: UsuarioService,
		private formBuilder: FormBuilder,
		public alertCtrl: AlertController,
		private router: Router,
		public storage: StorageService) {
		this.carregarUsuario();
		this.formGroup = this.formBuilder.group({
			senhaAntiga: ['', [Validators.required, Validators.minLength(8)]],
			senhaNova: ['', [Validators.required, Validators.minLength(8)]],
			confirmarNovaSenha: ['', [Validators.required, Validators.minLength(8)]]
		});
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

	alterar() {
		if (this.formGroup.valid && this.compararSenhas && this.compararSenhas()) {
			this.usuarioService.updatePassword(this.formGroup.value)
				.subscribe(
					response => {
						this.formGroup.reset();
						this.showInsertOk();
						this.router.navigate(['tabs/profile']);
					},
					error => {
					}
				);
		} else {
			this.invalidFieldsAlert();
		}
	}

	compararSenhas(): boolean {
		return this.formGroup.controls.senhaNova.value == this.formGroup.controls.confirmarNovaSenha.value;
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
			if (this.formGroup.controls[field].invalid || !this.compararSenhas()) {
				let value = this.formGroup.controls[field].value;
				let length: number = value.length;
				switch (field) {
					case 'senhaAntiga':
						if (!value) {
							s = s + '<p><strong>Senha Antiga: </strong>Preenchimento obrigatório</p>';
						} else {
							if (length < 8) {
								s = s + '<p><strong>Senha Antiga: </strong>A senha deve conter no mínimo 8 caráteres</p>';
							}
						}
						break;
					case 'senhaNova':
						if (!value) {
							s = s + '<p><strong>Nova Senha: </strong>Preenchimento obrigatório</p>';
						} else {
							if (length < 8) {
								s = s + '<p><strong>Nova Senha: </strong>A senha deve conter no mínimo 8 caráteres</p>';
							}
						}
						break;
					case 'confirmarNovaSenha':
						if (!value) {
							s = s + '<p><strong>Confirmar Nova Senha: </strong>Preenchimento obrigatório</p>';
						} else {
							if (length < 8) {
								s = s + '<p><strong>Confirmar Nova Senha: </strong>A senha deve conter no mínimo 8 caráteres</p>';
							} else {
								if (!this.compararSenhas()) {
									s = s + '<p><strong>Confirmar Nova Senha: </strong>Senhas não coincidem</p>';
								}
							}
						}
						break;
					default:
						s = s + '<p><strong>' + field + ': </strong>Valor inválido</p>';
						break;
				}
			}
		}
		return s;
	}

	async showInsertOk() {
		const alert = await this.alertCtrl.create({
			header: 'Sucesso!',
			message: 'Senha alterada com sucesso',
			backdropDismiss: false,
			buttons: [{
				text: 'Ok'
			}]
		});
		await alert.present();
	}

	cancelar() {
		this.formGroup.reset();
		this.router.navigate(['tabs/profile']);
	}
}
