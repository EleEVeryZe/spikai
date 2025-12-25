import { Activity, AtividadeBase, Opcao } from "./atividade.model";

export interface TextoActivity extends Activity {
  texto: string;
}

export class TextoAtividade extends AtividadeBase {
    perguntas: any | Opcao[];
    texto: string;

    constructor(data: TextoActivity) {
      super(data);
      this.perguntas = data.perguntas || [];
      this.texto = data.texto ?? "";
    }
  
    public obterNota(): number {
      const acertos = this.perguntas.filter((p: any) => p.ehAcerto).length;
      return Math.round((acertos / this.perguntas.length) * 100);
    }
  
    public ehAtividadeConcluida(): boolean {
      return this.perguntas.filter((p: any) => p.ehAcerto !== undefined).length === this.perguntas.length;
    }
  }