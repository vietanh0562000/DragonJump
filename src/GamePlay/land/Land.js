/**
 * Land object
 */
let Land = cc.Class.extend({
    ctor: function (sprite, x, y, type){
        this.sprite = sprite;
        this.sprite.x = x - gv.originX;
        this.sprite.y = -50;
        this.x = x;
        this.y = y;
        this.width = LAND_ASSETS[type].width;
        this.height = LAND_ASSETS[type].height;
        this.sprite.runAction(new cc.moveBy(1.5, 0, y + 50));
    },

    setX: function (newX){
        this.x = newX;
    },

    setY: function (newY){
        this.y = newY;
    },

    update: function (dt){

    },

    /**
     * Land move by x, y
     * @param distanceX
     * @param distanceY
     */
    moveBy: function (distanceX, distanceY){
        let action = cc.moveBy(1, distanceX, distanceY);
        this.sprite.runAction(action);
    }
})