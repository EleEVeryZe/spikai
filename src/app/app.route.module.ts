import { Routes } from "@angular/router";
import { CadastroComponent } from "./components/cadastro/cadastro.component";
import { CreateComponent } from "./components/crud/create/create.component";
import { ImovelDetailsComponent } from "./components/imovel-details/imovel-details.component";
import { LoginComponent } from "./components/login/login.component";
import { MainComponent } from "./components/main/main.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthGuard } from "./services/auth.guard";

export const routes : Routes = [  
  { path: "",  component: LoginComponent },
  { path: "login",  component: LoginComponent },
  { path: "cadastro",  component: CadastroComponent },
  { path: "principal", canActivate: [AuthGuard], component: MainComponent },
  
  { path: "details/:id", component: ImovelDetailsComponent },
  { path: "create", component: CreateComponent },
  { path: "edit", component: CreateComponent },
  
  { path: "not-found", component: NotFoundComponent },
  
]
