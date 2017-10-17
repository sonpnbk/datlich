import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class Database{

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    if (this.platform.is('cordova')) {    
      this.platform.ready().then(()=>{
        this.sqlite.create({
          name: 'datlich.db',
          location: 'default'
        })
        .then((db:SQLiteObject)=>{
          this.database = db;
          
          this.createTables();
        })
  
      });
    }
  }

   private createTables(){
     this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS 'listDay' (
        'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
        'thoigian' TEXT
      )`
    ,{})
    .then(()=>{
      console.log("table created");
      this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS 'todo' (
        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
        'noidung' TEXT,
        'chuthich' TEXT,
        'thongtinthem' TEXT,
        'listId' TEXT,
        FOREIGN KEY(listId) REFERENCES listDay(id)
        )`,{} )
    }).catch((err)=>console.log("error detected creating tables"));
  }
  private isReady(){
    return new Promise((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      }  
    })
  }


  getLists(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('SELECT * from listDay', [])
      .then((data)=>{
        let lists = [];
        for(let i=0; i<data.rows.length; i++){
          lists.push(data.rows.item(i));
        }
        return lists;
      })
    })
  }

  addList(thoigian:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO listDay(thoigian) VALUES (\''+${thoigian}+'\');`, {}).then((result)=>{
        if(result.insertId){
          return this.getList(result.insertId);
        }
      })
    });    
  }

  getList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM listDay WHERE id = ${id}`, [])
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    })    
  }

  deleteList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM listDay WHERE id = ${id}`, [])
    })
  }


  getTodosFromList(listId:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * from todo WHERE listId = ${listId}`, [])
            .then((data)=>{
              let todos = [];
              for(let i=0; i<data.rows.length; i++){
                let todo = data.rows.item(i);
                //cast binary numbers back to booleans
                todo.isImportant = !!todo.isImportant;
                todo.isDone = !!todo.isDone;
                todos.push(todo);
              }
              return todos;
            })
    })
  }

  addTodo(noidung:string, chuthich:string, thongtinthem:string, listId:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO todo 
        (noidung, chuthich, thongtinthem, listId) VALUES (?, ?, ?, ?);`, 
        //cast booleans to binary numbers        
        [noidung, chuthich, thongtinthem, listId]);
    });      
  }

  modifyTodo(noidung:string, chuthich:string, thongtinthem:string, id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE todo 
        SET noidung = ?, 
        chuthich = ?,
        thongtinthem = ? 
        WHERE id = ?`, 
        //cast booleans to binary numbers
        [noidung, chuthich, thongtinthem, id]);
    });       
  }

  removeTodo(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM todo WHERE id = ${id}`, [])
    })    
  }


  
}