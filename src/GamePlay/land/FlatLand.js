/**
 * Flat land UI object
 */
let FlatLand = Land.extend({
    ctor: function (x, y){
        let layer = ccs.load(res.flatLand).node;
        this._super(layer, x, y, GameConfig.landType.flatLand);
    }
})