import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
private isLogged:boolean =false;
  constructor(private route: Router, private auth:AuthService) { }

logIn(form: NgForm){
  this.auth.login(form.value.email, form.value.password);
  this.checkLogged();
  this.route.navigate(['dashboard']);
}

signin(form){
  form.reset();
  this.route.navigate(['signin']);
}
toHome(){
  this.route.navigate(['homepage'])
}
logout(e, form){
  this.auth.logout();
  this.checkLogged();
  this.route.navigate(['homepage']);
  
  e.preventDefault();
}

checkLogged(){
  this.isLogged = this.auth.isLoggedIn();
}

ngOnInit() {
}

}
