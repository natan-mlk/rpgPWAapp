import { Component, OnInit } from '@angular/core';
import { DatabaseCommunicationService } from '../services/database-communication.service';
import { QuestData } from './quest-list.model';
import { MatDialog } from '@angular/material/dialog';
import { QuestDeleteConfirmComponent } from './quest-delete-confirm/quest-delete-confirm.component';
import { QuestAddComponent } from './quest-add/quest-add.component';
import { QuestEditComponent } from './quest-edit/quest-edit.component';

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {

  questsList: QuestData[] = [];
  currentId: number;

  constructor(
    private httpService: DatabaseCommunicationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getQuestsData();
  }

  getQuestsData() {
    this.httpService.getQuestsAndId()
      .subscribe(
        (quests: [QuestData[], number]) => {
          this.questsList = quests[0];
          this.currentId = quests[1];
        }
      )
  }

  openDeleteDialog(quest: QuestData) {
    const dialogRef = this.dialog.open(QuestDeleteConfirmComponent);
    dialogRef.componentInstance.quest = quest;
    dialogRef.componentInstance.questsList = this.questsList;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getQuestsData();
      }
    });
  }

  openAddQuestsDialog() {
    const dialogRef = this.dialog.open(QuestAddComponent);
    dialogRef.componentInstance.questsList = this.questsList;
    dialogRef.componentInstance.currentId = this.currentId;

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log('close result: ', result)
      if (result) {
        this.getQuestsData();
      }
    });
  }

  openEditDialog(quest: QuestData) {
    const dialogRef = this.dialog.open(QuestEditComponent);
    dialogRef.componentInstance.questsList = this.questsList;
    dialogRef.componentInstance.selectedQuest = quest;

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getQuestsData();
      }
    });
  }
}
