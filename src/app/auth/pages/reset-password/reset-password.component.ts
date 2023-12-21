import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResetPassword } from '../../interfaces/interfaces';
import { ConfirmPasswordValidator } from '../../helpers/confirm-passwor.validator';
import ValidateForm from '../../helpers/validateForm';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  emailToReset!:string;
  emailToken !:string;

  resetPasswordObj!:ResetPassword;


  resetFormulario: FormGroup = this.fb.group({
    password: ["",[Validators.required]],
    confirmPassword: ["",[Validators.required]]  
  },{
    validators: [ConfirmPasswordValidator("password", "confirmPassword")]
  });

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private resetPasswordService: ResetPasswordService,
              private messageService: MessageService,
              private router: Router){

  }

  ngOnInit(): void {
      this.resetPasswordObj = {
        email: '',
        newPassword: '',
        confirmPassword: '',
        emailToken: ''
      };
      this.activatedRoute.queryParams.subscribe(val =>{
        this.emailToReset = val['email'];
    
        let uriToken = val['code'];
    
        this.emailToken = uriToken.replace(/ /g,'+');    
        this.emailToken = val['code'];
      })
  }
  ReestablecerContrasena(){
    if(this.resetFormulario.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetFormulario.value.password;
      this.resetPasswordObj.confirmPassword = this.resetFormulario.value.ConfirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordService.resetPassword(this.resetPasswordObj)
        .subscribe({
          next:(res)=>{
            
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'La contraseña fue reestablecida exitosamente.' });
            //Esperar 3 segundos antes de redirigir a la vista   
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);       
          },
          error:(err)=>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio algun error en el proceso.' });
          }
        })
      
    }else{
      ValidateForm.validateAllFormFileds(this.resetFormulario);
    }

  }

}
