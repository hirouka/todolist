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
      private formBuilder: FormBuilder

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
        console.log(value.email);
        return firebase.auth().sendPasswordResetEmail(value.email);
    }

    loginwithfacebook() {

        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
            .catch(e => console.log('Error logging into Facebook', e));
        this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }


}
