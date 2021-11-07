import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RestService } from "../services/rest.service";
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private rest: RestService, private router: Router) { }


  canActivate(): boolean {
    if (this.rest.loggedIn()) {
      return true
    } else {
      this.router.navigate(['index'])
      return false
    }

  }

}
