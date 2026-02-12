import { Activity, AtividadeBase } from './atividade.model';

export interface Tema {
  id: number;
  nome: string;
  atividades: AtividadeBase[];
  completo: boolean;
  titulo: string;
}