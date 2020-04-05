import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {TodoslistService} from '../services/todoslist.service';

@Component({
  selector: 'app-shared-lists',
  templateUrl: './shared-lists.page.html',
  styleUrls: ['./shared-lists.page.scss'],
})
export class SharedListsPage implements OnInit {
  public ListReaders: any;
  public ListWriters: any;
  public filterDataR : any;
  public filterDataW : any;
  privatesearch: boolean;
  search = false;

  constructor(private listService: TodoslistService , private route : Router) { }

  ngOnInit() {
    this.getTodosListReaders();
    this.getTodosListWriters();
  }
  getListReaders() {
    return this.listService.getReaders();
  }

  getItemssearch(searchbar) { 
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    console.log(q);
    this.search = true; 

    // if the value is an empty string don't filter the items
    if (!q) {
        this.search = false;
      return;
    }
    this.filterDataR =this.getListReaders().filter((v) => {
        if(v.title && q) {
          if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });

      this.filterDataW =this.getListWriters().filter((v) => {
        if(v.title && q) {
          if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });

  }
  shareTodo(id: string) {
    this.listService.id = id;
    this.route.navigate(['/share-todo']);
  }

  
  getTodosListReaders(event = null) {
    this.listService.getTodosReaders('todos').subscribe(result => {
      console.log('result', result);
      this.ListReaders = result;
      this.filterDataR = this.ListReaders;
    }, (error) => {
    });
  }

  getTodosListWriters(event = null) {
    this.listService.getTodosWriters('todos').subscribe(result => {
      console.log('result', result);
      this.ListWriters = result;
      this.filterDataR = this.ListReaders;
    }, (error) => {
    });
  }


  getListWriters() {
    return this.listService.getWriters();
  }

  onlist(){
    this.route.navigate(['/todoslist']);
  }

  AfficherItems(id: string , reader : string) {
    this.listService.id  = id;
    this.listService.readerbool = true;
    this.route.navigate(['/todo-item']);


}

AfficherTodo(id: string) {
  console.log("okokoko");
    this.listService.readerbool = false;
    this.listService.id  = id;
    this.route.navigate(['/todo-item']);


}


}
