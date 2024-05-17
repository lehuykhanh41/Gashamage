let monsterArray = [];
let entityArray = [undefined]; // Can only have 2 entites: 1 on the left and 1 on the right. 

let monsterKilled = 0;
let thisLevelKilled = 0;

let goldEarned = 0;
let goldEarnBuff = 1;
let diamondEarned = 0;
let diamondEarnBuff = 0;
let gameClock = 600;

let recoverySpeed = originalRecoverySpeed;

let isTakingDamage = false;

let diamondGemBuff = 0;

let statueRecoveryGem = 0;


class Character {
    constructor(model, type, hp, atk, def, mana) {
        this.model = model;
        this.type = type; // 0 for Player, 1 for Monster, 2 for base, 3 for entity left, 4 for entity right.

        this.hp = hp;
        this.maxHP = hp;
        this.atk = atk;
        this.def = def;
        this.mana = mana;
        this.maxMana = mana;
        this.statusEffect = [];
        this.shield = 0;
        this.avatar = "";

        
        this.state = 1; // 0 for dead, 1 for alive, 2 for Stunned, 3 for Slowed.
        this.closer = undefined;

        // ONLY FOR MONSTERS
        if (type == 1) {
            monsterArray.push(this);
            this.startDirection = 0; // 0 for left, 1 for right
        } else if (type == 0) {
            document.getElementById("maxHP").innerHTML = this.maxHP;
        } else if (type == 2) {
            document.getElementById("maxBaseHP").innerHTML = this.maxHP;
        } else if (type == 3) {
            entityArray[0] = this;
        }

        this.speed = 0;
        this.speedModifier = 0;
        this.monsterMovement = 0; // 0 for ground, 1 for air.
        this.attackPriority = 0; // 0 for all, 1 for people, 2 for base.
    }

    updateCharacterState() {
        this.model.updateCharacter();

        if (this.hp < this.maxHP-0.02) {
            this.hp+=recoverySpeed;
        }
        document.getElementById("maxHP").innerHTML = this.maxHP;
        document.getElementById("currHP").innerHTML = Math.floor(this.hp);
        document.getElementById("hpDisplay").style.width = Math.max((this.hp*100/this.maxHP)-3, 0) + "%";

        if (statueRecoveryGem > 0 && currentBase.hp < (currentBase.maxHP-0.02)) {
            currentBase.hp += statueRecoveryGem;
        }

        document.getElementById("maxBaseHP").innerHTML = currentBase.maxHP;
        document.getElementById("currBaseHP").innerHTML = Math.floor(currentBase.hp);
        document.getElementById("baseHPDisplay").style.width = Math.max((currentBase.hp*100/currentBase.maxHP)-3, 0) + "%";

        this.resolveStatusEffect();
    }

