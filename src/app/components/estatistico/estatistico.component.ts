import { Component } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

@Component({
  selector: 'app-estatistico',
  imports: [],
  templateUrl: './estatistico.component.html',
  styleUrl: './estatistico.component.scss',
})
export class EstatisticoComponent {
  CSV: string = '';

  constructor(private readonly usuarioRepositoryService: UsuarioRepositoryService) {
    this.usuarioRepositoryService.getAllUser().subscribe((data) => {
      let linhas =
        'Nome;Email;Idade;Genero;Educacao;Vocabulário de interesse;É grupo controle?;Pre-Teste Acerto;Pre-Teste Erros;Total Pergunta Pre-teste;Quizz Acerto;Quizz Erros;Total Pergunta Quizz;Qtd de perguntas;Duvida do usuário;Pos-Teste Acerto;Pos-Teste Erros;Total Pergunta Pos-teste;\n';

      const observables = data.map(
        ({ name, email, age, gender, education, password, vocabulary, IAVocabulary, ehGrupoControle, isEdit }) => {
          // Para cada item, crie um Observable que:
          return this.usuarioRepositoryService.getUserState(email).pipe(
            map(({ cursos }) => {
              // 1. Processa os dados
              const preTeste = cursos[0].atividades[0];
              const { acertos, erros, totalPerguntas } = this.getNotaPreTeste(preTeste);

              const quizz = cursos[0].atividades[2];
              const resultadoQuizz = this.getQuizzString(this.getNotaQuiz(quizz));

              const posTeste = cursos[0].atividades[3];
              const resultadoPosTeste = this.getPosTesteString(this.getNotaPosTeste(posTeste));

              // 2. Retorna a linha do CSV como uma string
              return `${name};${email};${age};${gender};${education};${vocabulary};${ehGrupoControle};${acertos};${erros};${totalPerguntas};${resultadoQuizz};${resultadoPosTeste}`;
            })
          );
        }
      );

      // Executa todos os observables e espera que todos completem
      forkJoin(observables).subscribe({
        next: (linhasArray) => {
          // 'linhasArray' é um array contendo todas as strings de linha geradas
          let linhas =
            'Nome;Email;Idade;Gênero;Escolaridade;Vocabulário;GrupoControle;PreTeste_Acertos;PreTeste_Erros;PreTeste_Total;Quizz;PosTeste\n';

          // Concatena todas as linhas com quebras de linha
          linhas += linhasArray.join('\n');

          // Salva o resultado final APÓS todas as chamadas terminarem
          this.CSV = linhas;
        },
        error: (err) => {
          console.error('Erro ao gerar CSV:', err);
          // Tratar o erro, talvez limpando this.CSV
        },
      });
    });
  }

  getPosTesteString(resultado: any) {
    const { acertos, erros, totalPerguntas } = resultado;
    return `${acertos};${erros};${totalPerguntas}`;
  }

  getQuizzString(resultado: any) {
    const { acertos, erros, totalPerguntas, qtdQuestionMade, userDoubts } = resultado;
    return `${acertos};${erros};${totalPerguntas};${qtdQuestionMade};${userDoubts}`;
  }

  getNotaQuiz(quiz: any) {
    if (!quiz.concluida) return { acertos: -1, erros: -1, totalPerguntas: -1, qtdQuestionMade: -1, userDoubts: '', sentence: '' };

    let acertos = 0;
    let erros = 0;
    let qtdQuestionMade = 0;
    let userDoubts = '';
    let sentence = '';
    for (let i = 0; i < quiz.perguntas.length; i++) {
      const pergunta = quiz.perguntas[i];
      if (pergunta.isCorrect) acertos++;
      else erros++;

      qtdQuestionMade = pergunta.qtdQuestionMade;
      userDoubts = pergunta.userDoubts;
      sentence = pergunta.sentence + "|";
    }
    return { acertos, erros, totalPerguntas: quiz.perguntas.length, qtdQuestionMade, userDoubts, sentence };
  }

  getNotaPreTeste(preTeste: any) {
    if (!preTeste.concluida) return { acertos: -1, erros: -1, totalPerguntas: -1 };

    let acertos = 0;
    let erros = 0;
    for (let i = 0; i < preTeste.perguntas.length; i++) {
      const pergunta = preTeste.perguntas[i];
      if (pergunta.opcaoSelecionada == pergunta.opcaoCorreta) acertos++;
      else erros++;
    }
    return { acertos, erros, totalPerguntas: preTeste.perguntas.length };
  }

  getNotaPosTeste(posTeste: any) {
    if (!posTeste.concluida) return { acertos: -1, erros: -1, totalPerguntas: -1 };

    let acertos = 0;
    let erros = 0;
    for (let i = 0; i < posTeste.perguntas.length; i++) {
      const pergunta = posTeste.perguntas[i];
      if (pergunta.opcaoSelecionada == pergunta.opcaoCorreta) acertos++;
      else erros++;
    }
    return { acertos, erros, totalPerguntas: posTeste.perguntas.length };
  }
}
