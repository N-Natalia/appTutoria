import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import ValidateForm from '../../helpers/validateForm';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit{

  public role: string = "";

  loading:boolean = false;

  miFormulario: FormGroup = this.fb.group({
    code: ['', [Validators.required,Validators.minLength(6)]],
    password: ['',[Validators.required,Validators.minLength(6)]
  ]

  });

  constructor(private fb: FormBuilder,
              private messageService: MessageService,
              private authService: AuthService,
              private router: Router,
              private userStoreService: UserStoreService){
  }

  ngOnInit(): void {

    this.userStoreService.getRoleFromStore()
            .subscribe(val => {
                const roleFromToken = this.authService.getRoleFromToken();
                this.role = val || roleFromToken;
            })
  }

  onlogin(){  
    if(this.miFormulario.valid){
      //console.log(this.miFormulario.value);

      //enviar objeto a la base de datos
      const {code, password} = this.miFormulario.value;
      this.authService.login(code, password)
        .subscribe({
          next:(res) => {

            this.miFormulario.reset(); 

            //Decodificar token
            const tokenPayload = this.authService.decodedToken();

            this.userStoreService.setFullNameFromStore(tokenPayload.unique_name);
            this.userStoreService.setRoleForStore(tokenPayload.role);
            this.userStoreService.setCodeFromStore(tokenPayload.nameid);

            //Mostrar mensaje de exitos
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Inicio de sesion exitosa!!' });
            //redirigir  segun el rol de usuario

            switch (this.role.toLowerCase()) {
              case 'tutor':
                setTimeout(() => {
                  this.router.navigateByUrl('/tutores/estadoReservasVoluntarias');
                }, 1000);                
                break;
              case 'tutorado':
                setTimeout(() => {
                  this.router.navigateByUrl('/tutorados/reservaVoluntaria');
                }, 1000);                
                break;
              case 'admin':
                setTimeout(() => {
                  this.router.navigateByUrl('/administrador/listTutores');
                }, 1000);                
                break;
              default:
                // Handle invalid role
                break;
            }         

          },
          error:(err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El código o contraseña ingresado es incorrecto.' });
          }
        }
    )

    }else{

      ValidateForm.validateAllFormFileds(this.miFormulario);
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Ingrese todos los datos necesarios.' });
    }

  }

  
}