    updateMonsterState() {
        
        if (this.hp <= 0) {
            this.statusEffect = [];
            monsterArray.splice(monsterArray.findIndex((index) => {return index == this}), 1);
            monsterKilled++;
            thisLevelKilled++;

            if (Math.random() < diamondGemBuff) {
                diamondEarned += 1;
            }

            if (this.model.id == 4) {
                goldEarned += Math.ceil(15*goldEarnBuff);
            } else if (this.model.id == 7) {
                goldEarned += Math.ceil(30*goldEarnBuff);
                diamondEarned += 2+diamondEarnBuff;
                URMode = 1;
            } else {
                goldEarned += Math.ceil(8*goldEarnBuff);
            }
        }

        //console.log("STATE NOW: " + this.state);

        if (this.state == 3) {
            this.speedModifier = -3;
        } else {
            this.speedModifier = 0;
        }

        if (this.state != 2) {
        
            // Find Closer.
            if (entityArray[0] != undefined) {
                this.closer = entityArray[0];
            } else {
                if (this.attackPriority == 0) {
                    if (Math.abs(currentCharacter.model.hitBox.x - this.model.hitBox.x) < Math.abs(currentBase.model.hitBox.x - this.model.hitBox.x)) {
                        this.closer = currentCharacter;
                    } else {
                        this.closer = currentBase;
                    }
                }
                else if (this.attackPriority == 1) {
                    this.closer = currentCharacter;
                } 
                else if (this.attackPriority == 2) {
                    this.closer = currentBase;
                }
            }

        
        if (((this.startDirection == 1) && (this.model.hitBox.x - this.closer.model.hitBox.x - this.closer.model.hitBox.width) > 0 && (this.model.hitBox.x - this.closer.model.hitBox.x - this.closer.model.hitBox.width) < this.model.range) || ((this.startDirection == 0) && (this.closer.model.hitBox.x - this.model.hitBox.x - this.model.hitBox.width) > 0 && (this.closer.model.hitBox.x - this.model.hitBox.x - this.model.hitBox.width) < this.model.range)) {
        
            //console.log(this.model.hitBox.x + " " + this.closer.model.hitBox.x);

            //console.log("YOU GOT HIT!");
            this.model.changeSpriteState("attack");
            if (this.monsterMovement == 1) {
                if (spawnRate % 120 == 0) {
                    let monsterbullet1 = new Bullet(this.atk, {x: this.model.hitBox.x+this.model.width/2, y: this.model.hitBox.y+(this.model.hitBox.height/2)}, {x: this.closer.model.hitBox.x+(this.closer.model.hitBox.width/2), y: this.closer.model.hitBox.y+(this.closer.model.hitBox.height/2)}, 80, 12, 26, 26, 1);
                    monsterbullet1.type = this.attackPriority;
                }
            } else if (this.monsterMovement == 0) {
                if (spawnRate % 80 == 0) {
                    this.closer.takeDamage(this.atk);
                    // If hit a deflection wall
                    if (this.closer.type == 3) {
                        this.hp -= this.closer.atk;
                    }
                }
            }
        } 
        else {
            this.model.changeSpriteState("run");
            if (this.startDirection == 0) {
                this.model.moveRight(this.speed, this.speedModifier);
            } else if (this.startDirection == 1) {
                this.model.moveLeft(this.speed, this.speedModifier);
            }
        }
        
    } else {
        let fontSize = 30;
        screenContext.font = "bolder " + fontSize +"px Georgia";
        screenContext.fillStyle = "#FAFAFA";

        if (this.startDirection == 0) {
            screenContext.fillText("STUNNED", this.model.hitBox.x+this.model.hitBox.width/2-50, this.model.hitBox.y-5, this.model.width);
        } else {
            screenContext.fillText("STUNNED", this.model.hitBox.x+this.model.hitBox.width/2-30, this.model.hitBox.y-5, this.model.width);            
        }
    }

    this.resolveStatusEffect();
    
    this.model.updateMonster();
    
    }

    updateEntityState() {
        
        if (this.hp <= 0) {
            this.statusEffect = [];
            if (this == entityArray[0]) {
                entityArray[0] = undefined;
            }
        }

        //console.log("STATE NOW: " + this.state);

    this.model.updateEntity();
    }

    takeDamage(damage) {
        if (this.type == 0) {
            if (!isTakingDamage) {
                isTakingDamage = true;
                setTimeout(()=> {
                    isTakingDamage = false;
                }, 500);
            }
        }
        if (this.state == 4) {
            this.heal(damage);
        } else {
            this.hp -= ((damage-this.def)-this.shield);

            if (this.shield > 0) {
                this.shield = Math.max(0, (this.shield-damage)); 
            }
            
            if (this.type == 1) {

                let impact = new ImpactAnimation(this.model.hitBox.x, this.model.hitBox.y, bulletImpact1, 38, 280, 280);

               
                let fontSize = Math.min(55, 20+Math.floor(damage/16));
                dmgContext.font = "bolder " + fontSize +"px Georgia";

                if (damage < 76) {
                    dmgContext.fillStyle = "white";
                } else if (damage > 75 && damage < 141) {
                    dmgContext.fillStyle = "orange";
                } else if (damage > 140) {
                    dmgContext.fillStyle = "#FF4444";
                }

                if (this.model.id != 7 && damage > 1) {
                    if (this.startDirection == 0) {
                        this.model.currentLocation.x -= 40;
                        dmgContext.fillText(damage, this.model.hitBox.x+this.model.hitBox.width/2-20, this.model.hitBox.y-5, this.model.width);
                    } else {
                        this.model.currentLocation.x += 40;
                        dmgContext.fillText(damage, this.model.hitBox.x+this.model.hitBox.width/2+20, this.model.hitBox.y-5, this.model.width);
                    }
                }


                this.updateMonsterState();
            }
        }
    }

