import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/user.models';
import { UsersService } from './users.service';

const base_url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  public usuario: Usuario;

  constructor(private http:HttpClient,private usersService:UsersService) {
    this.usuario = usersService.usuario;
   }


  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.user_type;
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }



  putFiles(data:any,folder_id:string){
    let base = `${base_url}/api/upload/files/${folder_id}?id_usuario=${this.uid}`;
    console.log(this.uid);
    return this.http.put(base,data,this.headers);
  }

  getFiles(){


    let base ;
    if(localStorage.getItem('role') === 'USER_ROLE'){
      base =  `${base_url}/api/upload?id_usuario=${this.uid}`;
    }else{
      base = `${base_url}/api/upload`;
    }
    return this.http.get(base,this.headers);
  }

  getDownloadfile(id:any){
    let base = `${base_url}/api/upload/download/file/${id}`;
    return this.http.get(base,{responseType:'blob', headers: {
      'x-token': this.token
    }});
  }
  putDeleteFile(id:string){
    let base = `${base_url}/api/upload/delete/${id}`;
    return this.http.get(base,this.headers);
  }
// ** directories
  createDirectory(body:any){

    let base;

    if(localStorage.getItem('role') === 'USER_ROLE'){
      base = `${base_url}/api/upload/directory?id_usuario=${this.uid}`;
    }else{
        base = `${base_url}/api/upload/directory`;
    }

    return this.http.post(base,body,this.headers);
  }

  getDirectories(){
    let base = `${base_url}/api/upload/list/directories`;
    return this.http.get(base,this.headers);
  }

  filterByCode(code:string,id:string){
    return this.http.get(`${base_url}/api/upload/all/files/byID/${code}/${id}`,this.headers);
  }
  filterByID(id:string){
    return this.http.get(`${base_url}/api/upload/${id}`,this.headers);
  }

  getfilesActive(){
    return this.http.get(`${base_url}/api/upload/all/files/active`,this.headers);
  }
}
