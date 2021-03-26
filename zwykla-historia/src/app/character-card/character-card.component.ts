import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Avatars } from '../assets/avatars';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CharacterData {
  name: string,
  money : number,
  history: {
    value: number,
    type: boolean, 
    note?: string
  }[]
}

interface FormValue {
  goldValue: number,
  note: string,
  pennyValue: number,
  silverValue: number
}

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit {
  
  characterData: CharacterData;
  isLoading: boolean = true;
  public selectedCharacter: string;
  private databaseAddr: string = 'https://amilko-home-default-rtdb.europe-west1.firebasedatabase.app/';
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
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.selectedCharacter = this.router.url;
    this.selectedCharacter = this.selectedCharacter.substring(1);
    this.setAvatarImage(this.selectedCharacter);

    this.http.get('https://amilko-home-default-rtdb.europe-west1.firebasedatabase.app/featuredApp/characters/' 
    + this.selectedCharacter + '.json')
    .subscribe(
      (data: CharacterData | any) => {
        console.log('new data', data);
        this.characterData = data;
        // this.moneyAmount = data.money;
        this.isLoading = false;
      }
    )
  }

  private setAvatarImage(selectedCharacter){
    console.log('selectedCharacter', selectedCharacter)
    for (let item in Avatars) {
      if(item === selectedCharacter){
        this.avatarImage = Avatars[item]
      }
      console.log('items avatars', Avatars[item])
      }
  }

  // ------------------

  update(operationType: boolean){
    const formValue: FormValue = this.formGroup.value;
    const inputMoney = (formValue.goldValue * 20 * 12) + (formValue.silverValue * 12) + formValue.pennyValue;
    
    if(!operationType && (this.characterData.money < inputMoney)){
      console.error('ERROR');
      this.snackBar.open('Chesz wydać więcej niż masz!', undefined, {
        duration: 3000,
      });
    } else {

    this.createMoneyHistory(formValue, inputMoney, operationType);
    let newMoneyAmount = 0;

    if (operationType){
    newMoneyAmount = this.characterData.money + inputMoney;
    } else {
      newMoneyAmount = this.characterData.money - inputMoney;
    }

    this.characterData.money = newMoneyAmount;
    this.sendToDataBase(newMoneyAmount);
    }
  }

  private createMoneyHistory(formValue: FormValue, inputMoney: number, operationType: boolean){
    const characterHistoryObj = {
      'note': formValue.note, 
      'value': operationType ? inputMoney : inputMoney, 
      'type': operationType
    };
    console.log('characterHistoryObj money', characterHistoryObj.value)
    if(this.characterData.history.length < 10){
      this.characterData.history.unshift(characterHistoryObj)
    } else {
      this.characterData.history.pop();
      this.characterData.history.unshift(characterHistoryObj)
    }
  }

  private sendToDataBase(newMoneyAmount:number) {
    this.http.patch(
      this.databaseAddr + 'featuredApp/characters/' + this.selectedCharacter + '/.json', 
      {
        "money" : newMoneyAmount,
        "history": this.characterData.history
    }
    ).subscribe(
      res => {
        console.log('received ok response from patch request');
        this.formGroup.reset();
      }
    )
  }

}
