import { Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'classManager';
  ngOnInit(){
    // localStorage.clear()
          localStorage.setItem('token',"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ1Mjc5OTQ2LCJqdGkiOiJkZGFjYWVkNDI1Nzc0NzJlYTkyOWI5YzM2MmIxNmFiZSIsInVzZXJfaWQiOjJ9.ZVhNcoaiDKlmFWZ2LrbJR2QBQdVUVcocHYZh7r3ewNg")
  }
}
