var characterSpriteList = [];
var skillSpriteList = [];


// NOTE:
/*
 * offsetX1, offsetX2: Original offsetX1 and offsetX2 of the Sprite.
 * offsetY, offsetZ: Use to calibrate the draw position of the final image.
 * destinationWidth, offsetX2: This is the final size of the image.
*/
class Sprite {
    constructor(offsetX1, offsetX2, offsetY, offsetZ, destinationWidth, destinationHeight, numOfSprites) {
        this.offsetX1 = offsetX1;
        this.offsetX2 = offsetX2;
        this.offsetY = offsetY;
        this.offsetZ = offsetZ;
        this.destinationWidth = destinationWidth;
        this.destinationHeight = destinationHeight;
        this.numOfSprites = numOfSprites;
        this.sprites = [];
    }
}

class SkillSprite extends Sprite {
    constructor(offsetX1, offsetX2, offsetY, offsetZ, destinationWidth, destinationHeight, numOfSprites) {
        super(offsetX1, offsetX2, offsetY, offsetZ, destinationWidth, destinationHeight, numOfSprites);
    }

    loadSprite(skillName, skillIndex) {
        
        for (let i = 0; i < this.numOfSprites; i++) {
            this.sprites[i] = new Image();
            let destination = "./Skill_Sprite/" + skillName + "/skill_eff_" + skillIndex + "_" + i + ".png";
            this.sprites[i].src = destination;
        }
    }

    loadBulletSprite(number) {
        for (let i = 1; i < 6; i++) {
            for (let j = 1; j < 9; j++) {
                this.sprites[8*(i-1) + (j-1)] = new Image();
                let destination = "./Bullet/ImpactAnimation" + number + "/row-" + i + "-column-" + j + ".png";
                this.sprites[8*(i-1) + (j-1)].src = destination;
            }
        }
    }
};

class CharacterSprite extends Sprite {
    constructor(offsetX1, offsetX2, offsetY, offsetZ, destinationWidth, destinationHeight, numOfSprites) {
        super(offsetX1, offsetX2, offsetY, offsetZ, destinationWidth, destinationHeight, numOfSprites);
    }

    loadSprite(characterName, action, action2, characterSpecificIndex) {
        for (let i = 0; i < Math.min(10, this.numOfSprites); i++) {
            this.sprites[i] = new Image();
            let destination = "./Character_Sprite/" + characterName + "/" + action + "/" + characterSpecificIndex + "_" + action2 + "_0" + i + ".png";
            this.sprites[i].src = destination;
            //console.log(destination);
        }

        if (this.numOfSprites > 10) {
            for (let j = 10; j < this.numOfSprites; j++) {
                this.sprites[j] = new Image();
                let destination = "./Character_Sprite/" + characterName + "/" + action + "/" + characterSpecificIndex + "_" + action2 + "_" + j + ".png";
                this.sprites[j].src = destination;
            }
        }
    }

    loadPlayerSprite(action) {
        for (let i = 0; i < this.numOfSprites; i++) {
            this.sprites[i] = new Image();
            let destination = "./Character_Sprite/Player/" + action + "/row-1-column-"+ (i+1) + ".png";
            this.sprites[i].src = destination;
            //console.log(destination);
        }
    }
};

////////

let bulletImpact1 = new SkillSprite(0, 0, 0, 0, 64, 64, 40);
bulletImpact1.loadBulletSprite(1);

////////

let levelUpSprite = new SkillSprite(0, 0, 0, 0, 64, 64, 13);
levelUpSprite.loadSprite("LevelUp", "60");

////////

let playerSkill = new CharacterSprite(0, 0, 0, 0, 154, 127, 8);
playerSkill.loadPlayerSprite("Attack1");

let playerSkillLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 8);
playerSkillLeft.loadPlayerSprite("Attack1Left");

let playerAttack = new CharacterSprite(0, 0, 0, 0, 154, 127, 8);
playerAttack.loadPlayerSprite("Attack2");

let playerAttackLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 8);
playerAttackLeft.loadPlayerSprite("Attack2Left");

let playerDeath = new CharacterSprite(0, 0, 0, 0, 154, 127, 7);
playerDeath.loadPlayerSprite("Death");

let playerDeathLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 7);
playerDeathLeft.loadPlayerSprite("DeathLeft");

let playerHit = new CharacterSprite(0, 0, 0, 0, 154, 127, 4);
playerHit.loadPlayerSprite("Hit");

let playerHitLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 4);
playerHitLeft.loadPlayerSprite("HitLeft");

let playerIdle = new CharacterSprite(0, 0, 0, 0, 154, 127, 6);
playerIdle.loadPlayerSprite("Idle");

let playerIdleLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 6);
playerIdleLeft.loadPlayerSprite("IdleLeft");

let playerJump = new CharacterSprite(0, 0, 0, 0, 154, 127, 2);
playerJump.loadPlayerSprite("Jump");

let playerJumpLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 2);
playerJumpLeft.loadPlayerSprite("JumpLeft");

