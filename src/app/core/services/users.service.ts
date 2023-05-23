import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '../models/user.models';
import { HttpClient } from '@angular/common/http';


let url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public usuario: Usuario;

  constructor(private http:HttpClient,private router:Router) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get role(): 'ADMIN_ROLE' | 'USER_ROLE' | 'MBQ_ADMIN_ROLE' {
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


  getAll(){
    return this.http.get(`${url}/api/users/all`)
  }

  postUser(body:any){

    return this.http.post( `${url}/api/users?id_usuario=${this.uid}`,body)
  }

  login( formData: any ) {
    return this.http.post(`${ url }/api/auth`, formData )
                .pipe(
                  tap( (resp: any) => {


                    this.guardarLocalStorage( resp.token,resp.user_type,resp.menu);

                  })
                );
  }
  guardarLocalStorage(token:string,type_user:any,menu:any) {


    localStorage.setItem('token', token );
    localStorage.setItem('role',type_user);
    localStorage.setItem('menu',  JSON.stringify(menu) );
  }


  validarToken(): Observable<boolean> {

    return this.http.get(`${ url }/api/auth/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
          // console.log(resp);
        const { name,email,avatar,user_type,user_id,password,createdAt,updatedAt,status,id } = resp.usuario;
          this.usuario = new Usuario(  name,email,status,user_type,user_id,createdAt,updatedAt, password, avatar ,id );

        this.guardarLocalStorage( resp.token,user_type,resp.menu);

        return true;
      }),
      catchError( error => of(false) )
    );

  }

  logout() {

    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('/account/login');

  }

  UserByid(id:string){
    return this.http.get(`${url}/api/users/find/one/${id}`)
  }
  searchByid(id:string){
    return this.http.get(`${url}/api/users/validate/${id}`)
  }

  putUser(body:any){
    return this.http.put(`${url}/api/users/${body.id}`,body)
  }
  changeStatus(type:any,id:any){
    return this.http.get(`${url}/api/users/changeStatus/${type}/${id}`)
  }

  changePassword(body:any){
    return this.http.put(`${url}/api/users/password/${body.id}`,body);

  }

  findByEmail(email:any){
    return this.http.get(`${url}/api/users/send_forgot/password/${email.email}`)

  }

  changePasswordUser(data:any){
    return this.http.get(`${url}/api/users/send_change/password/${data.id}`)
  }

  // validar token esta dentro de authcontroller en el api

  ValidToken(token:string){
    return this.http.get(`${url}/api/auth/valid/token/${token}`);
  }
}
