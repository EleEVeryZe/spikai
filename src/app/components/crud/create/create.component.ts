import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NgxMaskDirective } from 'ngx-mask';
import { Imovel } from '../../../model/imovel.model';
import { ImovelService } from '../../../services/imovel.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    NgxMaskDirective,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  formData!: FormData;
  imagensFiles = [] as File[];
  previewUrls: {url: string, fileName: string }[] = [];
  matcher = new MyErrorStateMatcher();
  tipoImoveis!: string[];
  selectedTabIndex!: number;
  httpClient!: HttpClient;

  createImovel = new FormGroup({
    //Informações do Imóvel
    operacao: new FormControl<string | null>('COMPRAR'),
    tipo: new FormControl<string | null>(''),
    qtdQuartos: new FormControl<string | null>(''),
    valor: new FormControl<string | null>(''),
    valorCondominio: new FormControl<string | null>(''),
    valorIPTU: new FormControl<string | null>(''),

    //Endereço
    rua: new FormControl<string | null>(''),
    numero: new FormControl<string | null>(''),
    bairro: new FormControl<string | null>(''),
    cidade: new FormControl<string | null>(''),
    estado: new FormControl<string | null>(''),
    cep: new FormControl<string | null>(''),

    //Características
    areaTotalM2: new FormControl<string | null>(''),
    areaConstruidaM2: new FormControl<string | null>(''),
    quantidadeBanheiros: new FormControl<number | null>(1),
    quantidadeSuites: new FormControl<number | null>(0),
    vagasGaragem: new FormControl<number | null>(1),
    dataCadastro: new FormControl<string | null>(dayjs().format('DD/MM/YYYY')),
    possuiPiscina: new FormControl<boolean | null>(false),
    possuiQuintal: new FormControl<boolean | null>(false),

    observacoes: new FormControl<string | null>(''),
  });
  router!: Router;
  isEdit = false;
  constructor(imovelService: ImovelService, httpClient: HttpClient, router: Router) {
    this.tipoImoveis = imovelService.getTipoImoveis();
    this.formData = new FormData();
    this.httpClient = httpClient;
    this.router = router;
  }

  getImovelFromPageState() {
    const navigation = this.router.getCurrentNavigation();
    return navigation?.extras?.state?.['imovel'] ?? history.state['imovel'];
  }

  ngOnInit(): void {
    const imovel = this.getImovelFromPageState();
    console.log(imovel)
    if (imovel) {
      this.isEdit = true;
      this.previewUrls = imovel.imagensComDominio.map((url: string) => ({ url, fileName: url }));
      this.createImovel.patchValue(Imovel.parseImovelIntoPlainObject(imovel));
    }
  }

  create() {
    if (!this.createImovel.valid) {
      alert('Formulário com campos inválidos');
      return;
    }

    this.imagensFiles.forEach((img, idx) => this.formData.append('file' + idx, img));

    if (this.isEdit) {
      const imovel = this.getImovelFromPageState();
      this.formData.append(
        'formData',
        JSON.stringify(
          Imovel.parsePlainObjectIntoImovel({
            id: imovel.id,
            ...this.createImovel.value,
            imagens: this.previewUrls
              .filter(({ url }) => url.indexOf('blob') === -1)
              .map(({ url }) => url.replace('http://asdfimobiliaria.s3-website-sa-east-1.amazonaws.com/', '')),
          })
        )
      );
      this.httpClient
        .post('https://rn5pjlgu8k.execute-api.sa-east-1.amazonaws.com/imovel?id=' + imovel.id, this.formData)
        .subscribe(console.log); //https://rn5pjlgu8k.execute-api.sa-east-1.amazonaws.com/imovel
    } else {
      this.formData.append(
        'formData',
        JSON.stringify(
          Imovel.parsePlainObjectIntoImovel({
            ...this.createImovel.value,
            imagens: this.previewUrls.filter(({ url }) => url.indexOf('blob') === -1).map(({ url }) => url),
          })
        )
      );
      this.httpClient.post('https://rn5pjlgu8k.execute-api.sa-east-1.amazonaws.com/imovel', this.formData).subscribe(console.log); //https://rn5pjlgu8k.execute-api.sa-east-1.amazonaws.com/imovel
    }
    this.formData = new FormData();
  }

  onFileSelected(event: any) {
    if (event.target.files.length) {
      const files = Array.from(event.target.files);
      files.forEach((file: any) => {
        this.imagensFiles.push(file);
        this.previewUrls.push({ url: URL.createObjectURL(file), fileName: file.name + file.lastModified });
      });
    }
  }

  remove(fileNameToRemove: string) {
    const removeFromUi = () => {
      const fileToRemove = this.previewUrls.find(({ fileName }) => fileName == fileNameToRemove);
      this.previewUrls = this.previewUrls.filter(({ fileName }) => fileName !== fileNameToRemove);
      this.imagensFiles = this.imagensFiles.filter((file: File) => file.name + file.lastModified == fileToRemove?.fileName);
    };

    if (Imovel.isImgStoredOnS3(fileNameToRemove)) {
      const imovel = this.getImovelFromPageState();
      this.httpClient
        .delete('https://geqdeiw727.execute-api.sa-east-1.amazonaws.com/default/alteraimovel?id=' + imovel.id + "&img=" + Imovel.removeDomainFromImgUrl(fileNameToRemove))
        .subscribe(removeFromUi);
    } else 
      removeFromUi();
  }
}
