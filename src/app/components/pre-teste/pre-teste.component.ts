import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Resposta } from '../../model/resposta.model';
import { SharedUiService } from '../../services/shared-ui.service';
import { TemasService } from '../../services/temas.service';

@Component({
  selector: 'app-pre-teste',
  imports: [MatProgressBarModule, MatButtonModule, CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './pre-teste.component.html',
  styleUrl: './pre-teste.component.scss'
})
export class PreTesteComponent implements OnInit {
  perguntas: any;
  perguntaAtual: any;
  indiceAtual = 0;
  acertos = 0;
  erros = 0;
  quizFinalizado = false;
  
  opcaoSelecionada: number | null = null;
  
  respostasDoUsuario: Resposta[] = [];
  
  idCurso: string | null = null;

  constructor(private readonly sharedUi: SharedUiService, private route: ActivatedRoute, private temasService: TemasService, private snackBar: MatSnackBar, private router: Router ) { }

  ngOnInit(): void {
    

    this.route.paramMap.subscribe((params) => {
      this.idCurso = params.get('id');
      this.sharedUi.goBackTo("tema/" + this.idCurso);

      this.temasService.getAtividade(this.idCurso + "", "Pré-teste").subscribe(atvd => {
        this.perguntas = atvd?.perguntas.slice(0,3) //TODO: remover esse slice. Somente para teste
        this.carregarProximaPergunta();
      })
    });
  }

  carregarProximaPergunta() {
    if (this.indiceAtual < this.perguntas.length) {
      this.perguntaAtual = this.perguntas[this.indiceAtual];
      
      const respostaAnterior = this.respostasDoUsuario.find(r => r.perguntaIndex === this.indiceAtual);
      if (respostaAnterior) 
        this.opcaoSelecionada = respostaAnterior.opcaoSelecionada;
      else 
        this.opcaoSelecionada = this.perguntaAtual.opcaoSelecionada;
    } else {
      this.quizFinalizado = true;
    }
  }

  selecionarOpcao(opcaoIndex: number) {
    this.opcaoSelecionada = opcaoIndex;
  }
  
  avancarPergunta() {
    if (this.opcaoSelecionada === null) {
      return; 
    }
    
    const respostaExistenteIndex = this.respostasDoUsuario.findIndex(r => r.perguntaIndex === this.indiceAtual);
    if (respostaExistenteIndex !== -1) {
      this.respostasDoUsuario[respostaExistenteIndex].opcaoSelecionada = this.opcaoSelecionada;
    } else {
      this.respostasDoUsuario.push({
        perguntaIndex: this.indiceAtual,
        opcaoSelecionada: this.opcaoSelecionada
      });
    }

    if (this.indiceAtual + 1 === this.perguntas.length) {
      this.calcularPlacarFinal();
    }
    
    this.indiceAtual++;
    this.carregarProximaPergunta();
  }

  voltarPergunta() {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
      this.carregarProximaPergunta();
    }
  }
  
  calcularPlacarFinal() {
    this.acertos = 0;
    this.erros = 0;
    
    this.respostasDoUsuario.forEach(resposta => {
      if (resposta.opcaoSelecionada === this.perguntas[resposta.perguntaIndex].opcaoCorreta) {
        this.acertos++;
      } else {
        this.erros++;
      }
    });
  }

  
  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
    });
  }

  concluirPreTeste() {
    this.temasService.responderAtividade(this.respostasDoUsuario, this.idCurso).subscribe(
      {
        next: (res: any) => {
          console.log('User registered:', res);
          this.showMessage('Resultado salvo com sucesso!');
          this.router.navigate(['/tema/' + this.idCurso]);
        },
        error: (err: any) => {
          console.error(err);
          this.showMessage('Erro ao guardar resultado.', true);
        },
      }
    );
  }

  refazer() {
    this.respostasDoUsuario = [];
    this.quizFinalizado = false
    this.indiceAtual = 0;
    this.carregarProximaPergunta();
  }
}
