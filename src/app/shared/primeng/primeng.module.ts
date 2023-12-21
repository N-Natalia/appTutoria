import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { MegaMenuModule } from 'primeng/megamenu';
import { PasswordModule } from 'primeng/password';

import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { SidebarModule } from 'primeng/sidebar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { RadioButtonModule } from 'primeng/radiobutton';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    AccordionModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DividerModule,
    DropdownModule,
    DialogModule,
    FileUploadModule,
    ImageModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    InputMaskModule,
    SidebarModule,
    MenuModule,
    MessagesModule,
    MegaMenuModule,
    PasswordModule,
    ToastModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
    TreeTableModule,
    TriStateCheckboxModule,
    StyleClassModule,
    SelectButtonModule,
    VirtualScrollerModule,
    RadioButtonModule
  ],
  providers:[
    MessageService
  ]
})
export class PrimengModule { }
