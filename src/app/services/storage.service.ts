import { LocalUser } from './../models/local_user';
import { Injectable } from '@angular/core';
import { CidadeDTO } from '../models/cidade.dto';
import { STORAGE_KEYS } from '../config/storage.config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  getLocalCidade() {
    let cidade = localStorage.getItem(STORAGE_KEYS.localCidade);
    if (cidade == null) {
      return null;
    }
    else {
      return JSON.parse(cidade);
    }
  }

  setLocalCidade(cidadeDTO: CidadeDTO) {
    if (cidadeDTO == null) {
      localStorage.removeItem(STORAGE_KEYS.localCidade);
    }
    else {
      localStorage.setItem(STORAGE_KEYS.localCidade, JSON.stringify(cidadeDTO));
    }
  }

  getLocalUser(): LocalUser {
    let usr = localStorage.getItem(STORAGE_KEYS.localUser);
    if (usr == null) {
      return null;
    } else {
      return JSON.parse(usr);
    }
  }

  setLocalUser(obj: LocalUser) {
    if (obj == null) {
      localStorage.removeItem(STORAGE_KEYS.localUser);
    } else {
      localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
    }
  }
}
