import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseCommunicationService } from 'src/app/services/database-communication.service';
import { QuestData } from '../quest-list.model';

@Component({
  selector: 'app-quest-add',
  templateUrl: './quest-add.component.html',
  styleUrls: ['./quest-add.component.scss'],
})
export class QuestAddComponent implements OnInit {
  
  @Input()questsList: QuestData[];

  formGroup = new FormGroup({
    name: new FormControl(null),
    description: new FormControl(null), 
    id: new FormControl(null),
  })

  constructor(
    public dialogRef: MatDialogRef<QuestAddComponent>,
    private databaseService: DatabaseCommunicationService
  ) { }

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  addQuest() {
    
  }

}
