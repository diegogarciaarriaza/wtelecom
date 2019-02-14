import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  userLogin = {"username": "", "password": ""}

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  acceder() {
    console.log(this.userLogin.username)
    console.log(this.userLogin.password)

    if(this.userLogin.username == "admin" && this.userLogin.password == "admin"){
      this.router.navigate(['/billing']);
    }
  }

  ngOnInit(): void {
  }
}
