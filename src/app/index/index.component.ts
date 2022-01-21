import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  navbarfixed: boolean = false;
  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 100) {
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }
  constructor(private router: Router,private sharedService:SharedService) { }

  ngOnInit(): void {
  }
  navigate(route) {
    this.router.navigateByUrl(route)
  }
changeLanguage(lang){
  localStorage.setItem('lang',lang)
  this.sharedService.changeLangage(lang)
}
}
