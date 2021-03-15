import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import 'firebase/firestore';
//

// Add to fb login 
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Firebase } from '@ionic-native/firebase/ngx'; 


// You don't need to import firebase/app either since it's being imported above
import 'firebase/auth';
import 'firebase/firestore';

import firebase  from 'firebase/app';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private user: User;
  userdata: string;

  constructor( private firestore: AngularFirestore,private afAuth: AngularFireAuth, private fb: Facebook, private router: Router , private http: HttpClient) { }


  loginWithFacebook3(){
    return this.fb.login(['public_profile', 'user_friends', 'email']).then((res: FacebookLoginResponse)=>{
      let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
      //this.afAuth.signInWithCredential(credential);
      
      alert(res.authResponse);

      });
  }

 /* loginWithFacebook2(){
    this.fb.login(['public_profile', 'user_friends', 'email']).then((res: FacebookLoginResponse)=>{
      let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
      this.afAuth.signInWithCredential(credential);
      this.user.img = "http://graph.facebook.com"+res.authResponse.userID+"/picture?type=square";
      this.getData(res.authResponse.accessToken);
      
      this.user.displayName=this.userdata["name"];
      this.user.email=this.userdata["email"];
      localStorage.setItem("user", JSON.stringify(this.user));
      this.updateUserData();
      this.router.navigate([""]);
      alert(this.userdata);
      });
  }*/

  loginWithFacebook2(){
    return this.fb.login(['public_profile', 'user_friends', 'email']).then((res: FacebookLoginResponse)=>{
      let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
      this.afAuth.signInWithCredential(credential);
      });
  }

  private updateUserData(){
    this.firestore.collection("users").doc(this.user.email).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    },{merge: true});

  }

  getData(access_token: string){
    let url = 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token='+ access_token;
    this.http.get(url).subscribe(data =>{
      this.userdata = JSON.stringify(data);
      console.log(data);
    })
  }


  loginWithFacebook(){
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        if (res.status == "connected"){
          console.log('Logged into Facebook!', res);
          this.router.navigate([""]);
          alert('Logged into Facebook!' + res.authResponse.userID);
        }else{
          alert("login failed");
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
}
