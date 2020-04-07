import { MenuController } from '@ionic/angular';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {TodoslistService} from './services/todoslist.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public authenticated = false;
    email: string;
    private firestore: any;

    constructor(private router: Router, private fires: AngularFirestore ,
         private todolistservice: TodoslistService,
         private menuCtlr: MenuController
         ) {
    }

    SendVerificationMail() {
        return firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
            });
    }

    registerUser(value) {
        return firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
            .then((result) => {
            this.SendVerificationMail(); // Sending email verification notification, when new user registers
            const userId = firebase.auth().currentUser.uid;
            const userDoc = this.fires.doc<any>('users/' + userId);
            userDoc.set({
                    firstName: value.firstName,
                    lastName: value.lastName,
                    email: value.email,
                    id : userId,
            });
        }).catch((error) => {
            window.alert(error.message);
        });
    }

    loginUser(value) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                .then(
                    (res) => {
                        if (res.user.emailVerified !== true) {
                            this.SendVerificationMail();
                            window.alert('Verifiez votre boîte mail SVP!');

                        } else {
                            resolve(res);
                            this.todolistservice.init_fire();
                            console.log('liste est : ' + this.todolistservice.listtodos);
                        }

                    },
                    err => reject(err)),
                this.email = value.email;
        });
    }

    logoutUser() {
        return new Promise((resolve, reject) => {
            if (firebase.auth().currentUser) {
                firebase.auth().signOut()
                    .then(() => {
                        this.menuCtlr.enable(false, 'menu_1');
                        resolve();
                        this.todolistservice.getUnsubscribe();
                        this.todolistservice.clean_list();
                    }).catch((error) => {
                    reject();
                } );
            }
        });
    }


    userDetails() {
        return firebase.auth().currentUser;
    }

}
