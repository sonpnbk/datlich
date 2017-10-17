import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IonicStorageModule } from '@ionic/storage';
import { BaothucPage} from '../pages/baothuc/baothuc';
import { TabsPage} from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ListsService} from '../providers/lists-service';
import { SQLite } from '@ionic-native/sqlite';
import { Database} from '../providers/database';
import {enableProdMode} from '@angular/core';
enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BaothucPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BaothucPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    ListsService,
    Database,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
