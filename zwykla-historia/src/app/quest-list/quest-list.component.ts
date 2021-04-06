import { Component, OnInit } from '@angular/core';
import { DatabaseCommunicationService } from '../services/database-communication.service';
import { QuestData } from './quest-list.model';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuestDeleteConfirmComponent } from './quest-delete-confirm/quest-delete-confirm.component';
import { QuestAddComponent } from './quest-add/quest-add.component';

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {

  questsList: QuestData[] = [];

  constructor(
    private httpService: DatabaseCommunicationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getQuestsData();
  }

  getQuestsData(){
    this.httpService.getQuestsData().subscribe(
      (quests: QuestData[]) => {
        this.questsList = quests;
      }
    )
  }

  openDeleteDialog(quest: QuestData) {
    const dialogRef = this.dialog.open(QuestDeleteConfirmComponent);
    dialogRef.componentInstance.quest = quest;
    dialogRef.componentInstance.questsList = this.questsList;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getQuestsData();
      }
    });
  }

  openAddQuestsDialog() {
    const dialogRef = this.dialog.open(QuestAddComponent);
    dialogRef.componentInstance.questsList = this.questsList;
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('close result: ', result)
      if(result) {
        this.getQuestsData();
      }
    });
  }

}
