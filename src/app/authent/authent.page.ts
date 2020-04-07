import { HelperService } from './../services/helper.service';
import { TodoslistService } from './../services/todoslist.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {NavController, MenuController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {resolve} from '@angular-devkit/core';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {LOGIN} from '../constants/formValidationMessage';


@Component({
  selector: 'app-authent',
  templateUrl: './authent.page.html',
  styleUrls: ['./authent.page.scss'],
})
export class AuthentPage implements OnInit {
    a: string;
    gooleprovider: auth.GoogleAuthProvider;
    mail: string;
  credential: auth.OAuthCredential;
  showDeleteTodoSpinner: boolean;
    loginForm: FormGroup;
    email: FormControl;
    password: FormControl;
    formError: any = {
        email: '',
        password: ''
    };
    validationMessage: any = LOGIN;

    constructor(
      private fb: Facebook,
      private afAuth: AngularFireAuth,
      private navCtrl: NavController,
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private fires: AngularFirestore,
      private todolistservice: TodoslistService,
      private googlePlus: GooglePlus,
      private helperService : HelperService,
      private menuCtlr: MenuController


  ) { this.menuActive();}


    ngOnInit() {
        this.createFormControl();
        this.createForm();
    }
    menuActive() {
      this.menuCtlr.enable(false, 'menu_1');
  }
    createForm() {
        this.loginForm = new FormGroup({
            email: this.email,
            password: this.password
        });
        this.loginForm.valueChanges.subscribe(data => this.onFormValueChanged(data));

    }

    onFormValueChanged(data) {
        this.formError = HelperService.prepareValidationMessage(this.loginForm, this.validationMessage, this.formError);
    }

    createFormControl() {
        this.email = new FormControl('', [
            Validators.required,
            Validators.email
        ]);
        this.password = new FormControl('', [
            Validators.required,
            Validators.minLength(5)
        ]);
    }

    loginUser(value) {
    this.authService.loginUser(value)
        .then((res) => {
                if (res.user.emailVerified !== true) {
                    this.authService.SendVerificationMail();
                    this.authService.authenticated = false;

                } else {
                    this.authService.authenticated = true;
                    console.log(res);
                    this.navCtrl.navigateForward('/todoslist');
                }
                this.mail = value.email;
            }, err => {
            console.log('Error', err);
            if (err.code === 'auth/user-not-found') {
                this.helperService.presentToast('There is no user record corresponding to this identifier');
            }
        });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }



  async loginwithgoogle() {
    this.authService.authenticated = false;

    this.googlePlus.login( {
      'sha1': '78:42:c2:d6:49:d8:3a:85:31:dd:ed:31:1b:c1:b8:63:21:ce:25:64',
        'webClientId': '920900901910-1djsishtphggrk80afk0jiicoec3n6r4.apps.googleusercontent.com',
      'offline': true
    })
      .then((response) => {
        const { idToken, accessToken } = response
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error)
        alert('error:' + JSON.stringify(error))
      });
  }
  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
      firebase.auth().signInWithCredential(credential)
      .then((response) => {
        console.log(response);
        this.authService.authenticated = true;
        this.todolistservice.init_fire();
                    const userId = firebase.auth().currentUser.uid;
                    const userDoc = this.fires.doc<any>('users/' + userId);
                    userDoc.set({
                      firstName: response.user.displayName.substr(0,response.user.displayName.indexOf(' ')),
                      lastName: response.user.displayName.substr(response.user.displayName.indexOf(' ')+1),
                      email: response.user.email,
                      id : userId,
              });

        this.navCtrl.navigateForward('/todoslist');
      });

  }

    resetPassword(value: any): any {
        this.navCtrl.navigateForward('/reset-pass');

    }


    async loginwithfacebook(): Promise<void> {
        try {
          const response = await this.fb.login(["public_profile", "email"]);
    
          console.log(response);
    
          if (response.authResponse) {
            const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
              unsubscribe();
              if (!this.isUserEqual(response.authResponse, firebaseUser)) {
                    this.credential = firebase.auth.FacebookAuthProvider.credential(
                  response.authResponse.accessToken
                );
                firebase
                  .auth()
                  .signInWithCredential(this.credential)
                  .then(()=>{
                    console.log(this.credential);
                    this.authService.authenticated = true;
                    this.navCtrl.navigateForward('/todoslist');
                    this.todolistservice.init_fire();
                    const userId = firebase.auth().currentUser.uid;
                    const userDoc = this.fires.doc<any>('users/' + userId);

                    this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {
                      var name      = user.name;
                      var email     = user.email;
      
                      userDoc.set({
                            firstName: name.substr(0,name.indexOf(' ')),
                            lastName: name.substr(name.indexOf(' ')+1),
                            email: email,
                            id : userId,
                    });
      
                  });
                  })
                  .catch(error => {
                    this.showDeleteTodoSpinner = true;
                    this.helperService.presentToast('Adresse existe déjà!!');
                    this.showDeleteTodoSpinner = false;
                    console.log(error);
                  });
                  
              } 
            });
          } else {
            // User is signed-out of Facebook.
            console.log(" deconnection ");
            firebase.auth().signOut();
          }
        } catch (err) {
          console.log(err ,'err');
        }
      }
      isUserEqual(facebookAuthResponse, firebaseUser): boolean {
        if (firebaseUser) {
          const providerData = firebaseUser.providerData;
    
          providerData.forEach(data => {
            if (
              data.providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
              data.uid === facebookAuthResponse.userID
            ) {
              // We don't need to re-auth the Firebase connection.
              return true;
            }
          });
        }
          return false;
      }
   

}
