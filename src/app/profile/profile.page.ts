import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  saveSuccess = false;


  constructor( private router: Router,
    private auth: AuthService, private alertCtrl: AlertController, 
    private loading: LoadingController ) { 

     
  }

  public save() {
    /*this.auth.register(this.info).subscribe(success => {
      if (success) {
        this.saveSuccess = true;
        this.showPopup("Success", "Thanks! Profile updated.");
      } else {
        this.showPopup("Error", "Problem updating profile.");
      }
    },
    error => {
      this.showPopup("Error", error);
    });*/
  }

  async showPopup(title, text) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.saveSuccess) {
              // console.log('create successs');
              this.router.navigateByUrl('/home');
            }
          }
        }
      ]
    });

    return await alert.present();
  }

}