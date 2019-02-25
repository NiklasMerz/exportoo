import { Component } from '@angular/core';
import { Card } from '../types/Card';

import * as Loki from 'lokijs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  fileToUpload: File = null;
  cards: Array<Card> = [];
  cardCollection: Collection<Card>;

  constructor() {
    const db = new Loki('db.json');
    this.cardCollection = db.addCollection('cards');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    console.log(this.fileToUpload);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const readXml = e.target.result;
      console.log(readXml);
      const parser = new DOMParser();
      const doc = parser.parseFromString(readXml, 'application/xml');
      this.saveCardsToDB(doc);
    };
    reader.readAsText(this.fileToUpload);
  }

  private saveCardsToDB(doc: Document) {
    const lessons = doc.querySelectorAll('Lesson');

    lessons.forEach((lesson) => {
      const lessonName = lesson.getAttribute('title');

      const cards = lesson.querySelectorAll('Textfilecard');
      cards.forEach((cardElem) => {
        const card = new Card(cardElem, lessonName);
        this.cards.push(card);
        this.cardCollection.insert(card);
      });
    });
  }

  search(event: any) {
    const search = event.detail.value;
    this.cards = this.cardCollection.find({
        '$or': [
        {
          'question': {
            '$regex': [search, 'ig']
          }
        },
        {
          'answer': {
            '$regex': [search, 'ig']
          }
        }
      ]
    });
  }
}
