import { Component } from '@angular/core';

declare var loki;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  test() {
    const db = new loki('loki.json');
    const children = db.addCollection('children');
    children.insert({ name: 'Sleipnir', legs: 8 });
    children.insert({ name: 'Jormungandr', legs: 0 });
    children.insert({ name: 'Hel', legs: 2 });

    const legs = children.addDynamicView('legs');
    legs.applyFind({ legs: { '$gt': 2 } })
    legs.applySimpleSort('legs');
    console.log(legs.data());
  }
}
