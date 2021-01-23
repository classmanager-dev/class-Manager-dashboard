import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RestService } from "../services/rest.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private rest:RestService){}


  canActivate(): boolean {
    if (this.rest.loggedIn()){
      return true 
    }else {
     console.log("u don't have enough permission to perform this action ");
     
      return false
    }

  }
  
}
