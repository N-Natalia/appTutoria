import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import ValidateForm from '../../helpers/validateForm';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers:[MessageService]
})
export class ForgotPasswordComponent {
  
  forgotFormulario: FormGroup = this.fb.group({
    email: ['', [Validators.required,Validators.email]]
  
  });

  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(private fb: FormBuilder,
              private messageService: MessageService,
              private resetPasswordService: ResetPasswordService){

  }
  onReset(){
    if(this.forgotFormulario.valid){

      const {email} = this.forgotFormulario.value;
      console.log(email);      
      //API call
      this.resetPasswordService.sendResetPasswordLink(email)
        .subscribe({
          next: (res) =>{
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Su solicitud fue enviada exitosamente.' });
            this.forgotFormulario.reset();
            
          },
          error:(err)=>{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el email.' });
          }
        })      
    }
    else{
      ValidateForm.validateAllFormFileds(this.forgotFormulario);
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Ingrese el campo vacio.' });    
    }
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
}
