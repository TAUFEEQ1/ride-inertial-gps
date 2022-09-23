import { tripevent } from "./events";
class Logger{
    constructor(){
        this.handler = null;
        this.estimator = null;
    }
    start(cb,positions){
        this.handler = setInterval(()=>{
			const tmp = positions.shift();
			if(tmp==undefined){
                tripevent.dispatch("tripend");
			}else{
				const [lat,lng,_] = tmp;
                cb(lat,lng);
			}
		},5000);
    }
    stop(){
        clearInterval(this.handler);
    }
    
}
export default new Logger();