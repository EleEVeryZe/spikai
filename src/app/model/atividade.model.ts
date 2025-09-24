export interface Atividade {
  nome: 'Pré-teste' | 'Conteúdo' | 'Quizz' | 'Pós-teste';
  concluida: boolean;
  dataConclusao?: Date | null;
  perguntas?: any;
}