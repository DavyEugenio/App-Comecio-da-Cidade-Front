import { ProdutoServicoDTO } from 'src/app/models/produtoServico.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api.config';
import { Observable } from 'rxjs';
import { ImageUtilService } from 'src/app/services/domain/image-util.service';

@Injectable()
export class ProdutoServicoService {
  constructor(public http: HttpClient,
    public imageUtilService: ImageUtilService) {

  }

  findAll(): Observable<ProdutoServicoDTO[]> {
    return this.http.get<ProdutoServicoDTO[]>(`${API_CONFIG.baseUrl}/produtoServicos`);
  }

  findById(id: string): Observable<ProdutoServicoDTO> {
    return this.http.get<ProdutoServicoDTO>(`${API_CONFIG.baseUrl}/produtoServicos/${id}`);
  }

  findByEstablishment(idEstabelecimento: string): Observable<ProdutoServicoDTO[]> {
    return this.http.get<ProdutoServicoDTO[]>(`${API_CONFIG.baseUrl}/produtoServicos/estabelecimento/${idEstabelecimento}`);
  }

  findPage(page: number = 0, linesPerPage: number = 24): Observable<ProdutoServicoDTO[]> {
    return this.http.get<ProdutoServicoDTO[]>(`${API_CONFIG.baseUrl}/produtoServicos/page?page=${page}&linesPerPage=${linesPerPage}`);
  }

  findPageByEstablishment(page: number = 0, linesPerPage: number = 24, id_estabelecimento: string): Observable<ProdutoServicoDTO[]> {
    return this.http.get<ProdutoServicoDTO[]>(`${API_CONFIG.baseUrl}/produtoServicos/estabelecimento/${id_estabelecimento}page?page=${page}&linesPerPage=${linesPerPage}`);
  }

  insert(obj: ProdutoServicoDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/produtoServicos`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  upLoadPicture(picture, id: string) {
    let picutreBlob = this.imageUtilService.dataUriToBlob(picture);
    let formDate: FormData = new FormData();
    formDate.set('file', picutreBlob, 'file.png');
    return this.http.post(
      `${API_CONFIG.baseUrl}/produtoServicos/${id}/picture`,
      formDate,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  update(obj: ProdutoServicoDTO, id: string) {
    return this.http.put(
      `${API_CONFIG.baseUrl}/produtoServicos/${id}`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  delete(id: string) {
    return this.http.delete(
      `${API_CONFIG.baseUrl}/produtoServicos/${id}`,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  deletePicture(id: string) {
    return this.http.delete(`${API_CONFIG.baseUrl}/produtoServicos/${id}/picture`,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  getImageFromServer(id: string): Observable<any> {
    let url = `${API_CONFIG.baseUrl}/imagens/pro${id}.jpg`;
    return this.http.get(url, { responseType: 'blob' });
  }

}