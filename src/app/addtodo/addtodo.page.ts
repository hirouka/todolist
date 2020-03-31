import { HelperService } from './../services/helper.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../model/item';
import { TodoslistService } from '../services/todoslist.service';
import {List} from '../model/list';
import * as firebase from 'firebase/app';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {
  matches: string[];
  title: string;
  hello: string;
  desc: string;
  matchess: string[];
  showAddTodoSpinner = false;

  constructor(private listService: TodoslistService,
              private router: Router ,
              private helperService: HelperService, private speechRecognition: SpeechRecognition,private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {

        if (!hasPermission) {
        this.speechRecognition.requestPermission()
          .then(
            () => console.log('Granted'),
            () => console.log('Denied')
          )
        }

     });
  }
  startvoca1() {
    this.title = '';
    this.speechRecognition.startListening()
      .subscribe(
        (matchess: string[]) => {
          this.matches = matchess;
          this.title = this.matches[0].toString();
          this.cd.detectChanges();
        },
        (onerror) => console.log('error:', onerror)
      );
      //this.title = this.matches[0].toString();
}

startvoca2() {
  this.desc = '';

  this.speechRecognition.startListening()
    .subscribe(
      (matchess: string[]) => {
        this.matchess = matchess;
        this.desc = this.matchess[0].toString();
        this.cd.detectChanges();
      },
      (onerror) => console.log('error:', onerror)
    );
    //this.desc = this.matchess[0].toString();

}

  addList() {
    try {
      console.log('current user is> ', firebase.auth().currentUser.email);
      const list = { title: this.title, owner : firebase.auth().currentUser.email, writers : { idWriter : firebase.auth().currentUser.email } , readers : { }} as List;
      this.listService.addList(list);
      this.showAddTodoSpinner = false;
      this.helperService.presentToast('Lise ajoutée!');
      this.router.navigate(['/todoslist']);
    } catch (error) {
      console.log('in add todo', error);
      this.helperService.presentToast(error.message);
      this.showAddTodoSpinner = false;
    }
 
  }

  retourPagetodo() {
    window.history.back();
  }
}
