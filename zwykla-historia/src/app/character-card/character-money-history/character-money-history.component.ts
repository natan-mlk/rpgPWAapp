import { Component, Input, OnInit } from '@angular/core';
import { CharacterData, FormValue } from '../character-card.model';

@Component({
  selector: 'app-character-money-history',
  templateUrl: './character-money-history.component.html',
  styleUrls: ['./character-money-history.component.scss'],
})
export class CharacterMoneyHistoryComponent implements OnInit {

  @Input() characterData: CharacterData;
  @Input() selectedCharacter: string;

  constructor() { }

  ngOnInit() { }

  createMoneyHistory(formValue: FormValue, inputMoney: number, operationType: boolean, taxForMages?: number) {
    let characterHistoryObj;
    if (this.selectedCharacter === 'gustav' && operationType) {
      characterHistoryObj = {
        'note': formValue.note,
        'value': operationType ? inputMoney : inputMoney,
        'tax': taxForMages,
        'type': operationType
      };
    } else {
      characterHistoryObj = {
        'note': formValue.note,
        'value': operationType ? inputMoney : inputMoney,
        'type': operationType
      };
    }

    if (this.characterData.history.length < 10) {
      this.characterData.history.unshift(characterHistoryObj)
    } else {
      this.characterData.history.pop();
      this.characterData.history.unshift(characterHistoryObj)
    }
  }

}
