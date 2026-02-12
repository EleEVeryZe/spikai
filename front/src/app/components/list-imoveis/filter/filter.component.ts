import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Endereco, Filtro } from '../../../model/imovel.model';
import { ImovelService } from '../../../services/imovel.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonToggleModule, MatCardModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  hideSingleSelectionIndicator = signal(false);
  enderecos!: Endereco[];
  tipoImoveis!: string[];
  @Output() handleFiltrar!: EventEmitter<Filtro>;

  constructor(imovelService: ImovelService) {
    imovelService.getAllEnderecos().subscribe((endereco) => {
      this.enderecos = endereco;
    });
    
    this.tipoImoveis = imovelService.getTipoImoveis();
    this.handleFiltrar = new EventEmitter<Filtro>();
  }

  filter = new FormGroup({
    tipo: new FormControl<string | null>(''),
    operacao: new FormControl<string | null>('COMPRAR'),
    localizacao: new FormControl<string | null>(''),
  });

  filtrar() {
    if (this.filter.valid)
      this.handleFiltrar.emit(this.filter.value as Filtro);
  }
}
