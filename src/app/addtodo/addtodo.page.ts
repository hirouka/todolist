import { HelperService } from './../services/helper.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../model/item';
import { TodoslistService } from '../services/todoslist.service';
import {List} from '../model/list';
import * as firebase from 'firebase/app';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {
  matches: string[];
  title: string;
  matchess: string[];
  showAddTodoSpinner = false;
  latitude: any;
  longitude: any;
  resultatAdress = "";

  constructor(private listService: TodoslistService,
              private router: Router ,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              private helperService: HelperService, private speechRecognition: SpeechRecognition,private cd: ChangeDetectorRef) { 
                this.getLocation();
              }

  ngOnInit() {
    this.getpermissions()
    this.getLocation();
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

}


getpermissions(){
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

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(this.longitude);
      console.log(this.latitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      this.latitude = data.coords.latitude;
      this.longitude = data.coords.longitude;
      this.getAdressLocation(this.latitude,this.longitude);
  
     });

  }

  getAdressLocation(latitude,longitude){
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
    .then((result) =>{
      this.resultatAdress = JSON.stringify(result[0]);
      console.log(this.resultatAdress);
      this.resultatAdress =  result[0].subThoroughfare + " " + result[0].thoroughfare +" " + result[0].postalCode +" " +result[0].locality;
      console.log(this.resultatAdress);
    })
    .catch((error: any) => console.log(error));

  }

  addList() {
    try {
      console.log(this.resultatAdress);
      console.log('current user is> ', firebase.auth().currentUser.email);
      const list = { title: this.title, owner : firebase.auth().currentUser.email, writers : { idWriter : firebase.auth().currentUser.email } , readers : { }, adresseCreation: this.resultatAdress} as List;
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
