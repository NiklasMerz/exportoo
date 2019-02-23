export class Card {
    question: string;
    answer: string;
    lesson: string;
    private elem?: Element;

    constructor(elem: Element, public lessonName) {
        //TODO 
        this.elem = elem;
    }
}
