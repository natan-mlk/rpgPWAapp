import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Avatars } from '../assets/avatars';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormValue } from './character-card.model';
import { CharacterData } from './character-card.model';
import { DatabaseCommunicationService } from '../services/database-communication.service';
import { Subscription } from 'rxjs';
import { isPositiveNumberValidator, isNotIntegerValidator } from '../assets/validators';
import { CharacterMoneyHistoryComponent } from './character-money-history/character-money-history.component';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit, OnDestroy {

  // TODO: money amount is added to display before we know data was sent to database and updated

  @ViewChild('moneyHistory') moneyHistory: CharacterMoneyHistoryComponent;

  characterData: CharacterData;
  isLoading: boolean = true;
  selectedCharacter: string;
  avatarImage: string;
  isFormValid: boolean = false;
  isAtLeastOneFilled: boolean = false;
  private formStatusSubscription: Subscription = Subscription.EMPTY;
  private formValueSubscription: Subscription = Subscription.EMPTY;


  formGroup = new FormGroup({
    goldValue: new FormControl(null, [isPositiveNumberValidator.bind(this), isNotIntegerValidator()]),
    silverValue: new FormControl(null, [isPositiveNumberValidator.bind(this), isNotIntegerValidator()]),
    pennyValue: new FormControl(null, [isPositiveNumberValidator.bind(this), isNotIntegerValidator()]),
    note: new FormControl(),
  })

  constructor(
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
        if (status === 'INVALID') {
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

  updateMoneyValue(operationType: boolean) {
    const formValue: FormValue = this.formGroup.value;
    let inputMoneyAmount = (formValue.goldValue * 20 * 12) + (formValue.silverValue * 12) + formValue.pennyValue;
    let taxForMages: number = 0;

    if (!operationType && (this.characterData.money < inputMoneyAmount)) {
      this.snackBar.open('Chcesz wyda?? wi??cej ni?? masz!', undefined, {
        duration: 3000,
      });
    } else {
      if (this.selectedCharacter === 'gustav' && operationType) {
        taxForMages = this.countTax(inputMoneyAmount);
        inputMoneyAmount = inputMoneyAmount - taxForMages;
      }

      this.moneyHistory.createMoneyHistory(formValue, inputMoneyAmount, operationType, taxForMages)

      let newMoneyAmount = 0;
      if (operationType) {
        newMoneyAmount = this.characterData.money + inputMoneyAmount;
      } else {
        newMoneyAmount = this.characterData.money - inputMoneyAmount;
      }

      this.characterData.money = newMoneyAmount;
      this.sendToDataBase(newMoneyAmount);
    }
  }

  private countTax(inputMoneyAmount): number {
    if (inputMoneyAmount < 10) {
      return 0;
    }
    return Math.round(inputMoneyAmount * 0.1);
  }

  private setAvatarImage(selectedCharacter) {
    for (let item in Avatars) {
      if (item === selectedCharacter) {
        this.avatarImage = Avatars[item]
      }
    }
  }

  private sendToDataBase(newMoneyAmount: number) {
    this.httpService.patchCharacterData(
      this.selectedCharacter, this.characterData, newMoneyAmount
    ).subscribe(
      res => {
        console.log('received ok response from patch request');
        this.formGroup.reset();
      },
      error => {
        console.error(error);
        this.snackBar.open('B????d po????czenia', undefined, {
          duration: 3000,
        })
      }
    )
  }
}
