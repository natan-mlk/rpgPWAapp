import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestData } from '../quest-list.model';

@Component({
  selector: 'app-quest-delete-confirm',
  templateUrl: './quest-delete-confirm.component.html',
  styleUrls: ['./quest-delete-confirm.component.scss'],
})
export class QuestDeleteConfirmComponent implements OnInit {

  @Input()quest: QuestData;
  constructor(
    public dialogRef: MatDialogRef<QuestDeleteConfirmComponent>
  ) { }

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }

}
