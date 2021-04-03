import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Avatars } from '../assets/avatars';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormValue } from './character-card.model';
import { CharacterData } from './character-card.model';
import { DatabaseCommunicationService } from '../services/database-communication.service';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit {
  
// wydziel pasek górny do części niezmiennej
// dodaj walidator na ujemny input
// zablokuj możliwość wysłania zerowego inputu
// zablokój możliwość wpisania "e"
// na stronie głównej "prosty panel - questy aktualne"
// wersja na kompa? Żeby panel działania był węższy a nie 100% szerkości monitora?

// TODO: money amount is added to display before we know data was sent to database and updated

  characterData: CharacterData;
  isLoading: boolean = true;
  selectedCharacter: string;
  avatarImage: string;

  formGroup = new FormGroup({
    goldValue: new FormControl(),
    silverValue: new FormControl(), 
    pennyValue: new FormControl(),
    note: new FormControl(),
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private httpService: DatabaseCommunicationService
  ) { }

  ngOnInit() {
    this.selectedCharacter = (this.router.url).substring(1);
    this.setAvatarImage(this.selectedCharacter);

    this.httpService.getCharacterData(this.selectedCharacter).subscribe(
      (data: CharacterData | any) => {
        console.log('new data', data);
        this.characterData = data;
        // this.moneyAmount = data.money;
        this.isLoading = false;
      }
    )
  }

  updateMoneyValue(operationType: boolean){
    const formValue: FormValue = this.formGroup.value;
    let inputMoneyAmount = (formValue.goldValue * 20 * 12) + (formValue.silverValue * 12) + formValue.pennyValue;
    let taxForMages: number = 0;

    if(!operationType && (this.characterData.money < inputMoneyAmount)){
      this.snackBar.open('Chesz wydać więcej niż masz!', undefined, {
        duration: 3000,
      });
    } else {
      if(this.selectedCharacter === 'gustav' && operationType) { // zmienić na jakiś enum string z gustavem
        taxForMages = (inputMoneyAmount * 0.1)
        inputMoneyAmount = inputMoneyAmount - taxForMages;
      }

    this.createMoneyHistory(formValue, inputMoneyAmount, operationType, taxForMages);
    
    let newMoneyAmount = 0;
    if (operationType){
      newMoneyAmount = this.characterData.money + inputMoneyAmount;
    } else {
      newMoneyAmount = this.characterData.money - inputMoneyAmount;
    }

    this.characterData.money = newMoneyAmount;
    this.sendToDataBase(newMoneyAmount);
    }
  }

  private setAvatarImage(selectedCharacter){
    for (let item in Avatars) {
      if(item === selectedCharacter){
        this.avatarImage = Avatars[item]
      }
    }
  }

  private createMoneyHistory(formValue: FormValue, inputMoney: number, operationType: boolean, taxForMages?: number){
    let characterHistoryObj;
    if(this.selectedCharacter === 'gustav' && operationType){
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

    if(this.characterData.history.length < 10){
      this.characterData.history.unshift(characterHistoryObj)
    } else {
      this.characterData.history.pop();
      this.characterData.history.unshift(characterHistoryObj)
    }
  }

  private sendToDataBase(newMoneyAmount:number) {
    this.httpService.patchCharacterData(
      this.selectedCharacter, this.characterData, newMoneyAmount
    ).subscribe(
      res => {
        console.log('received ok response from patch request');
        this.formGroup.reset();
      },
      error => {
        console.error(error);
        this.snackBar.open('Błąd połączenia', undefined, {
          duration: 3000,
        })
      }
    )
  }

}
