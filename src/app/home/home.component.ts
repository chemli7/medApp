import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  user: User = { id: '', name: 'Hey', email: '', picture: { data: { url: '' } } };;

  constructor( private authService: AuthService ) {
    if( this.authService.userSignedIn()){
      this.user = this.authService.getUser();
    }
   }


  

  go() {
    window.location.href = "/quiz/2018/Monastir/Cardio"
  }

  ngOnInit() {
    
  }

}
