import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-votantes',
  templateUrl: './votantes.component.html',
  styleUrls: ['./votantes.component.css']
})
export class VotantesComponent implements OnInit {

  tiposDocumentos: any[] = [{value: 1, TipoDocumento: 'Cédula de Ciudadanía'},
                          {value: 2, TipoDocumento: 'Cédula de Extranjería'}];
  SINO: any[] = [{value: 1, SINO: 'Sí'},
                 {value: 2, SINO: 'No'}];

  idTipoDocumento = 1;
  identificacion: string; primerNombre: string; segundoNombre: string;
  primerApellido: string; segundoApellido: string;
  fechaNacimiento: string; direccion: string; idCorregimiento: number; idBarrio: number; celular: string;
  correo: string; lugarVotacion: number; noMesa = -1; idLider: number;
  idCandidato: number;
  multiplesCandidatos: boolean; inscritoEnEsteMunicipio = true;
  foto = ''; nombreMunicipio: string;
  candidatos: any = []; barrios: any; lideres: any; corregimientos: any; lugaresVotacion: any;
  mesas: any;
  env: any; habilitado = 'disabled'; deCorregimiento = 1;
  public contexto = this;
  public formGroup: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
   }

  ngOnInit() {
      this.enviarMensaje();
      this.env = environment;
      this.idCandidato = this.env.candidatoPorDefecto;
      this.nombreMunicipio = this.env.nombreMunicipio;
      this.obtenerCandidato();
      this.obtenerBarrios(this.env.urlApi, environment.idMunicipio, -1);
      this.obtenerLideres(this.env.urlApi, this.env.idMunicipio);
      this.obtenerCorregimientos(this.env.urlApi, this.env.idMunicipio);
      this.obtenerLugaresVotacion(this.env.urlApi, environment.idMunicipio, -1);
      this.construirForm(this.idCandidato);
      this.multiplesCandidatos = this.env.multiplesCandidatos;
  }
  obtenerCandidato() {
    return new Promise((resolve, rejec) => {
      this.http.get(environment.urlApi + 'candidato').subscribe((data) => {
          this.candidatos = data;
          this.asignarFoto();
          resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }
  asignarFoto(){
    for (let i = 0; i < this.candidatos.length; i++){
       if(this.candidatos[i].idCandidato === this.idCandidato){
           this.foto = this.candidatos[i].Foto;
       }
    }
  }
  obtenerBarrios(url: string, idMunicipio: number, idCorregimiento: number) {
    return new Promise((resolve, rejec) => {
      this.http.get(url + 'barrio?idMunicipio=' + idMunicipio + '&idCorregimiento=' + idCorregimiento).subscribe((data) => {
         this.barrios = data;
         resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }
  obtenerLideres(url: string, idMunicipio: number){
    return new Promise((resolve, rejec) => {
      this.http.get(url + 'lider?idMunicipio=' + idMunicipio).subscribe((data) => {
         this.lideres = data;
         resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }
  obtenerCorregimientos(url: string, idMunicipio: number){
    return new Promise((resolve, rejec) => {
      this.http.get(url + 'corregimiento?idMunicipio=' + idMunicipio).subscribe((data) => {
         this.corregimientos = data;
         resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }
  obtenerLugaresVotacion(url: string, idMunicipio: number, idCorregimiento: number){
    return new Promise((resolve, rejec) => {
      this.http.get(url + 'lugarvotacion?idMunicipio=' + idMunicipio + '&idCorregimiento=' + idCorregimiento).subscribe((data) => {
         this.lugaresVotacion = data;
         resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }
  obtenerMesasLugarVotacion(url: string, idLugarVotacion: number){
    return new Promise((resolve, rejec) => {
      this.http.get(url + 'mesas?idLugarVotacion=' + idLugarVotacion).subscribe((data) => {
         this.mesas = data;
         resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }
  changeCorregimiento() {
     try {
        let idMun: number = this.env.idMunicipio;

        if (this.formGroup.controls.idCorregimiento.value === -1) {
           idMun = -1;
        }
        this.formGroup.controls.idBarrio.setValue(-1);
        this.formGroup.controls.lugarVotacion.setValue(-1);
        this.formGroup.controls.noMesa.setValue(-1);

        this.obtenerBarrios(this.env.urlApi, idMun, this.formGroup.controls.idCorregimiento.value);
        this.obtenerLugaresVotacion(this.env.urlApi, idMun, this.formGroup.controls.idCorregimiento.value);
        this.obtenerMesasLugarVotacion(this.env.urlApi, idMun);
     } catch (error) {
     }
  }
  changeLugarVotacion() {
    this.formGroup.controls.noMesa.setValue(-1);
    this.obtenerMesasLugarVotacion(this.env.urlApi, this.formGroup.controls.lugarVotacion.value);
  }
  public async registrarVotante() {
    try {
      if (this.formGroup.valid) {
        // tslint:disable-next-line: no-debugger
        debugger;
        const df = this.formGroup.controls;
        const td = df.idTipoDocumento.value; const iden = df.identificacion.value;
        const pn = df.primerNombre.value; const sn = df.segundoNombre.value;
        const pa = df.primerApellido.value; const sa = df.segundoApellido.value;
        const idc = df.idCandidato.value; const cl = df.celular.value;
        const dir = df.direccion.value; const idb = df.idBarrio.value;
        const idm = this.env.idMunicipio; const idcr = df.idCorregimiento.value;
        const em = df.correo.value; const fn = df.fechaNacimiento.value;
        const lv = df.lugarVotacion.value; const nm = df.noMesa.value;
        const ld = df.idLider.value; const ins = df.inscritoEnEsteMunicipio.value;

        const datos = {TipoDocumento: td, Identificacion: iden, PrimerNombre: pn,
                       SegundoNombre: sn, PrimerApellido: pa, SegundoApellido: sa,
                       idCandidato: idc, Celular: cl, Direccion: dir, idBarrio: idb,
                       idMunicipio: idm, idCorregimiento: idcr, Correo: em,
                       FechaNacimiento: fn, idLugarVotacion: lv, NoMesa: nm,
                       Lider: ld, InscritoEnEsteMunicipio: ins };

        const resp = await this.adicionaVotante(datos).catch((error) => {
          debugger;
          if (error.error.ExceptionMessage.indexOf('clave duplicada') !== -1) {
              alert('Señor usuario: el votante ya ha sido regisrado. No se puede duplicar. Verifiquelo e intente de nuevo');
          } else {
            alert(error.error.ExceptionMessage);
          }
          return [{resultado: 0}];
        });
        // tslint:disable-next-line:radix
        if (parseInt(resp[0].resultado) === 1) {
           this.construirForm(this.idCandidato);
           alert('Votante registrado con éxito');
        }
      } else {
        alert('Los campos en rojo son obligatorios. ¡Por favor diligéncialos!');
      }
    } catch (error) {
        alert(error);
    }
  }
  public adicionaVotante(datos: any){
    return new Promise((resolve, rejec) => {
      this.http.post(this.env.urlApi + 'votante', datos).subscribe((data) => {
         resolve(data);
      }, (error) => {
         rejec(error);
      });
    });
  }

  private construirForm(idCandidato: number) {
     try {
         this.formGroup = this.formBuilder.group({
          idCandidato: [this.idCandidato, [Validators.required]],
          idTipoDocumento: [1, [Validators.required]],
          identificacion: ['', [Validators.required]],
          primerNombre: ['', [Validators.required]],
          segundoNombre: [''],
          primerApellido: ['', [Validators.required]],
          segundoApellido: [''],
          fechaNacimiento: ['', [Validators.required]],
          direccion: ['', [Validators.required]],
          idBarrio: [-1, [Validators.required, this.validarSelecione]],
          celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          correo: [],
          lugarVotacion: [-1, [Validators.required, this.validarSelecione]],
          noMesa: [-1, [Validators.required, this.validarSelecione]],
          idLider: [-1, [Validators.required, this.validarSelecione]],
          inscritoEnEsteMunicipio: [1, [Validators.required]],
          deCorregimiento: [this.deCorregimiento, [Validators.required]],
          idCorregimiento: [-1]
         });

         this.formGroup.controls.identificacion.valueChanges.subscribe(data => {
         });


     } catch (error) {
         alert(error);
     }
  }
  public cambioSINOMunicipio() {
     try {
       // tslint:disable-next-line:radix
       const sw: boolean = parseInt(this.formGroup.controls.deCorregimiento.value) === 1 ? true : false;
       let idMun = -1;

       if (sw) {
          this.idCorregimiento = -1;
          idMun = this.env.idMunicipio;
       }
       this.formGroup.controls.idBarrio.setValue(-1);
       this.formGroup.controls.lugarVotacion.setValue(-1);
       this.formGroup.controls.noMesa.setValue(-1);
       this.formGroup.controls.idCorregimiento.setValue(-1);
       this.obtenerBarrios(this.env.urlApi, idMun, -1);
       this.obtenerLugaresVotacion(this.env.urlApi, idMun, -1);
       this.obtenerMesasLugarVotacion(this.env.urlApi, idMun);
       this.deshabilitarControl('idCorregimiento', sw);

     } catch (error) {
     }
  }
  private deshabilitarControl(nombre: string, deshabilitar: boolean){
    try {
      if (deshabilitar) {
        this.formGroup.controls[nombre].disable();
      } else {
        this.formGroup.controls[nombre].enable();
      }
    } catch (error) {

    }
  }

  private validarSelecione(control: AbstractControl) {
    const valorControl = control.value;

    let error = null;
    if (parseInt(valorControl, 0) === -1) {
      error = { ...error, error: 'seleccione una opción' };
    }
    return error;
  }
  public enviarMensaje() {
    // URL for request POST /message
    // https://eu46.chat-api.com/instance62341/ and token snzmbiyavk80ghk4
    // $url = 'https://eu12.chat-api.com/instance6927/message?token=haalv4iox2vsybnb';
      // debugger;
      // const url = 'https://eu46.chat-api.com/instance62341/message?token=snzmbiyavk80ghk4';
      // const data = {
      //     phone: '573104567541', // Receivers phone
      //     body: 'Hello, Prueba de envío masiva a SANDRA Y GABRIEL!', // Message
      // };
      // // Send a request
      // this.http.post(url, data).subscribe((data) => {
      //     debugger;
      // });
  }
}