let playerRun = new CharacterSprite(0, 0, 0, 0, 154, 127, 8);
playerRun.loadPlayerSprite("Run");

let playerRunLeft = new CharacterSprite(0, 0, 0, 0, 154, 127, 8);
playerRunLeft.loadPlayerSprite("RunLeft");

let playerSprite = {
    attack: playerAttack,
    attackLeft: playerAttackLeft,
    skill: playerSkill,
    skillLeft: playerSkillLeft,
    death: playerDeath,
    deathLeft: playerDeathLeft,
    hit: playerHit,
    hitLeft: playerHitLeft,
    idle: playerIdle,
    idleLeft: playerIdleLeft,
    jump: playerJump,
    jumpLeft: playerJumpLeft,
    run: playerRun,
    runLeft: playerRunLeft,
};

characterSpriteList.push(playerSprite);

let baseStand = new CharacterSprite(112, 224, 0, 0, 100, 200, 1);
let baseImage = new Image();
baseImage.src = "./Image/Base.png";
baseStand.sprites.push(baseImage);

let baseSprite = {
    idle: baseStand,
}

characterSpriteList.push(baseSprite);

// IMPORTANT NOTES: SPRITE ON THE MONSTERS ARE REVERSED ! THIS IS THE PROGRAMMER'S MISTAKE LELELELEL.

let normalMonsterAttack = new CharacterSprite(20, 0, 30, 0, 170, 170, 15)
normalMonsterAttack.loadSprite("NormalMonster", "attack", "Attack1", 38);

let normalMonsterAttackLeft = new CharacterSprite(20, 0, 30, 0, 170, 170, 15)
normalMonsterAttackLeft.loadSprite("NormalMonster", "attackLeft", "Attack1", 38);

let normalMonsterRun = new CharacterSprite(15, 0, 10, 0, 150, 150, 9)
normalMonsterRun.loadSprite("NormalMonster", "run", "run", 38);

let normalMonsterRunLeft = new CharacterSprite(20, 0, 10, 0, 150, 150, 9)
normalMonsterRunLeft.loadSprite("NormalMonster", "runLeft", "run", 38);

let normalMonsterSprite = {
    attack: normalMonsterAttackLeft,
    attackLeft: normalMonsterAttack,
    run: normalMonsterRunLeft,
    runLeft:normalMonsterRun,
}

characterSpriteList.push(normalMonsterSprite);

/////

let fastMonsterAttack = new CharacterSprite(25, 0, 35, 0, 190, 150, 22)
fastMonsterAttack.loadSprite("FastMonster", "attackLeft", "Attack1", 44);

let fastMonsterAttackLeft = new CharacterSprite(45, 0, 35, 0, 190, 150, 22)
fastMonsterAttackLeft.loadSprite("FastMonster", "attack", "Attack1", 44);

let fastMonsterRun = new CharacterSprite(35, 0, 75, 0, 190, 190, 11)
fastMonsterRun.loadSprite("FastMonster", "runLeft", "run", 44);

let fastMonsterRunLeft = new CharacterSprite(25, 0, 75, 0, 190, 190, 11)
fastMonsterRunLeft.loadSprite("FastMonster", "run", "run", 44);

let fastMonsterSprite = {
    attack: fastMonsterAttack,
    attackLeft: fastMonsterAttackLeft,
    run: fastMonsterRun,
    runLeft: fastMonsterRunLeft,
}

characterSpriteList.push(fastMonsterSprite);

///

let tankMonsterAttack = new CharacterSprite(125, 0, 250, 0, 280, 460, 16)
tankMonsterAttack.loadSprite("TankMonster", "attackLeft", "Attack2", 2);

let tankMonsterAttackLeft = new CharacterSprite(25, 0, 250, 0, 280, 460, 16)
tankMonsterAttackLeft.loadSprite("TankMonster", "attack", "Attack2", 2);

let tankMonsterRun = new CharacterSprite(125, 0, 50, 0, 280, 250, 5)
tankMonsterRun.loadSprite("TankMonster", "runLeft", "run", 2);

let tankMonsterRunLeft = new CharacterSprite(25, 0, 50, 0, 280, 250, 5)
tankMonsterRunLeft.loadSprite("TankMonster", "run", "run", 2);

let tankMonsterSprite = {
    attack: tankMonsterAttack,
    attackLeft: tankMonsterAttackLeft,
    run: tankMonsterRun,
    runLeft: tankMonsterRunLeft,
}

characterSpriteList.push(tankMonsterSprite);

///

let flyMonsterAttack = new CharacterSprite(40, 0, 30, 0, 240, 190, 13)
flyMonsterAttack.loadSprite("FlyMonster", "attackLeft", "Attack1", 32);

let flyMonsterAttackLeft = new CharacterSprite(70, 0, 30, 0, 240, 190, 13)
flyMonsterAttackLeft.loadSprite("FlyMonster", "attack", "Attack1", 32);

let flyMonsterRun = new CharacterSprite(35, 0, 30, 0, 190, 190, 11)
flyMonsterRun.loadSprite("FlyMonster", "runLeft", "run", 32);

