import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { databaseAddr, databaseAddrCharacters } from '../assets/database-addr';
import { CharacterData } from '../character-card/character-card.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseCommunicationService {

  constructor(
    private http: HttpClient,
  ) { }

    getCharacterData(selectedCharacter: string): Observable<any>{
      return this.http.get(databaseAddrCharacters + selectedCharacter + '.json')
    }

    patchCharacterData(selectedCharacter: string, characterData: CharacterData, newMoneyAmount: number){
      return this.http.patch(
        databaseAddrCharacters + selectedCharacter + '/.json', 
        {
          "money" : newMoneyAmount,
          "history": characterData.history
      }
      )
    }

    getQuestsData(): Observable<any> {
      return this.http.get(databaseAddr + 'app/recentQuests.json');
    }
}
