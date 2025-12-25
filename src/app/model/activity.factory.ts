import { Activity, AtividadeBase } from "./atividade.model";
import { ConteudoAtividade } from "./conteudo-activity.model";
import { QuizzAtividade } from "./quizz-activity.model";
import { TesteAtividade } from "./teste-activity.model";
import { TextoAtividade } from "./texto-activity.model";

export class ActivityFactory {
    static create(data: Activity): AtividadeBase {
        switch (data.nome) {
            case 'Pré-teste':
            case 'Pós-teste':
                return new TesteAtividade(data);
            case 'Quizz':
                return new QuizzAtividade(data);
            case 'Conteúdo':
                return new ConteudoAtividade(data);
            case 'Texto':
                return new TextoAtividade(data as TextoAtividade);
            default:
                return new ConteudoAtividade(data);
        }
    }
}