let flyMonsterRunLeft = new CharacterSprite(25, 0, 30, 0, 190, 190, 11)
flyMonsterRunLeft.loadSprite("FlyMonster", "run", "run", 32);

let flyMonsterSprite = {
    attack: flyMonsterAttack,
    attackLeft: flyMonsterAttackLeft,
    run: flyMonsterRun,
    runLeft: flyMonsterRunLeft,
}

characterSpriteList.push(flyMonsterSprite);

//
// For now, Fly and Sniper uses the same sprite
characterSpriteList.push(flyMonsterSprite);
//


let groundBossAttack = new CharacterSprite(350, 0, 400, 0, 1000, 1150, 20)
groundBossAttack.loadSprite("groundBoss", "attackLeft", "Attack2", 23);

let groundBossAttackLeft = new CharacterSprite(370, 0, 450, 0, 1000, 1150, 20)
groundBossAttackLeft.loadSprite("groundBoss", "attack", "Attack2", 23);

let groundBossRun = new CharacterSprite(120, 0, 80, 0, 550, 600, 16)
groundBossRun.loadSprite("groundBoss", "runLeft", "run", 23);

let groundBossRunLeft = new CharacterSprite(140, 0, 80, 0, 550, 600, 16)
groundBossRunLeft.loadSprite("groundBoss", "run", "run", 23);

let groundBossSprite = {
    attack: groundBossAttack,
    attackLeft: groundBossAttackLeft,
    run: groundBossRun,
    runLeft: groundBossRunLeft,
}

characterSpriteList.push(groundBossSprite);


////////////////////////////////////////////////////////

// SKILL SPRITES ARE HEREEEEE !!!!!!!!

let piercingShot = new SkillSprite(20, 0, 10, 0, 720, 50, 11);
piercingShot.loadSprite("PiercingShot", "212");
skillSpriteList.push(piercingShot);

let flameArea = new SkillSprite(100, 0, 0, 0, 500, 120, 13);
flameArea.loadSprite("FlameArea", "73");
skillSpriteList.push(flameArea);

let recovery = new SkillSprite(60, 0, 80, 0, 150, 150, 13);
recovery.loadSprite("Recovery", "233");
skillSpriteList.push(recovery);

let stunZone = new SkillSprite(70, 0, 80, 0, 450, 200, 9);
stunZone.loadSprite("StunZone", "167");
skillSpriteList.push(stunZone);

let wallSprite = new SkillSprite(25, 0, 50, 0, 400, 350, 10);
wallSprite.loadSprite("Wall", "253");
skillSpriteList.push(wallSprite);

let explosion = new SkillSprite(60, 0, 60, 0, 300, 300, 9);
explosion.loadSprite("Explosion", "259");
skillSpriteList.push(explosion);

let megaHeal = new SkillSprite(40, 0, 20, 0, 200, 200, 11);
megaHeal.loadSprite("MegaHeal", "56");
skillSpriteList.push(megaHeal);

let explosiveStun = new SkillSprite(60, 0, 60, 0, 200, 200, 12);
explosiveStun.loadSprite("ExplosiveStun", "215");
skillSpriteList.push(explosiveStun);

let smite = new SkillSprite(90, 0, 80, 0, 300, 800, 24);
smite.loadSprite("Smite", "178");
skillSpriteList.push(smite);

let poisonGas = new SkillSprite(90, 0, 45, 0, 600, 120, 18);
poisonGas.loadSprite("PoisonGas", "230");
skillSpriteList.push(poisonGas);

let deflectiveWallSprite = new SkillSprite(25, 0, 50, 0, 400, 350, 10);
deflectiveWallSprite.loadSprite("DeflectiveWall", "258");
skillSpriteList.push(deflectiveWallSprite);

let barrage = new SkillSprite(40, 0, 20, 0, 200, 200, 19);
barrage.loadSprite("Barrage", "144");
skillSpriteList.push(barrage);

let divineShield = new SkillSprite(850, 0, 400, 0, 1800, 100, 8);
divineShield.loadSprite("DivineShield", "80");
skillSpriteList.push(divineShield);

let nuke = new SkillSprite(70, 0, 350, 0, 800, 1200, 28);
nuke.loadSprite("Nuke", "11");
skillSpriteList.push(nuke);

let lightningStrike = new SkillSprite(0, 0, 20, 0, 180, 550, 10);
lightningStrike.loadSprite("Lightning", "63");
skillSpriteList.push(lightningStrike);

let rewind = new SkillSprite(55, 0, 70, 0, 180, 180, 10);
rewind.loadSprite("Rewind", "45");
skillSpriteList.push(rewind);

let rampage = new SkillSprite(80, 0, 140, 0, 220, 250, 10);
rampage.loadSprite("Rampage", "200");
skillSpriteList.push(rampage);

let timeStop = new SkillSprite(950, 0, 450, 0, 2000, 700, 10);
timeStop.loadSprite("TimeStop", "342");
skillSpriteList.push(timeStop);