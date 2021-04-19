import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { CharacterCardComponent } from './character-card/character-card.component';
import { HttpClientModule } from '@angular/common/http';
import { GoldenCrownsPipe, PennyPipe, SilverPipe } from './assets/pipes';
import { QuestListComponent } from './quest-list/quest-list.component';
import { QuestDeleteConfirmComponent } from './quest-list/quest-delete-confirm/quest-delete-confirm.component';
import { QuestAddComponent } from './quest-list/quest-add/quest-add.component';
import { QuestEditComponent } from './quest-list/quest-edit/quest-edit.component';
import { CharacterMoneyHistoryComponent } from './character-card/character-money-history/character-money-history.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CharacterCardComponent,
    QuestListComponent,
    QuestDeleteConfirmComponent,
    QuestAddComponent,
    QuestEditComponent,
    CharacterMoneyHistoryComponent,
    GoldenCrownsPipe,
    SilverPipe,
    PennyPipe,
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule, 
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
