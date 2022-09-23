const Trip = {
    addPin(items,lat,lng){
        return [...items,[lat,lng]];
    },
    empty(items){
        return items.length==0;
    }
}
export default Trip;