import { HelperService } from './../services/helper.service';
import { Router } from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {List} from '../model/list';
import {TodoslistService} from '../services/todoslist.service';
import {AuthService} from '../auth.service';
import {NavController} from '@ionic/angular';
import {Item} from '../model/item';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-todo-item',
    templateUrl: './todo-item.page.html',
  styleUrls: ['./todo-item.page.scss'],
})
export class TodoItemPage implements OnInit {
  @Input() id: string;
  a: string;
  validationsform: FormGroup;
  errorMessage = '';
  public items: Array<Item> = new Array<Item>();
  readerbool: boolean;
  todoItemsId = '';

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private listService: TodoslistService, 
              private authservice: AuthService, 
              private navCtrl: NavController ,
              private router: Router,
              private helperService: HelperService,
              public afDB: AngularFireDatabase

  ) {
    
    this.readerbool = this.listService.readerbool;
    this.a = this.authservice.a;
  }

  ngOnInit(): void {
    this.listService.getItems().subscribe(res => {
      this.items = res;
    });
  }

  getList() {
    return this.listService.get();
  }
  // RETOUR LIST DE ITEMS
  OpenAddItemPage() {
    this.router.navigate(['/additem']);
  }
  deleteItem(itemId: string,itemTitle:string,) {
    this.helperService.presentAlertConfirm(
        'Supprimer la tâche ',
        `Etes vous sûr de vouloir supprimer  ${itemTitle}`,
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
                    await this.listService.deleteItem(itemId,this.listService.id);
                    this.helperService.presentToast('Têche supprimée!');
                } catch (error) {
                    this.helperService.presentToast(error.message);
                    console.log('Erreur lors de la suppression', error);
                }
            }
        }
        ]
    );
}

EditItem(item: Item,itemTitle:string){
  this.listService.item = item;
  this.router.navigate(['/edit-item']);
}

  delete(pos: number) {
    // tslint:disable-next-line:no-shadowed-variable
    this.listService.delete(this.items[pos]);
    this.listService.get();
  }


  changeCheckState(item: Item) {
    console.log('bool',this.readerbool);
    console.log(item.isDone);
    this.listService.update(item);


  }

}