    heal(health) {
        if (this.hp < this.maxHP) {
            this.hp = Math.min(this.maxHP, this.hp+health);
        }

        let fontSize = 25;
        dmgContext.font = "bolder " + fontSize +"px Georgia";

        dmgContext.fillStyle = "#83F28F";
        
        dmgContext.fillText(health, this.model.hitBox.x+this.model.hitBox.width/2, this.model.hitBox.y-5, this.model.width);

    }

    getShield(shield) {
        this.shield += shield;
    }

    takeStatusEffect(effect) {
        this.statusEffect.push(effect);
    }

    resolveStatusEffect(){
        for (let i = 0; i < this.statusEffect.length; i++) {
            this.statusEffect[i].resolve(this);
            //console.log(this.statusEffect[i].lifeTime);
            if (this.statusEffect[i].lifeTime < 0.01) {
                this.statusEffect.splice(this.statusEffect.findIndex((index) => {return index == this.statusEffect[i]}), 1);
            }
        }
        if (this.statusEffect.length == 0) {
            this.state = 1;
        }
        
    }
}

class CharacterModel {
    constructor (id, width, height, range) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.range = range;
        this.spriteSet = characterSpriteList[id];

        this.frameRate = 0;
        this.currentFrameIndex = 0;
        this.currentSpriteState = this.spriteSet.idle;

        this.facingDirection = 0; // 0 for left, 1 for right;

        if (id == 0) {
            this.currentSpriteState = this.spriteSet.idleLeft;
        } else if (id > 1) {
            this.currentSpriteState = this.spriteSet.attack;
        }

        this.color = "red" // Only for testing.

        this.currentLocation = {
            x: 600,
            y: 0,
        }

