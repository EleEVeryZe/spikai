/**
 * Interface representing a choice/option within a question (e.g., for a Quizz or Teste).
 */
export interface Opcao {
  descricao: string;
  correta: boolean;
}

/**
 * Interface representing a single learning activity or module within a course.
 */
export interface Activity {
  nome: 'Pré-teste' | 'Conteúdo' | 'Quizz' | 'Pós-teste' | "Texto";
  concluida: boolean;
  dataConclusao?: Date | null;
  perguntas?: any | Opcao[];
  videos: any;
  conteudoASerImportado?: String;
}

export abstract class AtividadeBase implements Activity {
  nome: 'Pré-teste' | 'Conteúdo' | 'Quizz' | 'Pós-teste' | "Texto";
  concluida: boolean;
  dataConclusao: Date | null;
  videos: any;
  conteudoASerImportado: String | undefined;

  constructor(data: Activity) {
    this.nome = data.nome;
    this.concluida = data.concluida ?? false;
    this.dataConclusao = data.dataConclusao ?? null;
    this.videos = data.videos ?? null;
    this.conteudoASerImportado = data.conteudoASerImportado;
  }

  public abstract obterNota(): number;
  public abstract ehAtividadeConcluida(): boolean;
  
  public getUrlAtividade() : string {
    return this.nome;
  };
}