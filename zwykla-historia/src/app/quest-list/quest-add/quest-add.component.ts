import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DatabaseCommunicationService } from 'src/app/services/database-communication.service';
import { QuestData } from '../quest-list.model';

@Component({
  selector: 'app-quest-add',
  templateUrl: './quest-add.component.html',
  styleUrls: ['./quest-add.component.scss'],
})
export class QuestAddComponent implements OnInit, OnDestroy {
  
  @Input()questsList: QuestData[];
  private formStatusSubscription: Subscription = Subscription.EMPTY;
  isFormValid: boolean = false;

  formGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null), 
    id: new FormControl(null),
  })

  constructor(
    public dialogRef: MatDialogRef<QuestAddComponent>,
    private databaseService: DatabaseCommunicationService
  ) { }

  ngOnInit() {
    this.formStatusSubscription = this.formGroup.statusChanges.subscribe(
      status => {
        console.log('form status - ', status)
        if(status === 'INVALID') {
          this.isFormValid = false;
        } else {
          this.isFormValid = true;
        }
      }
    )
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  addQuest() {
    const newQuest = this.formGroup.value;
    newQuest.id = 5;
    this.questsList.unshift(newQuest);
    console.log('questsList', this.questsList);

    const tempObjRecentQuests = {recentQuests: this.questsList}
    const questsListJSON = JSON.stringify(tempObjRecentQuests);
    console.log('questsListJSON', questsListJSON);

    this.databaseService.patchQuestsData(questsListJSON).subscribe( result => {
      if(result) {
        this.dialogRef.close(true);
      }
    })
  }
  
  ngOnDestroy() {
    this.formStatusSubscription.unsubscribe();
  }

}
