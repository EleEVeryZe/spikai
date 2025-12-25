import { ActivityFactory } from "./activity.factory";
import { AtividadeBase } from "./atividade.model";
import { TextoAtividade } from "./texto-activity.model";
import { Course } from "./user.model";

export class Curso {
  id: string;
  nome: string;
  titulo: string;
  concluido: number;
  atividades: AtividadeBase[];

  constructor(data: Course) {
    this.id = data.id || ""; 
    this.nome = data.nome || "";
    this.titulo = data.titulo || "";
    this.concluido = data.concluido || 0; 
    this.atividades = data.atividades.length > 0 ? data.atividades.map(atvd => ActivityFactory.create(atvd)) : []; 
  }

  ehPossivelIniciarAtividade(atividade: AtividadeBase) {
    if (atividade instanceof TextoAtividade && !this.atividades.find((atv) => atv.nome === "Quizz")?.ehAtividadeConcluida())
      return "É necessário a realização do Quizz antes de iniciar essa atividade";
    return "";
  }

  getUrlAtividade(atividade: AtividadeBase) {
    return this.id + "/" + atividade?.getUrlAtividade();
  }
}