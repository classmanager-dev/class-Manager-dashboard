import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let   decoded:any = jwt_decode(localStorage.getItem('token'));
      if ((decoded.type ==="admin"&& localStorage.getItem('center')) ||decoded.type ==="manager" ) {
        return true;
      } else {
        this.router.navigate(['students'])
        return false;
      }
  
  }
  
}
