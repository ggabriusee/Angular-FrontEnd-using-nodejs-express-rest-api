
import {Component, OnInit} from '@angular/core';
import { UsersService, User } from './users.service';

@Component({
    selector: 'usersWebApp',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    private tittle = "UserWebService rest api";
    private viewUsers: boolean;
    private userArray: User[];
    private currentUser: User;

    constructor(private service: UsersService) {
        this.viewUsers = false;
        this.currentUser = null;
        this.userArray = new Array();
    }

    // constructor for initializing class fields
    // this method to do "work" after constructor
    ngOnInit() {
        this.service.getAllUsers().subscribe( response => {
            this.userArray = response;
        })
         
     }

    getIndexOfUser(id: string): number {
        return this.userArray.findIndex((user) => {
            return user._id === id;
          });
    }

    selectUser(usr: User){
        this.currentUser = usr;
    }
     
    showView() {
        this.viewUsers = !this.viewUsers;
    }

    showCreate () {
        if (this.currentUser === null || this.userArray.some(val => val === this.currentUser)) {
            this.selectUser({"name": "", "email": ""});
        }else {
            this.selectUser(null);
        }
    }

    createUser(currUser: User) {
        this.service.insertUser(currUser).subscribe(response => {
            this.userArray.push(response);
            this.selectUser(response);
        })
    }

    updateUser(currUser: User) {
        this.service.updateUser(currUser).subscribe(response => {
            var idx = this.getIndexOfUser(response._id);
            this.userArray[idx] = response;
            this.selectUser(response);
        });
    }

    deleteUser(userId: string) {
        this.service.deleteUser(userId).subscribe(response => {
            var idx = this.getIndexOfUser(response.toString());
            this.userArray.splice(idx, 1);
            this.selectUser(null);
        });
    }
}