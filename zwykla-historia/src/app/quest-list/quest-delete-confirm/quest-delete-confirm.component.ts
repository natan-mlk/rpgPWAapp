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
    const tempObjRecentQuests = {recentQuests: this.questsList}
    const questsListJSON = JSON.stringify(tempObjRecentQuests);
    console.log('Recent Quests from delete', tempObjRecentQuests)

    this.databaseService.patchQuestsData(questsListJSON).subscribe( result => {
      if(result) {
        this.dialogRef.close(true);
      }
    })
  }

}
