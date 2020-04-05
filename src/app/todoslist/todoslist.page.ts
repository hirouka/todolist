import { HelperService } from './../services/helper.service';
import { Component, OnInit, Output, AfterViewInit } from '@angular/core';
import { List } from '../model/list';
import { TodoslistService } from '../services/todoslist.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { NavController, IonItemSliding } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';

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
  todoDetail: any = {};
  showDeleteTodoSpinner = false;
  validationsform: FormGroup;
  errorMessage = '';
  public list: Array<List> = new Array<List>();
  public Listtodos: any;
  public filterData: any;
  search: boolean;
  todoList: any;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private helperService: HelperService,
    private listService: TodoslistService,
    private authservice: AuthService,
    private navCtrl: NavController,
    public route: Router, private camera: Camera
  ) {
    this.itmbool = false;
    this.a = this.authservice.a;
    this.Listtodos = this.listService.get();

  }

  ngOnInit(): void {
    console.log(this.listService.get());
    this.listService.init_fire();
    this.getTodosList();

    this.Listtodos = this.listService.get();
    this.filterData = this.listService.get();

  }

  /**
   * Renvoyer la liste des taches
   */
  getList() {
    return this.listService.get();
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

  AfficherTodo(id: string) {
    console.log("okokoko");
    this.listService.readerbool = false;
    this.listService.id = id;
    this.route.navigate(['/todo-item']);


  }

  goShare() {
    this.route.navigate(['/shared-lists']);
  }
  AddTodo() {
    this.route.navigate(['/addtodo']);
  }
  Afficherhtml2(id: string, reader: string) {
    this.listService.id = id;
    this.listService.readerbool = true;
    this.route.navigate(['/todo-item']);


  }
  deleteTodo(id: string, todoTitle: string) {
    this.helperService.presentAlertConfirm(
      'Suprimer une liste ',
      `Êtes-vous sûr(e) de vouloir supprimer   ${todoTitle} ?`,
      [
        {
          text: 'NON',
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: 'OUI',
          handler: async () => {
            try {
              this.showDeleteTodoSpinner = true;
              await this.listService.deleteTodo('todos', id);
              this.helperService.presentToast('Liste supprimee!!');
              this.showDeleteTodoSpinner = false;
              this.route.navigate(['/todoslist']);
            } catch (error) {
              this.helperService.presentToast(error.message);
              console.log('Erreur de suppression ', error);
              this.showDeleteTodoSpinner = false;
            }
          }
        }
      ]
    );
  }


  getTodosList(event = null) {
    this.listService.getTodos('todos').subscribe(result => {
      console.log('result', result);
      this.todoList = result;
      this.filterData = this.todoList;
    }, (error) => {
      this.helperService.presentToast(error.message);
    });
  }

  shareTodo(id: string) {
    this.listService.id = id;
    this.route.navigate(['/share-todo']);
  }
  goToprofile() {
    this.route.navigate(['/profile']);
  }

  getItemssearch(searchbar) {
    var q = searchbar.srcElement.value;
    console.log(q);
    this.search = true;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.search = false;
      return;
    }

    this.filterData = this.getList().filter((v) => {
      if (v.title && q) {
        if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });




  }
}

