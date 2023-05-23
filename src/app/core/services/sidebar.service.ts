import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {


  public menusss:any [] = [];

  cargarMenu() {

    let   menus  = JSON.parse(localStorage.getItem('menu')) || [];
    this.menusss = [

    ...menus
    ];


  }
}
