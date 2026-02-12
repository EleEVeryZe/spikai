import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-relatorio',
  imports: [MatTableModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss'],
})
export class RelatorioComponent implements OnInit {
  dados: any[] = []; 
  cursosDisponiveis: string[] = [];
  cursoSelecionado: string = '';
  dadosFiltrados = new MatTableDataSource<any>([]);

  colunas: string[] = ['name', 'ehGrupoControle', 'vocabulary', 'preTeste', 'quizz', 'posTeste', 'qtdQuestionMade'];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/dados').subscribe((data) => {
      this.dados = data;

      this.cursosDisponiveis = [...new Set(this.dados.flatMap((u) => u.cursos.map((c: any) => c.nome)))];

      this.cursoSelecionado = this.cursosDisponiveis[0];
      this.filtrarPorCurso();
    });
  }

  @ViewChild(MatSort) sort!: MatSort;


  ngAfterViewInit() {
    this.dadosFiltrados.sort = this.sort;
  }

  filtrarPorCurso() {
    this.dadosFiltrados = this.dados
      .map((user) => {
        const curso = user.cursos.find((c: any) => c.nome === this.cursoSelecionado);
        if (!curso) return null;

        const preTeste = this.calcularPercentual(curso, 'Pré-teste');
        const quizz = this.calcularPercentual(curso, 'Quizz');
        const posTeste = this.calcularPercentual(curso, 'Pós-teste');
        const qtdQuestionMade = this.contarPerguntasQuizz(curso);
        
        return {
          name: user.name,
          ehGrupoControle: user.ehGrupoControle,
          vocabulary: user.vocabulary,
          preTeste,
          quizz,
          posTeste,
          qtdQuestionMade,
          education: user.education,
          age: user.age,
        };
      })
      .filter((u) => u !== null) as unknown as any;
  }

  calcularPercentual(curso: any, nomeAtividade: string): number {
    const atividade = curso.atividades.find((a: any) => a.nome === nomeAtividade);
    if (!atividade || !atividade.perguntas) return 0;

    const total = atividade.perguntas.length;
    const corretas = atividade.perguntas.filter(
      (p: any) => ((!!p.opcaoCorreta || p.opcaoCorreta == 0) && p.opcaoCorreta === p.opcaoSelecionada) || ( (!!p.correctAnswer || p.correctAnswer == 0) && p.correctAnswer === p.selectedAnswer) 
    ).length;

    return Math.round((corretas / total) * 100);
  }

  contarPerguntasQuizz(curso: any): number {
    const quizz = curso.atividades.find((a: any) => a.nome === 'Quizz');
    if (!quizz || !quizz.perguntas) return 0;

    return quizz.perguntas.reduce((acc: number, q: any) => {
      return acc + (q.qtdQuestionMade || 0);
    }, 0);
  }
}
