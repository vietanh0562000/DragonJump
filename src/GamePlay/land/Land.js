/**
 * Land UI object
 */
let Land = cc.Node.extend({
    ctor: function (sprite, x, y, type){
        this._super();
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = LAND_ASSETS[type].width;
        this.height = LAND_ASSETS[type].height;
        this.addChild(this.sprite);
    },

    setX: function (newX){
        this.x = newX;
    },

    setY: function (newY){
        this.y = newY;
    },

    update: function (dt){

    }
})