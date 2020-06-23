import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaDTO } from 'src/app/models/categoria.dto';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/app/config/api.config';
import { ImageUtilService } from './image-util.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(public http: HttpClient,
    public imageUtilService: ImageUtilService) {

  }

  findAll(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`);
  }

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/categorias/${id}`);
  }

  findPage(page: number = 0, linesPerPage: number = 24): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias/page?page=${page}&linesPerPage=${linesPerPage}`);
  }

  getImageFromServer(id: string): Observable<any> {
    let url = `${API_CONFIG.baseUrl}/imagens/cat${id}.jpg`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
