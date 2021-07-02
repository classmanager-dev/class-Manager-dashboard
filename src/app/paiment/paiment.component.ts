import { Component, OnInit } from '@angular/core';
import { RestService } from "../services/rest.service";
import { Router,ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-paiment',
  templateUrl: './paiment.component.html',
  styleUrls: ['./paiment.component.css']
})
export class PaimentComponent implements OnInit {
  payments:any
  currentPage:any
  page:Number=1
  constructor(private rest:RestService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(param=>{
      if (Number(param.get('page'))) {
        this.currentPage=Number(param.get('page'))
      }else{
        this.currentPage=this.page
      }
      this.getPayments(this.currentPage)
    })
  }
getPayments(page){
  this.rest.getPayments(page).subscribe(res=>{
    this.payments=res
    res.results.forEach(element => {
      this.rest.getStudent(element.student).subscribe(result=>{
        element.student_verbose=result
      })
    });
  console.log(this.payments);

  })
  
}
gotoDetails(id){
this.router.navigate(['/students/detail/'+id+'/paiment'])
}
pageChanged(event){

}
}
