export interface Curso {
    id: string;
  nome: string;
  titulo: string;
  concluido: number;
}

export interface User {
  name: string;
  email: string;
  age: string;
  gender: string;
  education: string;
  password: string;
  vocabulary: string;
  cursos: Curso[];
}
