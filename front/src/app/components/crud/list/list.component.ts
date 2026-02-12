import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Imovel } from '../../../model/imovel.model';
import { ImovelService } from '../../../services/imovel.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  imoveis!: Imovel[];
  currentIndex = 0;
  router!: Router;
  httpClient!: HttpClient;

  constructor(imoveisService: ImovelService, router: Router, httpClient: HttpClient) {
    imoveisService.getAll().subscribe((imoveis) => (this.imoveis = imoveis));
    this.router = router;
    this.httpClient = httpClient;
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next(imovel: Imovel) {
    const hasImage = imovel.imagensComDominio?.length && this.currentIndex < imovel.imagensComDominio.length - 1;
    if (hasImage) this.currentIndex++;
  }

  checkIfDisabled(imovel: Imovel) {
    if (!imovel.imagensComDominio?.length) return true;
    return this.currentIndex === imovel.imagensComDominio.length - 1;
  }

  getCurrentImg(imovel: Imovel) {
    const hasImage = imovel.imagensComDominio?.length && imovel.imagensComDominio.length >= this.currentIndex - 1;
    if (hasImage) return imovel.imagensComDominio?.length && imovel.imagensComDominio[this.currentIndex];
    return 'no-img.png'; //TODO: add a global constant for this
  }

  edit(idEdit: string) {
    const imovel = this.imoveis.find(({ id }) => id == idEdit);
    if (imovel)
      this.router.navigate(['/edit'], {
        state: { imovel: this.imoveis.find(({ id }) => id == idEdit) },
      });
  }

  remove(idToRemove: string) {
    if (confirm('Confirmar exclusão')) {
      this.httpClient.delete('https://ja4u6ikr4c.execute-api.sa-east-1.amazonaws.com/default/deleteimovel?idsARemover=' + idToRemove, {}).subscribe(console.log);
    }
  }
}
