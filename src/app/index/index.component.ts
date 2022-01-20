import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigate(route) {
    this.router.navigateByUrl(route)
  }
}
