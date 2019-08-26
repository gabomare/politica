import { Component, OnInit, enableProdMode } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { reject } from 'q';

@Component({
  selector: 'app-votantes',
  templateUrl: './votantes.component.html',
  styleUrls: ['./votantes.component.css']
})
export class VotantesComponent implements OnInit {

  tiposDocumentos: any[] = [{value: 1, TipoDocumento: 'Cédula de Ciudadanía'},
                          {value: 2, TipoDocumento: 'Cédula de Extranjería'}];
  idTipoDocumento = 1;
  identificacion: string; primerNombre: string; segundoNombre: string;
  primerApellido: string; segundoApellido: string;
  fechaNacimiento: string; direccion: string; idBarrio: number; celular: string;
  correo: string; lugarVotacion: string; noMesa: string; idLider: number;
  idCandidato: number;
  multiplesCandidatos: boolean; inscritoEnEsteMunicipio = true;
  foto = ''; nombreMunicipio: string;
  candidatos: any = []; barrios: any; lideres: any;
  env: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.env = environment;
      this.idCandidato = this.env.candidatoPorDefecto;
      this.multiplesCandidatos = this.env.multiplesCandidatos;
      this.nombreMunicipio = this.env.nombreMunicipio;
      this.obtenerCandidato();
      this.obtenerBarrios(this.env.urlApi, environment.idMunicipio);
      this.obtenerLideres(environment.urlApi, environment.idMunicipio);
  }
  obtenerCandidato() {
    return new Promise((resolve, reject) => {
      this.http.get(environment.urlApi + 'candidato', { }).subscribe((data) => {
          this.candidatos = data;
          this.asignarFoto();
          resolve(data);
      }, (error) => {
         reject(error);
      });
    });
  }
  asignarFoto(){
    for(let i = 0; i < this.candidatos.length; i++){
       if(this.candidatos[i].idCandidato === this.idCandidato){
           this.foto = this.candidatos[i].Foto;
       }
    }
  }
  obtenerBarrios(url: string, idMunicipio: number){
    return new Promise((resolve, reject) => {
      this.http.get(url + 'barrio?idMunicipio=' + idMunicipio).subscribe((data) => {
         this.barrios = data;
         resolve(data);
      }, (error) => {
         reject(error);
      });
    });
  }
  obtenerLideres(url: string, idMunicipio: number){
    return new Promise((resolve, reject) => {
      this.http.get(url + 'lider?idMunicipio=' + idMunicipio).subscribe((data) => {
         this.lideres = data;
         resolve(data);
      }, (error) => {
         reject(error);
      });
    });
  }
}
