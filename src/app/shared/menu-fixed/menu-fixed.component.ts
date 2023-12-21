import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-fixed',
  templateUrl: './menu-fixed.component.html',
  styleUrls: ['./menu-fixed.component.css']
})


export class MenuFixedComponent implements OnInit{   

  @Input() itemsMenuFixed: any[] | undefined;  

  ngOnInit() {
      
  }   

}
