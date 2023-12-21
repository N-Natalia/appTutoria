import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';



@Component({
  selector: 'app-barra-menu',
  templateUrl: './barra-menu.component.html',
  styleUrls: ['./barra-menu.component.css']
})
export class BarraMenuComponent implements OnInit {


  sidebarVisible: boolean = false;
  showCloseIcon: boolean = false;
  
  @Input() items: MenuItem[] | undefined;
  @Input() itemsMenFixed: any[] | undefined;

  constructor() {}
  
  ngOnInit() {  
   
  }

}
