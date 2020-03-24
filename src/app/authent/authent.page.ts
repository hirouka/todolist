import { TodoslistService } from './../services/todoslist.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {NavController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {resolve} from '@angular-devkit/core';
import * as firebase from 'firebase';


@Component({
  selector: 'app-authent',
  templateUrl: './authent.page.html',
  styleUrls: ['./authent.page.scss'],
})
export class AuthentPage implements OnInit {
    a: string;
    gooleprovider: auth.GoogleAuthProvider;
    mail: string;
  constructor(
      private fb: Facebook,
      private afAuth: AngularFireAuth,
      private navCtrl: NavController,
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private fires: AngularFirestore,
      private todolistservice: TodoslistService

  ) { }
 /* email: string;
  emailSent = false;
  error = null;
  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService) {
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    this.router.navigate(['todoslist']);

  }
    login1() {
    this.emailSent = false;
    this.error = null;
    this.authService.signIn(this.email)
        .then(
            () => this.emailSent = true
        )
        .catch(
            error => this.error = error
        );
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  ngOnInit() {}*/

    validationsform: FormGroup;
    errorMessage = '';


    validation_messages = {
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'pattern', message: 'Please enter a valid email.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' },
            { type: 'minlength', message: 'Password must be at least 5 characters long.' }
        ]
    };
    ngOnInit() {

        this.validationsform = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required
            ])),
        });
    }

    loginUser(value) {
    this.authService.loginUser(value)
        .then((res) => {
                if (res.user.emailVerified !== true) {
                    this.authService.SendVerificationMail();
                    this.authService.authenticated = false;

                } else {
                    this.authService.authenticated = true;
                    console.log('bonjour');
                    console.log(res);
                    this.errorMessage = '';
                    this.navCtrl.navigateForward('/todoslist');
                }
                this.mail = value.email;
            }, err => {
          this.errorMessage = err.message;
        });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

  loginwithgoogle() {
        this.gooleprovider  = new auth.GoogleAuthProvider();
        this.authService.authenticated = false;
        this.afAuth.auth.signInWithPopup(this.gooleprovider).then((r) => { this.authService.authenticated = true;
                                                                           this.navCtrl.navigateForward('/todoslist');
        });

    }

    resetPassword(value: any): any {
        this.navCtrl.navigateForward('/reset-pass');
        /*console.log(value.email);
        return firebase.auth().sendPasswordResetEmail(value.email);*/
    }

    loginwithfacebook() {
      this.loginwithfacebook0();
       /* this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => {
                this.authService.authenticated = true;
                console.log('res facbook connect ',res);
                this.navCtrl.navigateForward('/todoslist');
            }
                )
            .catch(e => console.log('Error  Facebook', e));
        this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);*/
    }



    async loginwithfacebook0(): Promise<void> {
        try {
          const response = await this.fb.login(["public_profile", "email"]);
    
          console.log(response);
    
          if (response.authResponse) {
            // User is signed-in Facebook.
            const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
              unsubscribe();
              // Check if we are already signed-in Firebase with the correct user.
              if (!this.isUserEqual(response.authResponse, firebaseUser)) {
                // Build Firebase credential with the Facebook auth token.
                const credential = firebase.auth.FacebookAuthProvider.credential(
                  response.authResponse.accessToken
                );
                // Sign in with the credential from the Facebook user.
                firebase
                  .auth()
                  .signInWithCredential(credential)
                  .then(()=>{
                    this.authService.authenticated = true;
                    this.navCtrl.navigateForward('/todoslist');
                    this.todolistservice.init_fire();
                  })
                  .catch(error => {
                    console.log(error,'hello facebook');
                  });
                  
              } else {
                // User is already signed-in Firebase with the correct user.
                console.log("already signed in");
              }
            });
          } else {
            // User is signed-out of Facebook.
            console.log("sign out ");
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
