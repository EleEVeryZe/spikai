import { Activity, AtividadeBase } from "./atividade.model";
import { Curso } from "./curso.model";
import { QuizzAtividade } from "./quizz-activity.model";

export interface Course {
  id: string;
  nome: string;
  titulo: string;
  concluido: number;
  atividades: AtividadeBase[];
}

export interface User {
  name: string;
  email: string;
  age: string;
  gender: string;
  education: string;
  password: string;
  vocabulary: string;
  cursos: Course[];
}

export class Usuario {
  name: string;
  email: string;
  age: string;
  gender: string;
  education: string;
  password: string;
  vocabulary: string;
  cursos: Curso[];
  currentCourse: Curso | undefined;

  constructor(data: User) {
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
    this.gender = data.gender;
    this.education = data.education;
    this.password = data.password;
    this.vocabulary = data.vocabulary;
    this.cursos = data.cursos ? data.cursos.map(curso => new Curso(curso)) : [];
  }

  setCurrentCourse(idCurso: any) {
    this.currentCourse = this.cursos.find(({id}) => idCurso == id + "");
    return this.currentCourse;
  }
  
  processSentences(): string[] {
    const inputSentences = (this.currentCourse?.atividades.find((atv) => atv.nome === 'Quizz') as QuizzAtividade).perguntas.map(({ sentence }: any) => sentence);
    const allWords: string[] = [];
    const ignoredPatterns = ['___'];

    inputSentences.forEach((sentence: string) => {
      const cleanedSentence = sentence.replace(/[.,!?:;"]/g, ' ').replace(new RegExp(ignoredPatterns.join('|'), 'g'), ' ');

      const words = cleanedSentence
        .split(/\s+/) 
        .filter((word) => word.length > 0)
        .map((word) => word.toLowerCase());

      allWords.push(...words);
    });

    return Array.from(new Set(allWords));
  }

  getCursoById(idCurso: string) {
    return this.cursos.find(({id}) => idCurso == id + "");
  }

  getAtividade(nameAtvd: string) {
    return this.currentCourse?.atividades.find((atv) => atv.nome === nameAtvd);
  }
  
  getPreviousTemas() {
    const idxCurso = this.cursos.findIndex(curso => curso.id === this.currentCourse?.id);
    return this.cursos.slice(0, idxCurso + 1).map(curso => curso.titulo);
  }
}
