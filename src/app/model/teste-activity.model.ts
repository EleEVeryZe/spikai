import { Activity, AtividadeBase, Opcao } from "./atividade.model";


export class TesteAtividade extends AtividadeBase {
    perguntas: any | Opcao[];
    
    constructor(data: Activity) {
      super(data);
      this.perguntas = data.perguntas || [];
    }
  
    public obterNota(): number {
      const acertos = this.perguntas.filter((p: any) => p.opcaoSelecionada === p.opcaoCorreta).length;
      return Math.round((acertos / this.perguntas.length) * 100);
    }
  
    public ehAtividadeConcluida(): boolean {
      return this.perguntas.filter((p: any) => p.opcaoSelecionada !== undefined).length === this.perguntas.length;
    }

    public override getUrlAtividade() {
      if (this.nome === "Pós-teste")
        return `${this.nome}/true`

      return "" + this.nome
    }
  }