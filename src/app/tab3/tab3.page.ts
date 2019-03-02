import { Component } from '@angular/core';
import { Card } from '../types/Card';

import * as Loki from 'lokijs';

declare var LokiIndexedAdapter;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  cards: Array<Card> = [];
  cardCollection: Collection<Card>;
  private fileStorage: {[key: string]: File} = {};
  private xmlReader: FileReader;

  constructor() {
    const idbAdapter = new LokiIndexedAdapter();
    let db: Loki = null;
    const databaseInitializeCallback = () => {
      console.log('DB initialized', db);
      this.cardCollection = db.getCollection('cards');
      if (!this.cardCollection) {
        this.cardCollection = db.addCollection('cards');
      }
      this.cards = this.cardCollection.find();
    };

    db = new Loki('exportoo.db', {
      adapter: idbAdapter,
      autoload: true,
      autoloadCallback: databaseInitializeCallback,
      autosave: true,
      autosaveInterval: 4000
    });

    this.xmlReader = new FileReader();
    this.xmlReader.onload = (e: any) => {
      const readXml = e.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(readXml, 'application/xml');
      this.saveCardsToDB(doc);
    };
  }

  handleFileInput(files: FileList) {
    console.log('Files', files);

    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'text/xml') {
        this.xmlReader.readAsText(files[i]);
      } else {
        this.fileStorage[files[i].name] = files[i];
      }
    }
    this.processImages();
  }

  private async processImages() {
    for (const fileName in this.fileStorage) {
      if (this.fileStorage[fileName].type.includes('image')) {
        await this.readImage(fileName);
      }
    }
  }

  private readImage(fileName: string) {
    return new Promise((resolve) => {
      const imageReader = new FileReader;
      imageReader.onload = (e: any) => {
        const result = e.target.result;
        this.replaceImages(fileName, result);
        resolve();
      };
      imageReader.readAsDataURL(this.fileStorage[fileName]);
    });
  }

  private replaceImages(imageName: string, imageSrc: string) {
    const findObj = {
      '$or': [
        {
          'question': {
            '$regex': [imageName, 'ig']
          }
        },
        {
          'answer': {
            '$regex': [imageName, 'ig']
          }
        }
      ]
    };

    const res =  this.cardCollection.chain().find(findObj).update((card) => {
      card.question = card.question.replace(imageName, imageSrc);
      card.answer = card.answer.replace(imageName, imageSrc);
    });
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
    const findObj = {
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
    };
    this.cards = this.cardCollection.find(findObj);
  }
}
