import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-votantes',
  templateUrl: './votantes.component.html',
  styleUrls: ['./votantes.component.css']
})
export class VotantesComponent implements OnInit {

  tiposDocumentos: any[] = [{value: 1, TipoDocumento: 'Cédula de Ciudadanía'},
                          {value: 2, TipoDocumento: 'Cédula de Extranjería'}];
  idTipoDocumento = 1;
  identificacion: string;
  constructor() { }

  ngOnInit() {
  }

}
