import { Injectable } from '@angular/core';

// Add to fb login 
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Firebase } from '@ionic-native/firebase/ngx'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private fb: Facebook) { }


  loginWithFacebook(){
    /*this.fb.login(['email','public_profile']).then((response: FacebookLoginResponse)=>{
      const credentials_fb = this.firebase.auth
    })*/
  }
}
