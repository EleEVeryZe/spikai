import { Atividade } from './atividade.model';

export interface Tema {
  id: number;
  nome: string;
  atividades: Atividade[];
  completo: boolean;
  titulo: string;
  
}