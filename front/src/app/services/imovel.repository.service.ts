import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Imovel } from '../model/imovel.model';

@Injectable({
  providedIn: 'root'
})
export class ImovelRepositoryService {

  httpClient: HttpClient;
  constructor(httpClient: HttpClient) { 
    this.httpClient = httpClient;
  }

  getAll() : Observable<Imovel[]> {
    return this.httpClient.get("http://asdfimobiliaria.s3-website-sa-east-1.amazonaws.com/resource/imoveis.json", { responseType: 'text' })
      .pipe(
        tap(console.log),
        map(txt => JSON.parse(txt)),
        map(imoveis => imoveis.map((imovel: Imovel) => Imovel.rehydrateObj(imovel))),
        
      );
  }

  get(id: string) : Imovel | void {
    return;
  }

  
}