export interface Atividade {
  nome: 'Pré-teste' | 'Conteúdo' | 'Quizz' | 'Pós-teste' | "Texto";
  concluida: boolean;
  dataConclusao?: Date | null;
  perguntas?: any | Opcao[];
  videos: any;
  conteudoASerImportado?: String;
  texto: string;
}

export interface Opcao {
  descricao: string;
  correta: boolean;
}