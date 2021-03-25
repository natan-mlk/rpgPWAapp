import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { avatars, Avatars } from '../assets/avatars';

interface CharacterData {
  name: string,
  money : number,
  history: {
    value: number,
    type: boolean, 
    note?: string
  }[]
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


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,

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

  setAvatarImage(selectedCharacter){
    console.log('selectedCharacter', selectedCharacter)
    for (let item in Avatars) {
      if(item === selectedCharacter){
        this.avatarImage = Avatars[item]
      }
      console.log('items avatars', Avatars[item])
      }
  }

}
