import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotantesComponent } from './componentes/votantes/votantes.component';
import { SesionComponent } from './componentes/sesion/sesion.component';

const ROUTES: Routes = [
  {path: 'sesion', component: SesionComponent},
  {path: 'votantes', component: VotantesComponent},
  {path: '**', redirectTo: 'sesion'}
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
