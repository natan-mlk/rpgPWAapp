import { Component, OnInit } from '@angular/core';
import { DatabaseCommunicationService } from '../services/database-communication.service';
import { QuestData } from './quest-list.model';

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {

  questsList: QuestData[] = [];

  constructor(
    private httpService: DatabaseCommunicationService,
  ) { }

  ngOnInit() {
    this.getQuestsData();
  }

  getQuestsData(){
    this.httpService.getQuestsData().subscribe(
      (quests: QuestData[]) => {
        console.log('quests', quests)
        this.questsList = quests;
      }
    )
  }

  deleteQuest(quest: QuestData): void{
    this.questsList = this.questsList.filter((questFromList: QuestData) => {
      console.log('questFromList', questFromList)
      console.log('quest', quest)
      return questFromList.id !== quest.id
    })
    this.updateDatabase();
    console.log('this.questsList ', this.questsList);
  }

  private updateDatabase() {
    
  }

  saveQuests() {

  }

}
