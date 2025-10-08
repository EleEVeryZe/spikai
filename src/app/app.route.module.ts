import { Routes } from "@angular/router";
import { AtividadesTemaComponent } from "./components/atividades-tema/atividades-tema.component";
import { CadastroComponent } from "./components/cadastro/cadastro.component";
import { CreateComponent } from "./components/crud/create/create.component";
import { ImovelDetailsComponent } from "./components/imovel-details/imovel-details.component";
import { LoginComponent } from "./components/login/login.component";
import { MainComponent } from "./components/main/main.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { PreTesteComponent } from "./components/pre-teste/pre-teste.component";
import { QuizzIaComponent } from "./components/quizz-ia/quizz-ia.component";
import { TemasComponent } from "./components/temas/temas.component";
import { AuthGuard } from "./services/auth.guard";

export const routes: Routes = [
  // Redireciona "" para "principal"
  { path: "", redirectTo: "principal", pathMatch: "full" },

  // Login e cadastro
  { path: "login", component: LoginComponent },
  { path: "cadastro", component: CadastroComponent },

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
    ],
  },

  // Tema e escolha do tema
  
  //{ path: 'tema/:nome', component: TemaDetalheComponent }, // você cria esse componente

  // CRUD de imóveis
  { path: "details/:id", component: ImovelDetailsComponent },
  { path: "create", component: CreateComponent },
  { path: "edit", component: CreateComponent },

  // Página de não encontrado
  { path: "not-found", component: NotFoundComponent },

  // Catch-all: qualquer rota inválida vai para not-found
  { path: "**", redirectTo: "not-found" },
];
