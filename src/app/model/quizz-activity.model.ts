import { Activity, AtividadeBase, Opcao } from "./atividade.model";

export class QuizzAtividade extends AtividadeBase {
    perguntas: any | Opcao[];
  
    constructor(data: Activity) {
      super(data);
      this.perguntas = data.perguntas || [];
    }
  
    public obterNota(): number {
      const acertos = this.perguntas.filter((p: any) => p.selectedAnswer === p.correctAnswer).length;
      return Math.round((acertos / this.perguntas.length) * 100);
    }
  
    public ehAtividadeConcluida(): boolean {
      return this.perguntas.filter((p: any) => p.selectedAnswer).length === this.perguntas.length;
    }
  }