import { AtividadeBase } from "./atividade.model";

export class ConteudoAtividade extends AtividadeBase {  
    public obterNota(): number {
      return 100; 
    }
  
    public ehAtividadeConcluida(): boolean {
      return this.concluida; 
    }
  }