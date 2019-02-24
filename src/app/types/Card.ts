export class Card {
    question: string;
    answer: string;
    lesson: string;
    private elem?: Element;

    constructor(elem: Element, public lessonName) {
        this.elem = elem;

        // TODO replace for CDATA sanitize
        this.question = elem.querySelector('Question').innerHTML.replace(']]>', '');
        this.answer = elem.querySelector('Answer').innerHTML.replace(']]>', '');
    }
}