        this.hitBox = {
            x: this.currentLocation.x,
            y: this.currentLocation.y,
            width: this.width,
            height: this.height,
        }
    }

    changeSpriteState(action) {
        
        switch (action) {
            
            case "idle":
                if (this.facingDirection == 1) {
                    if (this.currentSpriteState !== this.spriteSet.idle) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.idle;
                    }
                } else {
                    if (this.currentSpriteState !== this.spriteSet.idleLeft) {  
                        this.frameRate = 0;
                        this.currentFrameIndex = 0; 
                        this.currentSpriteState = this.spriteSet.idleLeft;
                    }
                }
                break;

            case "attack":
               
                if (this.facingDirection == 1) {
                    if (this.currentSpriteState != this.spriteSet.attack) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.attack;
                    }
                } else {
                    if (this.currentSpriteState != this.spriteSet.attackLeft) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.attackLeft;
                    }
                }
                break;

            case "skill":
                if (this.facingDirection == 1) {
                    if (this.currentSpriteState != this.spriteSet.skill) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.skill;
                    }
                } else {
                    if (this.currentSpriteState != this.spriteSet.skillLeft) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.skillLeft;
                    }
                }
                break;

            case "jump":
                this.frameRate = 0;
                this.currentFrameIndex = 0;
                
                if (this.facingDirection == 1) {
                    this.currentSpriteState = this.spriteSet.jump;
                } else {
                    this.currentSpriteState = this.spriteSet.jumpLeft;
                }
                break;

            case "run":
                if (this.facingDirection == 1) {
                    if (this.currentSpriteState != this.spriteSet.run) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.run;
                    }
                } else {
                    if (this.currentSpriteState != this.spriteSet.runLeft) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.runLeft;
                    }
                }
                break;

            case "death":
                if (this.facingDirection == 1) {
                    this.currentSpriteState = this.spriteSet.death;
                } else {
                    this.currentSpriteState = this.spriteSet.deathLeft;
                }
                break;

            case "hit":
                if (this.facingDirection == 1) {
                    if (this.currentSpriteState != this.spriteSet.hit) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.hit;
                    }
                } else {
                    if (this.currentSpriteState != this.spriteSet.hitLeft) {
                        this.frameRate = 0;
                        this.currentFrameIndex = 0;
                        this.currentSpriteState = this.spriteSet.hitLeft;
                    }
                }
                break;
        }
    }

    updateCharacter() {
        
        this.hitBox.x = this.currentLocation.x;
        this.hitBox.y = (536-this.height)+(this.currentLocation.y);
        //chrContext.fillStyle = "green";
        //chrContext.fillRect(currentCharacter.model.hitBox.x, currentCharacter.model.hitBox.y, currentCharacter.model.hitBox.width, currentCharacter.model.hitBox.height);

        this.frameRate++;
        if (this.frameRate % 5 == 0) {
            this.currentFrameIndex++;
            if (this.currentFrameIndex > this.currentSpriteState.numOfSprites-1) {
                this.currentFrameIndex = 0;
            }
        }

        if (this.facingDirection == 1) {
            chrContext.drawImage(this.currentSpriteState.sprites[this.currentFrameIndex], currentCharacter.model.hitBox.x-105, currentCharacter.model.hitBox.y-105, currentCharacter.model.hitBox.width*2+150, currentCharacter.model.hitBox.height*2+60);
        } else if (this.facingDirection == 0) {
            chrContext.drawImage(this.currentSpriteState.sprites[this.currentFrameIndex], currentCharacter.model.hitBox.x-120, currentCharacter.model.hitBox.y-105, currentCharacter.model.hitBox.width*2+150, currentCharacter.model.hitBox.height*2+60);
        }
    }

    updateMonster() {
        this.hitBox.x = this.currentLocation.x-1.777*camera.x;
        this.hitBox.y = (536-this.height)+(this.currentLocation.y);
        //chrContext.fillStyle = this.color;
        //chrContext.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    
        this.frameRate++;
        if (this.frameRate % 5 == 0) {
            this.currentFrameIndex++;
            if (this.currentFrameIndex > this.currentSpriteState.numOfSprites-1) {
                this.currentFrameIndex = 0;
            }
        }


        if (this.facingDirection == 1) {
            chrContext.drawImage(this.currentSpriteState.sprites[this.currentFrameIndex], this.hitBox.x-this.currentSpriteState.offsetX1, this.hitBox.y-this.currentSpriteState.offsetY, this.currentSpriteState.destinationWidth, this.currentSpriteState.destinationHeight);
        } else if (this.facingDirection == 0) {
            chrContext.drawImage(this.currentSpriteState.sprites[this.currentFrameIndex], this.hitBox.x-this.currentSpriteState.offsetX1, this.hitBox.y-this.currentSpriteState.offsetY, this.currentSpriteState.destinationWidth, this.currentSpriteState.destinationHeight);
        }
    }

    updateBase() {
        this.hitBox.x = this.currentLocation.x - 1.777*(camera.x-360);
        this.hitBox.y = (536-this.height)+(this.currentLocation.y);
        //chrContext.fillStyle = "gray";
        //chrContext.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
        chrContext.drawImage(this.currentSpriteState.sprites[this.currentFrameIndex], currentBase.model.hitBox.x-25, currentBase.model.hitBox.y-105, currentBase.model.hitBox.width*1.5, currentBase.model.hitBox.height*1.5);
    }

    updateEntity() {
        this.hitBox.x = this.currentLocation.x - 1.777*(camera.x-360);
        this.hitBox.y = (536-this.height)+(this.currentLocation.y);
        //chrContext.fillStyle = "brown";
        //chrContext.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    
        this.frameRate++;
        if (this.frameRate % 5 == 0) {
            this.currentFrameIndex++;
            if (this.currentFrameIndex > this.currentSpriteState.numOfSprites-1) {
                this.currentFrameIndex = 0;
            }
        }
    
        chrContext.drawImage(this.currentSpriteState.sprites[this.currentFrameIndex], this.hitBox.x-this.currentSpriteState.offsetX1, this.hitBox.y-this.currentSpriteState.offsetY, this.currentSpriteState.destinationWidth, this.currentSpriteState.destinationHeight);
    }
    
    moveLeft(speed, modifier) {
        if (this.currentLocation.x > 1370+this.range) {
            this.currentLocation.x -= (speed + modifier);
        }
    }

    moveRight(speed, modifier) {
        if (this.currentLocation.x < 1190-this.range) {
            this.currentLocation.x += (speed + modifier);
            //console.log(this.currentLocation.x);
        }
    }

    updateHitBoxSize(newW, newH) {
        this.hitBox.width = newW;
        this.hitBox.height = newH;
    }
}

