import { Component, OnInit,AfterViewInit,ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit,AfterViewInit {
    @ViewChild('myDiv') myDiv: ElementRef;

  constructor(private elementReef:ElementRef) { }

  ngOnInit() {

}
ngAfterViewInit() {
    this.myDiv.nativeElement.innerHTML=`<button onClick='alert("fdsgfhdg")'>click me </button>`
    console.log(this.myDiv.nativeElement.innerHTML);
}
onchange(){
    console.log("hrhdfdidifdifidf");
    
}
}
