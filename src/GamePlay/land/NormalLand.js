/**
 * Normal land UI object
 */
let NormalLand = Land.extend({
    ctor: function (x, y){
        let layer = ccs.load(res.normalLand).node;
        this._super(layer, x, y, GameConfig.landType.normalLand);
    }
})