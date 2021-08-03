let GamePlayScene = cc.Scene.extend({
    ctor: function (){
        this._super();
        this.container = ccs.load(res.gamePlayScene).node;
        this.homeButton = this.container.getChildByName("HomeButton");
        this.pauseButton = this.container.getChildByName("PauseButton");
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

        buildUI(this.container);
        this.addChild(this.container);
        this.addChild(this.dragon.container);
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

    updateLogic: function (){
        this.dragon.updateLogic();
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
        this.addChild(newLand, 0);
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
        this.isHold = false;
        this.dragon.jump(this.timer);
        this.timer = 0;
        this.currentLand++;
        this.addLand();
    }
})