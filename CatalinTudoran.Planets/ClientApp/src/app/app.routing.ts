import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExplorersComponent } from "./explorers/explorers.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { PlanetsComponent } from "./planets/planets.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explorers', component: ExplorersComponent },
  { path: 'planets', component: PlanetsComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'home', component: HomeComponent }, //for testing
  { path: 'admin/home', component: HomeComponent }, //for testing
  { path: 'logout', component: HomeComponent, data: { logout: true } },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting { }
