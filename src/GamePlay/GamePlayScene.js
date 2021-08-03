let GamePlayScene = cc.Scene.extend({
    ctor: function (){
        this._super();
        gv.originX = 0;
        this.container = ccs.load(res.gamePlayScene).node;
        this.water = ccs.load(res.water).node;
        this.homeButton = this.container.getChildByName("HomeButton");
        this.pauseButton = this.container.getChildByName("PauseButton");
        this.pointText = this.container.getChildByName("Point");
        this.point = 0;
        this.lands = [];
        this.currentLand = -1;
        this.dragon = new Dragon(DEFAUT_POSITION.X,DEFAUT_POSITION.Y);
        this.timer = 0;
        this.isHold = false;
        this.controller = new GamePlayController();
        this.addLand();
        this.addLand();

        this.homeButton.addClickEventListener(this.controller.returnHome);
        this.pauseButton.addClickEventListener(this.controller.pauseGame);
        this.pointText.setString(this.point.toString());

        buildUI(this.container);
        buildUI(this.water);
        this.addChild(this.container);
        this.addChild(this.water, WATER_ZORDER);
        this.addChild(this.dragon.container, DRAGON_ZORDER);
        this.addTouchEventListener();

        this.schedule(this.updateLogic, GameConfig.tickTime);
        this.scheduleUpdate();
    },

    update: function (dt){
        //this.updateLands();
        if (this.isHold){
            this.timer += dt;
        }
        this.updateDragon(dt);
    },

    /**
     * Update UI lands
     */
    updateLands: function (){
        for (let land of this.lands){
            land.update();
        }
    },

    /**
     * Update UI dragon
     */
    updateDragon: function (dt){
        this.dragon.updateUI(dt);
    },

    /**
     * Update Logic Dragon
     */
    updateLogic: function (){
        this.dragon.updateLogic(this.lands);
        switch (this.dragon.state){
            case DRAGON_STATE.IDLE:
                if (this.currentLand !== this.dragon.landStanding){
                    this.point++;
                    this.pointText.setString(this.point.toString());
                    this.currentLand = this.dragon.landStanding;
                    this.removeCurrentLand();
                    this.addLand();
                }
                break;
            case DRAGON_STATE.DEAD:
                gv.score = this.point;
                if (gv.score > gv.bestScore){
                    gv.bestScore = gv.score;
                }
                setTimeout(function (){
                    fr.viewScene(GameOverScene);
                }, 500);
                break;
        }
    },

    /**
     * Touches control
     */
    addTouchEventListener: function (){
        let self = this;
        self.timer = 0;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: self.holdPower.bind(self),
            onTouchesEnded: self.makeDragonJump.bind(self)
        }, this);
    },

    /**
     * find new position to lay new land
     * @param landType
     * @returns {{x: number, y: number}}
     */
    findNewLandPosition: function (landType){
        let nextX = Math.floor(Math.random() * 1000);

        if (this.currentLand >= 0){
            let sumWidth = this.lands[this.currentLand].width / 2 + LAND_ASSETS[landType].width / 2 + 200;
            while (nextX < this.lands[this.currentLand].x || nextX - this.lands[this.currentLand].x <= sumWidth){
                nextX += 100;
            }
        }else{
            this.currentLand = 0;
            nextX = DEFAUT_POSITION.X;
        }

        return {x: nextX, y: DEFAUT_POSITION.Y};
    },

    /**
     * TODO: ADD LAND TO GAME
     */
    addLand: function (){
        let landType = Math.floor(Math.random() * GameConfig.landNumberType);
        // create new x position
        let newPos = this.findNewLandPosition(landType);
        // Create new land
        let newLand;
        switch (landType){
            case GameConfig.landType.normalLand:
                newLand = new NormalLand(newPos.x, newPos.y);
                break;
            case GameConfig.landType.flatLand:
                newLand = new FlatLand(newPos.x, newPos.y);
                break;
            case GameConfig.landType.thickLand:
                newLand = new ThickLand(newPos.x, newPos.y);
                break;
            default:
                break;
        }
        this.lands.push(newLand);
        this.addChild(newLand.sprite, LAND_ZORDER);
    },

    /**
     * remove land dragon has been on
     */
    removeCurrentLand: function (){
        for (let i = 0; i < this.lands.length; i++){
            this.lands[i].moveBy(-this.dragon.jumpDistance,0);
        }
        this.dragon.moveBy(-this.dragon.jumpDistance, 0);
        gv.originX += this.dragon.jumpDistance;
    },

    /**
     * Hold to prepare to jump
     * @param touches
     * @param event
     */
    holdPower: function (touches, event){
        this.isHold = true;
        this.dragon.hold();
    },

    /**
     * Let dragon jump
     * @param touches
     * @param event
     */
    makeDragonJump: function (touches, event){
        // Jump dragon
        this.isHold = false;
        let distanceJump = this.timer * 500;
        this.dragon.jump(distanceJump);
        this.timer = 0;
    }
})