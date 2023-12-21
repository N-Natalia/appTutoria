import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfiguracionAcademicaService } from 'src/app/services/Nswag/configuracion-academica.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [
        { provide: ConfiguracionAcademicaService, useFactory: () => new ConfiguracionAcademicaService() },
      ]
})
export class HomeComponent implements OnInit {

    codeAdministrador :string = "";
    nombreCompleto    :string = "";
    menuItems: MenuItem[] = []; //menu items sidebar
    items: any[] = [];          //menu fixed items
    
    
    constructor(private authService: AuthService,
                private router: Router,
                private configuracionAcademica: ConfiguracionAcademicaService) { }

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Tutores',
                        icon: 'pi pi-users',
                        command: () => {this.listaTutores(); }
            },
            {
                label: 'New tutoria obligatoria',
                        icon: 'pi pi-plus-circle',
                        command: () => {this.nuevaTutoriaObligatoria(); }
            },
            {
                label: 'Reportes',
                        icon: 'pi pi-book',
                        command: () => {this.reportes(); }
            },
            
            {
                label: 'Nueva distribución',
                        icon: 'pi pi-file-import',
                        command: () => {this.nuevaDistribucion(); }
            }
        ];

        this.items = [
            { label: 'Tutores', icon: 'pi pi-users', funcion: () =>this.listaTutores()  },
            { label: 'New tutoria obligatoria', icon: 'pi pi-plus-circle', funcion: () =>this.nuevaTutoriaObligatoria()  },
            { label: 'Reportes', icon: 'pi pi-book', funcion: () =>this.reportes()  },
            { label: 'Nueva distribución', icon: 'pi pi-file-import', funcion: () =>this.nuevaDistribucion()  }
        ];

        //Obtener cogido de admin
        this.codeAdministrador = this.authService.getCodeFromToken();
        //Obtener admin
        this.configuracionAcademica.administradorGET(this.codeAdministrador)
            .then(admin =>{
                this.nombreCompleto = admin.nombres +" " + admin.apPaterno + " "+admin.apMaterno;
            })

        
    }

    listaTutores() {
        this.router.navigate(['/administrador/listTutores'])      
    }
    reportes() {
        this.router.navigate(['/administrador/reportes'])        
    }
    nuevaDistribucion() {
        this.router.navigate(['/administrador/nuevaDistribucion'])
    }
    nuevaTutoriaObligatoria() {
        this.router.navigate(['/administrador/nuevaTutoriaObligatoria'])
    }
}