let TIME_MODIFIER = 1;

// Normal Monster are regular walk monster, attack anything it sees.

class NormalMonster extends Character {
    constructor() {
        super(new CharacterModel(2, 105, 120, 20), 1, 60*TIME_MODIFIER, 20*TIME_MODIFIER, 0, 0);
        this.model.color = "red";
        this.speed = 4;
        this.monsterMovement = 0;
        this.attackPriority = 0;
        this.avatar = "./Enemies/normalAvatar.png";
        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.facingDirection = 1;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.facingDirection = 0;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }
    }
}

// Fast Monster are extremely fast monsters that only attack the base.

class FastMonster extends Character {
    constructor() {
        super(new CharacterModel(3, 130, 90, 20), 1, 40*TIME_MODIFIER, 20*TIME_MODIFIER, 0, 0);
        this.model.color = "#FF9090";
        this.speed = 6;
        this.monsterMovement = 0;
        this.attackPriority = 2; // Only attack base.
        this.avatar = "./Enemies/fastAvatar.png";

        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.facingDirection = 1;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.facingDirection = 0;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }
    }
}

// Carry Monsters are slow but have high damange.
/*
class BeastMonster extends Character {
    constructor() {
        super(new CharacterModel(3, 103, 150, 20), 1, 60*TIME_MODIFIER, 30*TIME_MODIFIER, 0, 0);
        this.model.color = "#F32020";
        this.speed = 2;
        this.monsterMovement = 0;
        this.attackPriority = 0; // Attack everything

        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }
    }
}
*/
// Tank monster are fast. They does not deal damage, but tanks for other enemies behind itself.

class TankMonster extends Character {
    constructor() {
        super(new CharacterModel(4, 112, 170, 10), 1, 100*TIME_MODIFIER, 0, 0, 0);
        this.model.color = "yellow";
        this.speed = 6.5;
        this.monsterMovement = 0;
        this.attackPriority = 2; // Rush to base.
        this.avatar = "./Enemies/tankAvatar.png";

        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.facingDirection = 1;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.facingDirection = 0;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }
    }
}

// Fly Monster are regular monster but fly.

class FlyMonster extends Character {
    constructor() {
        super(new CharacterModel(5, 103, 130, 150), 1, 40*TIME_MODIFIER, 10*TIME_MODIFIER, 0, 0);
        this.model.color = "blue";
        this.speed = 3;
        this.monsterMovement = 1;
        this.attackPriority = 0; // Attack everything
        this.avatar = "./Enemies/flyAvatar.png";

        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.facingDirection = 1;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.facingDirection = 0;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }

        this.model.currentLocation.y = -350;
        this.model.hitBox.y = -350;
    }
}

// Sniper Monster are long-range, flying monster that only attack characters.

class SniperMonster extends Character {
    constructor() {
        super(new CharacterModel(6, 103, 130, 600), 1, 40*TIME_MODIFIER, 10*TIME_MODIFIER, 0, 0);
        this.model.color = "teal";
        this.speed = 2;
        this.monsterMovement = 1;
        this.attackPriority = 1; // Attack human
        this.avatar = "./Enemies/flyAvatar.png";

        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.facingDirection = 1;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.facingDirection = 0;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }

        this.model.currentLocation.y = -350;
        this.model.hitBox.y = -350;
    }
}

// Boss Monster are big, slow moving but has very high hp and damage 

