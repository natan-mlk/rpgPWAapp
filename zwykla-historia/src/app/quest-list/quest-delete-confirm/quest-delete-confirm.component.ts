import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseCommunicationService } from 'src/app/services/database-communication.service';
import { QuestData } from '../quest-list.model';

@Component({
  selector: 'app-quest-delete-confirm',
  templateUrl: './quest-delete-confirm.component.html',
  styleUrls: ['./quest-delete-confirm.component.scss'],
})
export class QuestDeleteConfirmComponent implements OnInit {

  @Input()quest: QuestData;
  @Input()questsList: QuestData[];
  
  constructor(
    public dialogRef: MatDialogRef<QuestDeleteConfirmComponent>,
    private databaseService: DatabaseCommunicationService
  ) { }

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.questsList = this.questsList.filter((questFromList: QuestData) => {
      return questFromList.id !== this.quest.id
    })
    const test = {recentQuests: this.questsList}
    console.log('questsList', this.questsList);
    const questsListJSON = JSON.stringify(test);
    console.log('questsListJSON', questsListJSON);

    this.databaseService.patchQuestsData(questsListJSON).subscribe( result => {
      if(result) {
        this.dialogRef.close(true);
      }
    })
  }

}
    // {
    //   "recentQuests" : [ {
    //     "description" : "Dawać hajs na remont",
    //     "id" : 1,
    //     "name" : "1111111111"
    //   }, {
    //     "description" : "Można spóbować podłożyć świnię, żeby została zegradowana",
    //     "id" : 2,
    //     "name" : "222222222"
    //   }, {
    //     "description" : "Dawać hajs na remont",
    //     "id" : 3,
    //     "name" : "333"
    //   }, {
    //     "description" : "Dawać hajs na remont",
    //     "id" : 4,
    //     "name" : "4444"
    //   } ]
    // }