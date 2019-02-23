import { Component } from '@angular/core';
import { Card } from '../types/Card';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  fileToUpload: File = null;

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
        console.log(card);
      });
    });
  }
}
