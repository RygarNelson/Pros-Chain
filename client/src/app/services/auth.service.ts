import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerLocation } from '../classes/ServerLocation';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
@Output() outLogin = new EventEmitter()
@Output() outSignin = new EventEmitter()
@Output() outLogout = new EventEmitter()

private APIAUTHURL = ServerLocation.URL+'api/auth';
constructor(private http: HttpClient, private route: Router) { }

  isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  signIn(firstname:string, lastname:string,userDate:string, email:string, password:string){
    let date=userDate["day"]+'/'+userDate["month"]+'/'+userDate["year"];
    this.http.post(this.APIAUTHURL+'/register', {firstname, lastname, date, email, password,}).subscribe(
      (payload:any) => {
        if(payload.success){
        localStorage.setItem('token', payload.token);
        this.outSignin.emit();
      }
        else{
          alert(payload.error);
        }
      },
      (error:any) => {
        alert(error)
      }
    )
  }

   logout(){
    localStorage.removeItem('token');
    this.outLogout.emit();
  }

  login(email:string, password:String){
    this.http.post(this.APIAUTHURL+'/login', {email: email, password: password}).subscribe(
      (payload: any) => {
        if(payload.success){
          localStorage.setItem('token', payload.token);
          this.outLogin.emit();
          this.route.navigate(['dashboard']);
        } else {
          alert(payload.error)
        }
      },
      (error) => {
        alert(error.statusText)
      }
    )
    
    
  }
}