class GroundBoss extends Character {
    constructor() {
        super(new CharacterModel(7, 279, 420, 30), 1, 520*TIME_MODIFIER, 30*TIME_MODIFIER, 0, 0);
        this.model.color = "black";
        this.speed = 1;
        this.monsterMovement = 0;
        this.attackPriority = 0; // Attack everything
        this.avatar = "./Enemies/bossAvatar.png";

        if (Math.random() < 0.5) {
            this.startDirection = 0;
            this.model.facingDirection = 1;
            this.model.currentLocation.x = 0;
            this.model.hitBox.x = 0;
        } else {
            this.startDirection = 1;
            this.model.facingDirection = 0;
            this.model.currentLocation.x = 2440;
            this.model.hitBox.x = 2440;
        }
    }
}

let charTestModel = new CharacterModel (0, 75, 120, 205);
let charTest = new Character(charTestModel, 0, playerOriginalHP, playerOriginalATK, 0, 0);

let currentCharacter = charTest;

let baseTestModel = new CharacterModel(1, 100, 200, 0);
baseTestModel.currentLocation.x = 640;
let currentBase = new Character(baseTestModel, 2, baseOriginalHP, 0, 0, 0);

function createCharacter() {
    let playerModel = new CharacterModel (0, 75, 120, 205);
    let playerCharacter = new Character(playerModel, 0, playerOriginalHP, playerOriginalATK, 0, 0);

    currentCharacter = playerCharacter;
}

function createBase() {
    let baseModel = new CharacterModel(1, 100, 200, 0);
    baseModel.currentLocation.x = 640;
    currentBase = new Character(baseModel, 2, baseOriginalHP, 0, 0, 0);
}


// ALGORITHM:
// 1180 = Upper Limit of Hit Box x (because need to be added with character model width)
// Ratio = 1.7777

// SPAWN POSITION:
// Left: x = 0;
// Right: x = 2440;

let spawnRate = 0;
let spawnLimit = 100; // 2 seconds each.
let bozz1Spawned = false;
let bozz2Spawned = false;
let bozz3Spawned = false;

function monsterAction() {
    spawnRate++;

    if ((spawnRate % spawnLimit == 0) && monsterArray.length < 30) {
        let spawnResult = Math.random();
        
        if (gameClock < 421 && gameClock > 417) {
            if (!bozz1Spawned) {
                let spawnMonster = new GroundBoss();
                bozz1Spawned = true;
            }
        }

        if (gameClock < 331 && gameClock > 327) {
            if (!bozz2Spawned) {
                let spawnMonster = new GroundBoss();
                setTimeout(()=> {
                    let spawnMonster2 = new GroundBoss();
                }, 1000);
                bozz2Spawned = true;
            }
        }

        if (gameClock < 181 && gameClock > 177) {
            if (!bozz3Spawned) {
                let spawnMonster = new GroundBoss();
                setTimeout(()=> {
                    let spawnMonster2 = new GroundBoss();
                }, 1000);
                
                setTimeout(()=> {
                    let spawnMonster3 = new GroundBoss();
                }, 2000);
                
                bozz3Spawned = true;
            }
        }
        
        if (spawnResult < 0.3) {
            let spawnMonster = new NormalMonster();
        } else if (spawnResult < 0.5) {
            let spawnMonster = new FlyMonster();
        } else if (spawnResult < 0.7) {
            let spawnMonster = new FastMonster();
        } else if (spawnResult < 0.8) {
            let spawnMonster = new FastMonster();
            // Beast not implemented.
            //let spawnMonster = new BeastMonster();
        } else if (spawnResult < 0.9) {
            let spawnMonster = new SniperMonster();
        } else if (spawnResult < 1) {
            let spawnMonster = new TankMonster();
        } 
        

        //let spawnMonter = new GroundBoss();
    }

    for (let i = 0; i < monsterArray.length; i++) {
        monsterArray[i].updateMonsterState();
    }

    for (let j = 0; j < entityArray.length; j++) {
        if (entityArray[j] !== undefined) {
            entityArray[j].updateEntityState();
        }
    }
}

function resetSpawnRate() {
    spawnLimit = 100; // 2 seconds each.
    TIME_MODIFIER = 1;
    
    bozz1Spawned = false;
    bozz2Spawned = false;
    bozz3Spawned = false;

    monsterKilled = 0;
    thisLevelKilled = 0;
    
    goldEarned = 0;
    goldEarnBuff = 1;
    diamondEarned = 0;
    diamondEarnBuff = 0;
    gameClock = 600;
}