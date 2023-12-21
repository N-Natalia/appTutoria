
import { Component, OnInit } from '@angular/core';
import { ConfiguracionAcademicaService, RequestCargaDto, Semestre, Tutor } from 'src/app/services/Nswag/configuracion-academica.service';
import * as XLSX from 'xlsx';
import { Tutorado } from '../../../services/Nswag/configuracion-academica.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-importar-nueva-carga',
  templateUrl: './importar-nueva-carga.component.html',
  styleUrls: ['./importar-nueva-carga.component.css'],
  providers: [
    { 
      provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() 
    }
  ]
})
export class ImportarNuevaCargaComponent implements OnInit{


  lists: { [key: string]: any[] } = {
    newTutorados: [],
    newTutors: [],
    newDistribution: []
  };
  denominacionSemestre: string | undefined;

  constructor(private authService            : AuthService,
              private confAcademicaService  : ConfiguracionAcademicaService,
              private messageService        : MessageService,
              private confirmationService   : ConfirmationService){}

  ngOnInit(): void {
    
    
  }

  importFile(event: any, listName: string) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array((e.target as any).result);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheetName = workbook.SheetNames[0]; //Indice de hoja
      const worksheet = workbook.Sheets[worksheetName];

      // Cambia { header: 1 } a { header: "A" } para obtener un array de objetos
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.lists[listName] = json;
      console.log(this.lists[listName]);

      const lista = this.lists[listName];
      const labels= lista[0];
      switch (listName) {
        case 'newTutorados':
          
          if((labels[0]).toLowerCase() == "codigo" &&  (labels[1]).toLowerCase() == "nombres"  && (labels[2]).toLowerCase() == "apellidopaterno" && (labels[3]).toLowerCase() == "apellidomaterno" && (labels[4]).toLowerCase() == "email"){

            
            //A gregar usuarios y tutorados
            for (let i = 1; i < lista.length; i++) {
              
              //Agregar usuario
              const password = lista[i][0] +this.capitalizeFirstLetter(lista[i][2].toLowerCase())+"=";
              const role = "tutorado";

              this.authService.register(lista[i][0].toString(), lista[i][4], password, role)
                  .subscribe({
                    next:(res) => {},
                    error:(err) => {console.log("Ocurrio algo al agregar al usuario");
                    }                    
                  })
              //Agregar tutorado            

              let tutoradoObj = new Tutorado();
              tutoradoObj.code                        = lista[i][0].toString();
              tutoradoObj.nombres                     = lista[i][1];
              tutoradoObj.apPaterno                   = lista[i][2];
              tutoradoObj.apMaterno                   = lista[i][3];
              tutoradoObj.email                       = lista[i][4];
              tutoradoObj.direccion                   = null!;
              tutoradoObj.nroCelular                  = 0;
              tutoradoObj.personReferencia            = null!;
              tutoradoObj.nroCelularPersonaReferencia = 0;

              
              this.confAcademicaService.tutoradoPOST(tutoradoObj)
              .then(() => {   
              })
              .catch((error) => {
              })
            }   
            
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La lista de tutorados nuevos no fue agregado. Verifique que el formato del archivo importado es el correcto(Encabezado: codigo, nombres, apellidoPaterno, apellidoMaterno).' });            
          }
            
          break;
        case 'newTutors':

          if(labels[0].toLowerCase() == "codigo" &&  labels[1].toLowerCase() == "nombres"  && labels[2].toLowerCase() == "apellidopaterno" && labels[3].toLowerCase() == "apellidomaterno" && labels[4].toLowerCase() == "email"){
            
            for (let i = 1; i < lista.length; i++) {
              
              //Agregar usuario
              const password = lista[i][0] +this.capitalizeFirstLetter(lista[i][2].toLowerCase())+"=";
              const role = "tutor";

              this.authService.register(lista[i][0].toString(), lista[i][4], password, role)
                  .subscribe({
                    next:(res) => {},
                    error:(err) => {console.log("Ocurrio algun error  al agregar al usuario");
                    }                    
                  })

              let tutorObj = new Tutor();
              tutorObj.code                        = lista[i][0].toString();
              tutorObj.nombres                     = lista[i][1];
              tutorObj.apPaterno                   = lista[i][2];
              tutorObj.apMaterno                   = lista[i][3];
              tutorObj.email                       = lista[i][4];
              tutorObj.nroCelular                  = 0;
              tutorObj.lugarReunion                = null!;
              tutorObj.enlaceReunion               = null!;
  
              this.confAcademicaService.tutorPOST(tutorObj)
              .then(() => {                  
                /* this.messageService.add({ severity: 'success', summary: 'Success', detail: 'La lista de nuevos tutores fue correctamente agregado' }); */
              })
              .catch((error) => {
                /* this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al agregar la lista de nuevos alumnos.' }); */
              })
            }
            
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La lista de tutores nuevos no fue agregado. Verifique que el formato del archivo importado es el correcto(Encabezado: codigo, nombres, apellidoPaterno, apellidoMaterno).' });            
          }
                   
          break;
        case 'newDistribution':
          if(labels[0].toLowerCase() == "codigotutor" &&  labels[1].toLowerCase() == "codigotutorado"){

            //Desactivar cargas
            this.confAcademicaService.desactivarCargas()
                .then(()=>{

                  for (let i = 1; i < lista.length; i++) {
            
                    //Consultar semestre activo
                    this.confAcademicaService.semestreActivo()
                      .then(semestreActivoNuevo =>{
                        let cargaObj = new RequestCargaDto();
                        cargaObj.idSemestre    = semestreActivoNuevo.idSemestre;
                        cargaObj.idTutor       = lista[i][0].toString();
                        cargaObj.idTutorado    = lista[i][1].toString();
                        cargaObj.estado        = true;
                      
                        
                        this.confAcademicaService.cargaTutoriaPOST(cargaObj)
                        .then(() => {                  
                          /* this.messageService.add({ severity: 'success', summary: 'Success', detail: 'La carga actualizada fue agregado correctamente.' }); */
                        })
                        .catch((error) => {
                          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error al agregar la carga actualizada.' });
                        })
                    })
                  }

                })
                .catch((err)=>{
                  console.log("Ocurrio algun error al desactivar las cargas.");
                  
                })
            
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La nueva distribucion no fue agregado. Verifique que el formato del archivo importado es el correcto(Encabezado: codigoTutor, codigoTutorado).' });            
          }
                    
          break;
        default:
          // Handle invalid role
          break; 
      }
      
    };
    reader.readAsArrayBuffer(file);
  }
  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  guardar(){

  }
  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: `Esta seguro(a) que la carga que agregará pertenece al semestre "${this.denominacionSemestre}"?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          //Recuperar semestre activo
          this.confAcademicaService.semestreActivo()
              .then(semestreExistente =>{
                
                //Desactivar semestre activo
                this.confAcademicaService.desactivarSemestre(semestreExistente.idSemestre!)
                    .then(()=>{

                      //registrar semestre
                      let semestreObj = new Semestre();
                      semestreObj.denominacionSemestre  = this.denominacionSemestre!;
                      semestreObj.activo                = true;

                      this.confAcademicaService.semestrePOST(semestreObj)
                          .then(()=>{
                            this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: 'El nuevo semestre fue agregado exitosamente.' });
                          })
                          .catch(() => {
                            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Ocurrio algun error al agregar el semestre.' });
                          })
                    })
                    .catch(()=>console.log("Ocurrio algun error al desactivar el semestre")
                    )
              })           
        },
        reject: () => {          
        }
    });
 }
}
