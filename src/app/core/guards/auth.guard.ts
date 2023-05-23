import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from '../services/users.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private usersService:UsersService,
    private router: Router) {}

canActivate(
next: ActivatedRouteSnapshot,
state: RouterStateSnapshot) {

return this.usersService.validarToken()
.pipe(
tap( estaAutenticado =>  {
 if ( !estaAutenticado ) {
   this.router.navigateByUrl('/account/login');
 }
})
);
}
  
}
