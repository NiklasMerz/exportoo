import { Component } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor() {
    const db = new window.sqlite3.Database(':memory:');

    db.serialize(function () {
      db.run('CREATE TABLE lorem (info TEXT)');

      const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
      for (let i = 0; i < 10; i++) {
        stmt.run('Ipsum ' + i);
      }
      stmt.finalize();

      db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
        console.log(row.id + ': ' + row.info);
      });
    });

    db.close();
  }
}
