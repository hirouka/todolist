import {Component, OnInit, Output} from '@angular/core';
import { List } from '../model/list';
import { TodoslistService } from '../services/todoslist.service';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {NavController} from '@ionic/angular';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-todoslist',
  templateUrl: './todoslist.page.html',
  styleUrls: ['./todoslist.page.scss'],
})
export class TodoslistPage implements OnInit {
    @Output() iid;
  a: string;
  navigate: any;
  itmbool = false;
  id: string;


    validationsform: FormGroup;
  errorMessage = '';
  public list: Array<List> = new Array<List>();
  public Listtodos: any;
  public ListReaders: any;
  public ListWriters: any;
    lecture= false;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private listService: TodoslistService, private authservice: AuthService,  private navCtrl: NavController, public route: Router
  ) {
    this.itmbool = false;
    this.a = this.authservice.a;
    this.Listtodos = this.listService.get();
    this.ListReaders = this.listService.getReaders();
    this.ListWriters = this.listService.getWriters();



  }

  ngOnInit(): void {
      console.log(this.listService.get());
      this.Listtodos = this.listService.get();
      this.ListReaders = this.listService.getReaders();
      this.ListWriters = this.listService.getWriters();
  }



    /**
     * Renvoyer la liste des taches
     */
  getList() {
      return this.listService.get();
  }

    getListReaders() {
        return this.listService.getReaders();
    }

    getListWriters() {
        return this.listService.getWriters();
    }
    /**
     * Supprimer une liste de tàche
     * @param pos
     */
  delete(pos: number) {
    // tslint:disable-next-line:no-shadowed-variable
      this.listService.delete(this.getList()[pos]);
      this.listService.get();
  }
    /**
     * Se deconnecter
     */
    logOut() {
        this.authservice.logoutUser()
            .then(res => {
                this.authservice.authenticated = false;
                console.log('byebye');
                console.log(res);
                this.errorMessage = '';
                this.navCtrl.navigateForward('');
            }, err => {
                this.errorMessage = err.message;
            });

    }
    Afficherhtml(id: string) {
        this.listService.id  = id;
        this.route.navigate(['/todo-item']);


    }

    shareTodo(id: string) {
        this.listService.id = id;
        this.route.navigate(['/share-todo']);
    }
}

