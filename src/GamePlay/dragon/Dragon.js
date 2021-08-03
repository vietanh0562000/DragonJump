let Dragon = cc.Class.extend({
    ctor: function (x, y){
        this.state = DRAGON_STATE.IDLE;
        this.container = ccs.load(res.dragon).node;
        this.sprite = this.container.getChildByName("Dragon");
        this.sprite.x = x;
        this.sprite.y = y;
        buildUI(this.sprite);
        this.curAnimation = 1;
        this.jumpTime = 0;
        this.dropTime = 0;
        this.jumpSpeed = 0;
        this.timeToUpdateUI = GameConfig.dragonUpdate;
        this.animations = [];
        this.createAnimations();
        this.runAnimation(this.state, true);
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
    updateLogic: function (){
        switch (this.state){
            case DRAGON_STATE.IDLE:
                break;
            case DRAGON_STATE.JUMP:
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
    jump: function (timeHold){
        this.state = DRAGON_STATE.JUMP;
        this.runAnimation(this.state, false);
        let distanceOneJump = timeHold * 300;
        let newX = this.sprite.x + distanceOneJump;
        let backIdleState = new cc.CallFunc(this.turnToIdle.bind(this));
        let jumpAction = cc.Sequence(
            cc.jumpTo(1, cc.p(newX, this.sprite.y), distanceOneJump, 1),
            backIdleState
        )
        this.sprite.runAction(jumpAction);
    }
})