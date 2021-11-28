import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite, SQLiteDatabaseConfig } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

const config: SQLiteDatabaseConfig = {
  name: 'data.db',
  location: 'default'
};

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database: SQLiteObject;

  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create(config)
        .then((db: SQLiteObject) => {
          this.database = db;
          this.isDbReady.next(true);
        })
        .catch(e => console.log(e));
    });
  }

  public getDbStatus() {
    return this.isDbReady.asObservable();
  }

  public async runMigration(sql: string) {
    try {
      await this.database.executeSql(sql, []);
      console.log(`Migration successfully executed`);
    } catch (e) {
      console.error(e);
    }
  }

  public async insert(table: string, data: any) {
    try {
      await this.database.transaction(tx => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const columns = keys.join(',');
        const placeholders = keys.map(() => '?').join(',');
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        tx.executeSql(sql, values);
        console.log(`Data inserted successfully in ${table}`);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public async select(table: string, data: any, selection: any[] = ['*']) {
    try {
      const rows = [];
      const keys = Object.keys(data);
      const values = Object.values(data);
      const columns = keys.map(key => `${key} = ?`).join(' and ');
      const select = Object.values(selection).join(', ');
      const sql = `SELECT ${select} FROM ${table} WHERE ${columns}`;
      const res = await this.database.executeSql(sql, values);
      for (let i = 0; i < res.rows.length; i++) {
        rows.push(res.rows.item(i));
      }
      return rows;
    } catch (e) {
      console.error(e);
    }
  }

  public async update(table: string, data: any) {
    try {
      await this.database.transaction(tx => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const columns = keys.map(key => `${key} = ?`).join(',');
        const sql = `UPDATE ${table} SET ${columns} WHERE id = ${data.id}`;
        tx.executeSql(sql, values);
        console.log(`Data updated successfully in ${table}`);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public async delete(table: string, data: any) {
    try {
      await this.database.transaction(tx => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const columns = keys.map(key => `${key} = ?`).join(' and ');
        const sql = `DELETE FROM ${table} WHERE ${columns}`;
        tx.executeSql(sql, values);
        console.log(`Data deleted successfully in ${table}`);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public async query(sql: string, params: any[] = []) {
    try {
      const res = await this.database.executeSql(sql, params);
      const rows = [];
      for (let i = 0; i < res.rows.length; i++) {
        rows.push(res.rows.item(i));
      }
      return rows;
    } catch (e) {
      console.error(e);
    }
  }
}
