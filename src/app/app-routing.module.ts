import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotantesComponent } from './componentes/votantes/votantes.component';

const ROUTES: Routes = [
  {path: 'votantes', component: VotantesComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
