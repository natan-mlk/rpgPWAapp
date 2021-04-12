import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DatabaseCommunicationService } from 'src/app/services/database-communication.service';
import { QuestData } from '../quest-list.model';

@Component({
  selector: 'app-quest-edit',
  templateUrl: './quest-edit.component.html',
  styleUrls: ['./quest-edit.component.scss'],
})
export class QuestEditComponent implements OnInit, OnDestroy {

  @Input()questsList: QuestData[] = [];
  @Input()selectedQuest: QuestData;
  formGroup: FormGroup;
  isFormValid: boolean = false;

  
  private formStatusSubscription: Subscription = Subscription.EMPTY;
  
  constructor(
    public dialogRef: MatDialogRef<QuestEditComponent>,
    private databaseService: DatabaseCommunicationService
  ) { }
  
  ngOnInit() {
    console.log('this.quest ;ist from init', this.questsList)
    this.formGroup = new FormGroup({
      name: new FormControl(this.selectedQuest.name, [Validators.required, 
        // Validators.minLength[3] // dorzucenie tego walidatora rozwala mi widok, lecą błędy. Czemu?
      ]),
      description: new FormControl(this.selectedQuest.description), 
      id: new FormControl(this.selectedQuest.id),
    })

    this.formStatusSubscription = this.formGroup.statusChanges.subscribe(
      (status:string) => {
        console.log('form status - ', status)
        if(status === 'INVALID') {
          this.isFormValid = false;
        } else {
          this.isFormValid = true;
        }
      }
    )
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  saveQuest(): void{

    this.questsList.forEach(
      (quest: QuestData) => {
        if(quest.id === this.selectedQuest.id){
          quest.name = this.formGroup.get('name').value;
          quest.description = this.formGroup.get('description').value;
        }
      }
    )
    const questsListJSON = {recentQuests: this.questsList}
    this.databaseService.patchQuestsData(questsListJSON)
      .subscribe( result => {
        if(result) {
          this.dialogRef.close(true);
        }
      })
  }


  ngOnDestroy() {
    this.formStatusSubscription.unsubscribe();
  }
}
