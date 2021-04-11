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
  
  @Input()questsList: QuestData[] = [];
  @Input()currentId: number;

  private formStatusSubscription: Subscription = Subscription.EMPTY;
  isFormValid: boolean = false;
  isFormInitiated: boolean = false; 
  formGroup;

  constructor(
    public dialogRef: MatDialogRef<QuestAddComponent>,
    private databaseService: DatabaseCommunicationService
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.required, 
        // Validators.minLength[3] // dorzucenie tego walidatora rozwala mi widok, lecą błędy. Czemu?
      ]),
      description: new FormControl(null), 
      id: new FormControl(null),
    })

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

    this.isFormInitiated = true;
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  addQuest() {
    const newQuest = this.formGroup.value;
    newQuest.id = this.currentId + 1;

    if(this.questsList){
      this.questsList.unshift(newQuest);
      const tempObjRecentQuests = {recentQuests: this.questsList, idCounter: this.currentId + 1}
      const questsListJSON = JSON.stringify(tempObjRecentQuests);

      this.databaseService.patchQuestsData(questsListJSON)
      .subscribe( result => {
        if(result) {
          this.dialogRef.close(true);
        }
      })
    } else {
      const tempObjRecentQuests = {recentQuests: [newQuest], idCounter: this.currentId + 1};
      const questsListJSON = JSON.stringify(tempObjRecentQuests);

      this.databaseService.patchQuestsData(questsListJSON)
      .subscribe( result => {
        if(result) {
          this.dialogRef.close(true);
        }
      })

    }
  }
  
  ngOnDestroy() {
    this.formStatusSubscription.unsubscribe();
  }

}
