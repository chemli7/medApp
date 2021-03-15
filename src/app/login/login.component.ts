import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor( private authService: AuthService, public router: Router) { }

  ngOnInit() {}

  
  loginFacebook(){
    //this.authService.loginWithFacebook();
    this.authService.loginWithFacebook2().then(res =>{
      this.router.navigate([''])
    }).catch(err=>{
      alert(err)
    })
  }



}
