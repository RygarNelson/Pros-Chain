import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { Folder } from '../../classes/Folder';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild('mylabel') mylabel: ElementRef
  @Input() folder = [];
  @Output() selezionata2 = new EventEmitter();
  private side: boolean = true;
  private selected:Folder = new Folder();
  private nameSelected;
  private selctedbool = false;
  private msgerror = false;
  private modifica = false;

  constructor(private http: HttpClientModule, private data: DataService) { }

  ngOnInit() {
    let el: HTMLElement = this.mylabel.nativeElement as HTMLElement;
    el.click();
    this.data.getFolder().subscribe(
      (payload) => {
        if (payload['success']) {
          this.generateNewTree(payload['data'])
        } else {
          console.log(payload['error'])
        }
      }
    )
  }

  private generateNewPath(oldPath: String, newName) {
    if(oldPath.indexOf("\\") != -1){
      let array = oldPath.split("\\");
      array[array.length - 1] = newName;
      return array.join("\\");
    } else {
      let array = oldPath.split("/");
      array[array.length - 1] = newName;
      return array.join("/");
    }
  }

  private generateNewTree(data) {
    let root = [{
      name: localStorage.getItem('nome'),
      path: "/",
      type: "dir",
      children: data
    }];
    this.folder = root;
  }

  openNav() {
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

  selezionata(f: Folder) {
    this.selezionata2.emit(f);
    this.selected = f;
    this.nameSelected=f.name
    this.selctedbool = true;
    this.msgerror = false;
  }

  modifyFolderReq(newFolderName) {
    if (this.selected) {
      this.msgerror = false;
      this.data.modifyFolder(this.selected.path, this.generateNewPath(this.selected.path, newFolderName)).subscribe(
        (payload) => {
          if (payload['success']) {
            this.generateNewTree(payload['data']);
          } else {
            console.log(payload['error'])
          }
        }
      )
    } else {
      this.msgerror = true;
    }
  }

  deleteFolderReq() {
    if (this.selected) {
      this.msgerror = false;
      this.data.deleteFolder(this.selected.path).subscribe(
        (payload) => {
          if (payload['success']) {
            this.generateNewTree(payload['data']);
            this.selected = new Folder("root", "dir", "/", this.folder['children']);
            this.nameSelected = "";
          } else {
            console.log(payload['error'])
          }
        }
      )
    } else {
      this.msgerror = true;
    }
  }

  newFolderReq(foldername) {
    if (this.selected.path != "/") {
      this.data.newFolder(this.selected.path + "\\" + "\\" + foldername).subscribe(
        (payload) => {
          if (payload['success']) {
            this.generateNewTree(payload['data']);
          } else {
            console.log(payload['error'])
          }
        });
    } else {
      this.data.newFolder(foldername).subscribe(
        (payload) => {
          if (payload['success']) {
            this.generateNewTree(payload['data']);
          } else {
            console.log(payload['error'])
          }
        }
      );
    }
  }

}

