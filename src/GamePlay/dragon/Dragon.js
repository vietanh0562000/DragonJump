let Dragon = cc.Class.extend({
    ctor: function (x, y){
        this.state = DRAGON_STATE.IDLE;
        this.container = ccs.load(res.dragon).node;
        this.sprite = this.container.getChildByName("Dragon");
        this.sprite.x = x;
        this.sprite.y = -50;
        this.x = x;
        this.y = y;
        this.landStanding = 0;
        buildUI(this.sprite);
        this.curAnimation = 1;
        this.jumpDistance = 0;
        this.timeToUpdateUI = GameConfig.dragonUpdate;
        this.animations = [];
        this.createAnimations();
        this.runAnimation(this.state, true);
        this.sprite.runAction(new cc.moveBy(1.5, 0, y + 50));
    },

    /**
     * create sprite from path
     * @param path
     */
    createSprite: function (path){
        let newSprite = new cc.Sprite(path);
        newSprite.setScale(this.sprite.getScale());
        return newSprite;
    },

    /**
     * Create all animation of dragon
     */
    createAnimations: function (){
        for (let state in DRAGON_STATE){
            let stateIndex = DRAGON_STATE[state];
            let startAnim = DRAGON_ASSETS[stateIndex].START_ANIMATION;
            let endAnim = DRAGON_ASSETS[stateIndex].LAST_ANIMATION;
            let header = DRAGON_ASSETS[stateIndex].HEADER;

            // Create all frame of animation
            let frame = [];
            for (let i = startAnim; i <= endAnim; i++){
                let newSprite = this.createSprite(header + "(" + i + ").png");
                frame.push(newSprite.getSpriteFrame());
            }

            // Create animation
            let animation = new cc.Animation(frame, GameConfig.dragonUpdate);
            animation.retain();
            this.animations.push(animation);
        }
    },

    /**
     * Update UI dragon
     * @param dt
     */
    updateUI: function (dt){

    },

    /**
     * Run animation with id
     * @param animationId
     */
    runAnimation: function (animationId, isRepeat){
        cc.log("Run animation id: " + animationId);
        this.sprite.stopAllActions();
        let animate = cc.animate(this.animations[animationId]);
        if (isRepeat) this.sprite.runAction(animate.repeatForever());
        else{
            this.sprite.runAction(animate);
        }
    },

    /**
     * Update Logic Dragon
     */
    updateLogic: function (lands){
        switch (this.state){
            case DRAGON_STATE.IDLE:
                let landStanding = this.findLandStanding(lands);
                // Find next land and status of dragon
                if (landStanding === -1){
                    this.die();
                }
                if (landStanding !== this.landStanding){
                    this.landStanding = landStanding;
                }
                break;
            case DRAGON_STATE.JUMP:
                this.x += this.jumpDistance * GameConfig.tickTime;
                cc.log("Dragon x: " + this.x);
                break;
            default:
                break;
        }
    },

    /**
     * Back to idle state
     */
    turnToIdle: function (){
        cc.log("Back to idle");
        this.state = DRAGON_STATE.IDLE;
        this.runAnimation(this.state, true);
    },

    /**
     * Hold to jump
     */
    hold: function (){
        this.state = DRAGON_STATE.IDLE_JUMP;
        this.runAnimation(this.state, false);
    },

    /**
     * Function calculate to Jump dragon
     */
    jump: function (distance){
        this.state = DRAGON_STATE.JUMP;
        this.jumpDistance = distance;
        this.runAnimation(this.state, false);

        let newX = this.sprite.x + distance;
        let backIdleState = new cc.CallFunc(this.turnToIdle.bind(this));
        let jumpAction = cc.Sequence(
            cc.jumpTo(1, cc.p(newX, this.sprite.y), distance, 1),
            backIdleState
        )
        this.sprite.runAction(jumpAction);
    },

    /**
     * move sprite
     * @param distanceX
     * @param distanceY
     */
    moveBy: function (distanceX, distanceY){
        let action = cc.moveBy(1, distanceX, distanceY);
        this.sprite.runAction(action);
    },

    /**
     * find the land dragon is standing
     * @param lands
     */
    findLandStanding: function (lands){
        for (let i = 0; i < lands.length; i++){
            let start = lands[i].x - (lands[i].width / 2);
            let end = lands[i].x + (lands[i].width / 2);
            if (this.x >= start && this.x <= end) return i;
        }
        return -1;
    },

    /**
     * Kill the dragon
     */
    die: function (){
        this.state = DRAGON_STATE.DEAD;
        this.runAnimation(this.state, false);
    }
})