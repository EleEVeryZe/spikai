import { Routes } from "@angular/router";
import { AtividadesTemaComponent } from "./components/atividades-tema/atividades-tema.component";
import { CadastroProfessorComponent } from "./components/cadastro-professor/cadastro-professor.component";
import { CadastroComponent } from "./components/cadastro/cadastro.component";
import { EstatisticoComponent } from "./components/estatistico/estatistico.component";
import { LoginComponent } from "./components/login/login.component";
import { MainComponent } from "./components/main/main.component";
import { MemorizacaoComponent } from "./components/memorizacao/memorizacao.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { PreTesteComponent } from "./components/pre-teste/pre-teste.component";
import { QuizzIaComponent } from "./components/quizz-ia/quizz-ia.component";
import { RelatorioComponent } from "./components/relatorio/relatorio.component";
import { TemasComponent } from "./components/temas/temas.component";
import { TextoComponent } from "./components/texto/texto.component";
import { AlphabetTutorComponent } from "./conteudos/alphabet-tutor/alphabet-tutor.component";
import { AuthGuard } from "./services/auth.guard";

export const routes: Routes = [
  // Redireciona "" para "principal"
  { path: "", redirectTo: "principal", pathMatch: "full" },

  // Login e cadastro
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },
  { path: "relatorio", component: RelatorioComponent },
  { path: "cadastro-professor", component: CadastroProfessorComponent },

  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TemasComponent },
      { path: 'tema/:id', component: AtividadesTemaComponent },
      { path: ':id/Pré-teste', component: PreTesteComponent },
      { path: ':id/Quizz', component: QuizzIaComponent },
      { path: ':id/Pós-teste/:ehPos', component: PreTesteComponent },
      { path: 'edit/:userId', component: CadastroComponent },
      { path: 'Memorização', component: MemorizacaoComponent },
      { path: ':id/Conteúdo', component: AlphabetTutorComponent },
      { path: ':id/Texto', component: TextoComponent },
    ],
  },

  { path: "estatistica", component: EstatisticoComponent },

  // Página de não encontrado
  { path: "not-found", component: NotFoundComponent },

  // Catch-all: qualquer rota inválida vai para not-found
  { path: "**", redirectTo: "not-found" },
];
