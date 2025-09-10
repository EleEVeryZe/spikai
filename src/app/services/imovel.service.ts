import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Endereco, Filtro, Imovel } from '../model/imovel.model';
import { ImovelRepositoryService } from './imovel.repository.service';

@Injectable({
  providedIn: 'root',
})
export class ImovelService {
  constructor(private readonly repository: ImovelRepositoryService) {}

  getAll(): Observable<Imovel[]> {
    return this.repository.getAll();
  }

  getById(id: string) {
    return this.repository.get(id);
  }

  getAllEnderecos(): Observable<Endereco[]> {
    const imoveis = this.repository.getAll();
    return imoveis.pipe(map((imoveis) => imoveis.map((imovel) => Endereco.fromObject(imovel.endereco))));
  }

  getTipoImoveis(): string[] {
    return ['CASA', 'APARTAMENTO', 'LOTE', 'COBERTURA', 'COMERCIAL'];
  }

  filterBy(filtro: Filtro): Observable<Imovel[]> {
    return this.repository.getAll().pipe(map((imoveisFiltrados) => {
      if (filtro.localizacao)
        imoveisFiltrados = imoveisFiltrados.filter((imo: Imovel) => Endereco.fromObject(imo.endereco).getEnderecoNaoExato() === filtro.localizacao);

      if (filtro.tipo) imoveisFiltrados = imoveisFiltrados.filter((imo) => imo.tipoImovel === filtro.tipo);

      if (filtro.operacao) imoveisFiltrados = imoveisFiltrados.filter((imo) => imo.operacao === filtro.operacao);
      return imoveisFiltrados;
    }));    
  }
}
