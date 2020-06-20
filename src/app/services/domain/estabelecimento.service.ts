import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstabelecimentoDTO } from 'src/app/models/estabelecimento.dto';
import { API_CONFIG } from 'src/app/config/api.config';
import { ImageUtilService } from './image-util.service';
import { EnderecoDTO } from 'src/app/models/endereco.dto';

@Injectable({
  providedIn: 'root'
})
export class EstabelecimentoService {

  constructor(public http: HttpClient,
    public imageUtilService: ImageUtilService) { }

  findAll(): Observable<EstabelecimentoDTO> {
    return this.http.get<EstabelecimentoDTO>(`${API_CONFIG.baseUrl}/estabelecimentos`);
  }

  findById(id: string): Observable<EstabelecimentoDTO> {
    return this.http.get<EstabelecimentoDTO>(`${API_CONFIG.baseUrl}/estabelecimentos/${id}`);
  }

  insert(obj: EstabelecimentoDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/estabelecimentos`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  updateEndereco(obj: EnderecoDTO, id: string) {
    return this.http.put(
      `${API_CONFIG.baseUrl}/estabelecimentos/${id}/endereco`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  update(obj: EstabelecimentoDTO, id: string) {
    return this.http.put(
      `${API_CONFIG.baseUrl}/estabelecimentos/${id}`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  delete(id: string) {
    return this.http.delete(`${API_CONFIG.baseUrl}/estabelecimentos/${id}`,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  findByCidade(cidadeID: string): Observable<EstabelecimentoDTO[]> {
    return this.http.get<EstabelecimentoDTO[]>(`${API_CONFIG.baseUrl}/estabelecimentos/cidade/${cidadeID}`);
  }

  findPageByCidade(cidadeID: string, page: number = 0, linesPerPage: number = 24): Observable<EstabelecimentoDTO[]> {
    return this.http.get<EstabelecimentoDTO[]>(`${API_CONFIG.baseUrl}/estabelecimentos/cidade/${cidadeID}/page?page=${page}&linesPerPage=${linesPerPage}`);
  }

  findPage(page: number = 0, linesPerPage: number = 24): Observable<EstabelecimentoDTO[]> {
    return this.http.get<EstabelecimentoDTO[]>(`${API_CONFIG.baseUrl}/estabelecimento/page?page=${page}&linesPerPage=${linesPerPage}`);
  }


  findByUserOn(id: string): Observable<EstabelecimentoDTO[]> {
    return this.http.get<EstabelecimentoDTO[]>(`${API_CONFIG.baseUrl}/estabelecimentos/${id}`);
  }

  search(nome: string, cidadeId: string, categoriaId: string, page: number = 0, linesPerPage: number = 24) {
    let url = "";
    if (categoriaId == null) {
      url = `${API_CONFIG.baseUrl}/estabelecimentos/cidade/${cidadeId}/page?page=${page}&linesPerPage=${linesPerPage}&nome=${nome}`
    } else {
      url = `${API_CONFIG.baseUrl}/estabelecimentos/cidade/${cidadeId}/page?page=${page}&linesPerPage=${linesPerPage}&categorias=${categoriaId}&nome=${nome}`
    }
    return this.http.get<EstabelecimentoDTO[]>(url);
  }

  upLoadPicture(picture, id: string) {
    let picutreBlob = this.imageUtilService.dataUriToBlob(picture);
    let formDate: FormData = new FormData();
    formDate.set('file', picutreBlob, 'file.png');
    return this.http.post(
      `${API_CONFIG.baseUrl}/estabelecimentos/${id}/picture`,
      formDate,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  deletePicture(id: string) {
    return this.http.delete(`${API_CONFIG.baseUrl}/estabelecimentos/${id}/picture`,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  getImageFromServer(id: string): Observable<any> {
    let url = `${API_CONFIG.baseUrl}/imagens/est${id}.jpg`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
