import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
import { Folder } from '../../classes/Folder'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private nome = this.getNome();
  private side: boolean = true;
  private folder = [];
  private selected;


  constructor(private http: HttpClientModule, private data: DataService) { }

  getNome() {
    return localStorage.getItem('nome')
  }
  openNav() {

    document.getElementById('miaNav').style.width = "250px";
    document.getElementById('miaDash').style.marginLeft = "320px";
    document.getElementById('miaDash').style.width = "76.55%";
    this.side = false;

  }

  closeNav() {
    document.getElementById("miaDash").style.marginLeft = "0px";
    document.getElementById('miaDash').style.width = "100%";
    this.side = true;

  }
  clickNav() {
    if (this.side) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  newFolderReq(form: NgForm) {
    this.data.newFolder(form.value.foldername).subscribe(
      (payload) => {
        if (payload['success']) {
          this.folder = payload['data'];
        } else {
          console.log(payload['error'])
        }
      }
    );
  }

  select(cartella: Folder) {
    cartella.selected = true;
    this.selected = cartella;
    console.log(this.selected['children'])
  }

  checkTokenValidity() {
    this.data.checkToken();
  }


  ngOnInit() {
    this.checkTokenValidity();
    this.data.getFolder().subscribe(
      (payload) => {
        if (payload['success']) {
          this.folder = payload['data'];
        } else {
          console.log(payload['error'])
        }
      }
    )
  }

}
