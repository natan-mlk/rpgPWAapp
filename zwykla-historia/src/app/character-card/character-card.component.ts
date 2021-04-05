import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Avatars } from '../assets/avatars';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormValue } from './character-card.model';
import { CharacterData } from './character-card.model';
import { DatabaseCommunicationService } from '../services/database-communication.service';
import { Subscription } from 'rxjs';
import { isPositiveNumberValidator, isNotIntegerValidator } from '../assets/validators';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit, OnDestroy {
  
// wersja na kompa? Żeby panel działania był węższy a nie 100% szerkości monitora?

// TODO: money amount is added to display before we know data was sent to database and updated

  characterData: CharacterData;
  isLoading: boolean = true;
  selectedCharacter: string;
  avatarImage: string;
  private formStatusSubscription: Subscription = Subscription.EMPTY;
  private formValueSubscription: Subscription = Subscription.EMPTY;
  
  isFormValid: boolean = false;
  isAtLeastOneFilled: boolean = false;

  formGroup = new FormGroup({
    goldValue: new FormControl(null, [isPositiveNumberValidator.bind(this), isNotIntegerValidator.bind(this)]),
    silverValue: new FormControl(null, [isPositiveNumberValidator.bind(this), isNotIntegerValidator.bind(this)]), 
    pennyValue: new FormControl(null, [isPositiveNumberValidator.bind(this), isNotIntegerValidator.bind(this)]),
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
        this.characterData = data;
        this.isLoading = false;
      }
    )
    this.setFormWatcher();
  }

  ngOnDestroy() {
    this.formStatusSubscription.unsubscribe();
    this.formValueSubscription.unsubscribe();
  }

  private setFormWatcher() {
    this.formStatusSubscription = this.formGroup.statusChanges.subscribe(
      status => {
        if(status === 'INVALID') {
          this.isFormValid = false;
        } else {
          this.isFormValid = true;
        }
      }
    )
    this.formValueSubscription = this.formGroup.valueChanges.subscribe(
      value => {
        const goldValue = this.formGroup.get('goldValue').value;
        const silverValue = this.formGroup.get('silverValue').value;
        const pennyValue = this.formGroup.get('pennyValue').value;
        if (goldValue || silverValue || pennyValue) {
          this.isAtLeastOneFilled = true;
        } else {
          this.isAtLeastOneFilled = false;
        }
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
      if(this.selectedCharacter === 'gustav' && operationType) {
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
