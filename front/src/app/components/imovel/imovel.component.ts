import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Imovel } from '../../model/imovel.model';

@Component({
  selector: 'app-imovel',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './imovel.component.html',
  styleUrl: './imovel.component.scss',
})
export class ImovelComponent {
  @Input() imovel!: Imovel;

  currentIndex = 0;

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    const hasImage =
      this.imovel.imagensComDominio?.length &&
      this.currentIndex < this.imovel.imagensComDominio.length - 1;
    if (hasImage) this.currentIndex++;
  }

  checkIfDisabled() {
    if (!this.imovel.imagensComDominio?.length)
      return true;
    return this.currentIndex === this.imovel.imagensComDominio.length - 1;
  }

  getCurrentImg() {
    const hasImage = this.imovel.imagensComDominio?.length && this.imovel.imagensComDominio.length >= this.currentIndex - 1;
    if (hasImage)
      return this.imovel.imagensComDominio?.length && this.imovel.imagensComDominio[this.currentIndex];
    return "no-img.png"; //TODO: add a global constant for this
  }
}
