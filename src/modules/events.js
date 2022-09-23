class TripEvent{
    constructor(){
        this._dispatcher = {};
    }
    addListener(descriptor,cb){
        this._dispatcher[descriptor] = cb;
    }
    dispatch(descriptor,args=[]){
        const cb = this._dispatcher[descriptor];
        args.length?cb(...args):cb();
    }
}
const tripevent = new TripEvent();
export {tripevent};