import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Added for login 
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import 'firebase/auth';
import 'firebase/firestore';

import firebase  from 'firebase/app';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  data: string= "HEY";

  isLoggedIn: boolean = false;
  
  users: User ={ id: '', name: '', email: '', picture: { data: { url: '' } } };  
  constructor(private firestore: AngularFirestore,private afAuth: AngularFireAuth, private fb: Facebook, private authService: AuthService, public router: Router) {
    

    this.data = "HEY";
    /*fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if (res.status == 'connect') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e)); */
   }

  ngOnInit() {
    this.isLoggedIn = this.authService.userSignedIn()
  }
  

  fbLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        // Firebase ----------------
        let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.afAuth.signInWithCredential(credential);
        // -----------------------------------
        if (res.status == 'connected') {
          this.isLoggedIn = true;
          this.getAndUpdateUserDetail(res.authResponse.userID);
          this.router.navigate([""]);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  private updateUserData(userid: any){
    this.firestore.collection("users").doc(userid).set({
      id: userid,
      displayName: this.users.name,
      email: this.users.email, 
      imageUrl: "To be added"
    },{merge: true});

  }

  getAndUpdateUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => {
        console.log(res);
        this.users = res;
        this.updateUserData(userid);
        localStorage.setItem("user", JSON.stringify(this.users));
      })
      .catch(e => {
        console.log(e);
      });
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
    localStorage.removeItem("user");
    this.users=null;
    this.router.navigate(["login"]);
  }
  
  /*loginFacebook(){
    //this.authService.loginWithFacebook();
    this.authService.loginWithFacebook2().then(res =>{
      this.router.navigate([''])
    }).catch(err=>{
      alert(err)
    })
  }*/



}
