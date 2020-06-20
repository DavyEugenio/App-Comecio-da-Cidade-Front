import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  logado: boolean = false;
  constructor(public auth: AuthService) {
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.logado = true;
      }, error => {
        this.logado = false;
      });
  }

  updateButton(logado: boolean) {
    this.logado = logado;
  }
}
