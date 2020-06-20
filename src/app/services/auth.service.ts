import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { LocalUser } from '../models/local_user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmailDTO } from '../models/email.dto';

@Injectable()
export class AuthService {

    jwtHelperService: JwtHelperService = new JwtHelperService();

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    authenticate(creds: CredenciaisDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    refreshToken() {
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue: string) {
        let tok = authorizationValue.substring(7);
        let user: LocalUser = {
            token: tok,
            email: this.jwtHelperService.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
    }

    recuperarSenha(obj: EmailDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/auth/forgot`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    logout() {
        this.storage.setLocalUser(null);
    }
}