import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {TodoslistService} from '../services/todoslist.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-share-todo',
  templateUrl: './share-todo.page.html',
  styleUrls: ['./share-todo.page.scss'],
})
export class ShareTodoPage implements OnInit {

  constructor(private listService: TodoslistService,
              private router: Router,    
              private formBuilder: FormBuilder
              ) { }
  writer: string;
  reader: string;
  readerwriter:string;
  carbrand = "Lecteur";
  validationsform: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
  };
  ngOnInit() {
    this.validationsform = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  retourPagetodo() {
    window.history.back();
  }


  addUser() {
      if (this.carbrand.length > 0 && this.carbrand === "Lecteur") {
        this.listService.addUserReader(this.listService.id, this.readerwriter).then(()=>{
          this.router.navigate(['/todoslist']);
        });
      }
      if (this.carbrand.length > 0  && this.carbrand === "Editeur") {
        this.listService.addUserwriter(this.listService.id, this.readerwriter).then(()=>{
          this.router.navigate(['/todoslist']);
        });;
        
      }

  }

  onChange(selectedValue){
    console.log('Selected:',selectedValue);
  }
}
