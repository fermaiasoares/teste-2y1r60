import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database/database.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private databaseService: DatabaseService,
  ) {
  }

  ngOnInit() {
    this.databaseService.getDbStatus().subscribe(ready => {
      console.log(`Database is ready: ${ready}`);
    });

    setInterval(() => {
      this.databaseService.insert('teste', {
        name: 'Fernando',
        age: '36',
      });
    }, 10000);
  }
}
