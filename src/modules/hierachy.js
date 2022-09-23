import {STATES} from ".";

class Hierachy{
    constructor(){
        this.items = [STATES.ARRIVED,STATES.TRAVELING,STATES.DESTINATION];
        this.idx = 0;
    }
    next(){
        this.idx+=1;
        return this.items[this.idx%3];
    }
}
export default new Hierachy();