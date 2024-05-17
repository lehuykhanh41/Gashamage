let skillDataArray = [];

let skillAnimationArray = [];

let originalLevelArray = []; // THis is the original level array
let skillLevelArray = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1]; // This is to store information about the level of each skills.

function loadSkillLevel() {
    for (let i = 0; i < 18; i++) {
        originalLevelArray[i] = originalPlayerSkillLevel[i];
        skillLevelArray[i] = originalLevelArray[i];

        if (skillDataArray[i] !== undefined) {
            skillDataArray[i].level = originalPlayerSkillLevel[i];
            skillDataArray[i].updateValue();
        }
    }
}

class StatusEffect {
    constructor(type, value, lifeTime) {
        this.type = type; // 1 for DOT, 2 for Stun, 3 for Slow.
        this.value = value; // Used for damage, heal etc,...
        this.lifeTime = lifeTime;
    }

    resolve() {} // To be overriden.
}

class Stun extends StatusEffect {
    constructor(lifeTime) {
        super(2, 0, lifeTime);
    }

    resolve(character) {
        this.lifeTime --;
        if (this.lifeTime > 1) {
            character.state = 2;
        }
    }
}

class DamageOverTime extends StatusEffect {
    constructor(damage, lifeTime) {
        super(1, damage, lifeTime);
    }

    resolve(character) {
        this.lifeTime -= 1;
        if (lifeTime % 30 == 0) {
            character.hp -= this.value;
        }
    }
}

class Slow extends StatusEffect {
    constructor(lifeTime) {
        super(3, 0, lifeTime);
    }

    resolve(character) {
        this.lifeTime --;
        if (this.lifeTime > 1 && character.state != 2) {
            character.state = 3;
        }
    }
}

class DivineShieldStatus extends StatusEffect {
    constructor(lifeTime) {
        super(4, 0, lifeTime);
    }

    resolve(character) {
        this.lifeTime--;
        if (this.lifeTime > 2) {
            currentCharacter.state = 4;
            currentBase.state = 4;
        } else {
            currentCharacter.state = 1;
            currentBase.state = 1;
        }
        
    }
}


/////////////////////////////////////////////////////////

class Skill {

    constructor(data, model) {
        this.data = data;
        this.model = model;
        this.lifeTime = data.lifeTime;
        this.skillRate = 0;
        skillAnimationArray.push(this);
    }

    skillCollisionDetect() {
        if (this.model.type == 2) { // If type == self-casting
            if (this.skillRate % 60 == 0) {
                this.data.usage(currentCharacter);
            }
            this.skillRate++;
        } else {
            for (let i = 0; i < monsterArray.length; i++) {
                let leftCollision = ((this.model.hitBox.x-this.model.hitBox.width/2 > monsterArray[i].model.hitBox.x) && (this.model.hitBox.x-this.model.hitBox.width/2 < monsterArray[i].model.hitBox.x+monsterArray[i].model.hitBox.width));
                let rightColiision = ((this.model.hitBox.x+this.model.hitBox.width/2 > monsterArray[i].model.hitBox.x) && (this.model.hitBox.x+this.model.hitBox.width/2 < monsterArray[i].model.hitBox.x+monsterArray[i].model.hitBox.width));
                let leftRightCollision = ((this.model.hitBox.x-this.model.hitBox.width/2 < monsterArray[i].model.hitBox.x) && (this.model.hitBox.x+this.model.hitBox.width/2 > monsterArray[i].model.hitBox.x+monsterArray[i].model.hitBox.width));

                let upCollision = ((this.model.hitBox.y-this.model.hitBox.height/2 > monsterArray[i].model.hitBox.y) && (this.model.hitBox.y-this.model.hitBox.height/2 < monsterArray[i].model.hitBox.y+monsterArray[i].model.hitBox.height));
                let downCollision = ((this.model.hitBox.y+this.model.hitBox.height/2 > monsterArray[i].model.hitBox.y) && (this.model.hitBox.y+this.model.hitBox.height/2 < monsterArray[i].model.hitBox.y+monsterArray[i].model.hitBox.height));
                let upDownCollision = ((this.model.hitBox.y-this.model.hitBox.height/2 < monsterArray[i].model.hitBox.y) && (this.model.hitBox.y+this.model.hitBox.height/2 > monsterArray[i].model.hitBox.y+monsterArray[i].model.hitBox.height));
                
                if ((leftCollision || rightColiision || leftRightCollision) && (upCollision || downCollision || upDownCollision)) {

                    if (this.skillRate % 60 == 0) {
                        this.data.usage(monsterArray[i]);
                    }
                    this.skillRate++;
                }
            }
        }
    }

    resolve() {
        this.lifeTime--;
        this.model.runAnimation();
        if (this.lifeTime > 0) {
            this.skillCollisionDetect();
        } else {
            skillAnimationArray.splice(skillAnimationArray.findIndex((index)=>{return index==this}),1);
        }

    }
}

class SkillData {
    constructor (id, rarity) {
        this.name = "";
        this.text = "";
        this.areaOfEffect = "";
        this.range = "";
        this.src = "";
        this.id = id;
        this.level = skillLevelArray[id];
        this.nextLevel = 10;
        this.damage = 0;
        this.health = 0;
        this.shield = 0;
        this.lifeTime = 1; // To be overriden
        this.rarity = rarity; // 0 for Common, 1 for Rare, 2 for Super Rare, 3 for Legendary, 4 for Ultimate.
        this.cooldown = 1;
        skillDataArray.push(this);
    }

    usage(target) {} // To be overriden.

    updateValue() {} // To be overriden.
}

class SkillModel {
    constructor (id, type, startX, startY, startWidth, startHeight) {
        this.id = id;
        this.type = type; // Type 0 for mouse-location cast, type 1 for bullet, type 2 for self-casting.

        this.color = "white" // For testing purpose.
        
        this.hitBox = {
            x: startX,
            y: startY,
            width: startWidth,
            height: startHeight,
        };

        this.frameRate = 0;
        this.spriteSet = skillSpriteList[id];
        this.currentFrameIndex = 0;
       
        //this.spriteSet = skillSpriteList[id];
        
    }

    updateSkill(startX, startY, newWidth, newHeight) {
        this.hitBox = {
            x: startX,
            y: startY,
            width: newWidth,
            height: newHeight,
        };
    }

    resetSkill(startX, startY, startWidth, startHeight) {
        this.hitBox = {
            x: startX,
            y: startY,
            width: startWidth,
            height: startHeight,
        };
    }

    runAnimation() {
        if (this.type == 2 && this.hitBox.startWidth > 1) {
            this.updateSkill(currentCharacter.model.hitBox.x, currentCharacter.model.hitBox.y+65, this.hitBox.width, this.hitBox.height);
        }

        this.frameRate++;
        
        if (this.frameRate % 2 == 0) {
            this.currentFrameIndex++;
            if (this.currentFrameIndex > this.spriteSet.numOfSprites-1) {
                this.currentFrameIndex = 0;
            }
        }
        
        
        if (this.currentFrameIndex < this.spriteSet.numOfSprites) {
            //animationContext.fillStyle = this.color;
            //animationContext.fillRect(this.hitBox.x - this.hitBox.width/2, this.hitBox.y-this.hitBox.height/2, this.hitBox.width, this.hitBox.height);
            animationContext.drawImage(this.spriteSet.sprites[this.currentFrameIndex], this.hitBox.x - this.hitBox.width/2-this.spriteSet.offsetX1, this.hitBox.y-this.hitBox.height/2-this.spriteSet.offsetY, this.spriteSet.destinationWidth, this.spriteSet.destinationHeight);
    
        }
    }
}


//////////////////

class PiercingShot extends SkillData {
    constructor() {
        super(0, 0);
        this.name = "PIERCING LASER";
        this.lifeTime = 20;
        this.damage = 55 + (10*this.level);
        this.cooldown = 2;
        this.text = "Fire a magical laser beam on the side that your mouse is on, dealing " + this.damage + " damage to all ground enemies it passes through.";
        this.areaOfEffect = "Ground Only."
        this.src = "./Skill_Icon/sk0.png";
        this.audioSRC = "./Music/piercingShotSound.wav";
    }

    usage(target) {
        target.takeDamage(this.damage);
    }
    
    updateValue() {
        this.damage = 55 + (10*this.level);
        this.text = "Fire a magical laser beam on the side that your mouse is on, dealing " + this.damage + " damage to all ground enemies it passes through.";
    }
}

class PiercingShotModel extends SkillModel {
    constructor() {
        if (currentMouseX > 650) {
            super(0, 0, currentCharacter.model.hitBox.x+390, currentCharacter.model.hitBox.y+70, 700, 50);
        } else if (currentMouseX < 650) {
            super(0, 0, currentCharacter.model.hitBox.x-310, currentCharacter.model.hitBox.y+70, 700, 50);
        }
    }
}

////

class FlameArea extends SkillData {
    constructor() {
        super(1, 0);
        this.name = "FLAME BURST"
        this.lifeTime = 30;
        this.damage = 50+(16*this.level);
        this.cooldown = 2;
        this.text = "Erupts the ground underneath your mouse, dealing " + this.damage + " damage to all ground enemies it hit.";
        this.areaOfEffect = "Ground Only";
        this.src = "./Skill_Icon/sk1.png";
        this.audioSRC = "./Music/flameAreaSound.wav";
    }

    usage(target) {
        target.takeDamage(this.damage);
    }

    updateValue() {
        this.damage = 50+(16*this.level);
        this.text = "Erupts the ground underneath your mouse, dealing " + this.damage + " damage to all ground enemies it hit.";
    }
}

class FlameAreaModel extends SkillModel {
    constructor() {
        super(1, 0, currentMouseX, 500, 300, 93);
    }
}

////

class Recovery extends SkillData {
    constructor() {
        super(2, 0);
        this.name = "RECOVERY";
        this.lifeTime = 20;
        this.health = 20+(10*this.level);
        this.cooldown = 10;
        this.text = "Heal " + this.health + " Health for yourself.";
        this.areaOfEffect = "Self."
        this.src = "./Skill_Icon/sk2.png";
        this.audioSRC = "./Music/recoverySound.wav";
    }

    usage(target) {
        target.heal(this.health);
    }

    updateValue() {
        this.health = 20+(10*this.level);
        this.text = "Heal " + this.health + " Health for yourself.";
    }
}

class RecoveryModel extends SkillModel {
    constructor() {
        super(2, 2, currentCharacter.model.hitBox.x+47, currentCharacter.model.hitBox.y+65, 50, 50);
    }
}
///

class StunZone extends SkillData {
    constructor() {
        super(3, 0);
        this.name = "GLEAMING AURA"
        this.lifeTime = 60 + (20*this.level);
        this.damage = 0;
        this.cooldown = 6;
        this.text = "Summon a bright aura at your mouse's location for " + (this.lifeTime/60).toFixed(2) + " seconds, stunning all enemies hit.";
        this.areaOfEffect = "At Mouse Location."
        this.src = "./Skill_Icon/sk3.png";
        this.audioSRC = "./Music/stunZoneSound.wav";
    }

    usage(target) {
        target.takeStatusEffect(new Stun(60));
    }

    updateValue() {
        this.lifeTime = 60 + (20*this.level);
        this.text = "Summon a bright aura at your mouse's location for " + (this.lifeTime/60).toFixed(2) + " seconds, stunning all enemies hit.";
    }
}

class StunZoneModel extends SkillModel {
    constructor() {
        super(3, 0, currentMouseX, currentMouseY, 300, 93);
    }
}

///

class Wall extends SkillData {
    constructor() {
        super(4, 0);
        this.name = "ENERGY BARRIER"
        this.lifeTime = 5;
        this.cooldown = 12;
        this.text = "Summon a barrier around your Statue, protecting everything inside it and making enemies caught inside unable to act. Wall has " + (35+(15*this.level)) + " Health.";
        this.areaOfEffect = "Around The Statue."
        this.src = "./Skill_Icon/sk4.png";
        this.audioSRC = "./Music/wallSound.wav";
    }

    usage(target) {
        let wallModel1 = new CharacterModel(0, 350, 200, 0);
        wallModel1.currentLocation.x = currentBase.model.currentLocation.x-125;
        wallModel1.currentSpriteState = wallSprite;
        let wall1 = new Character(wallModel1, 3, 35+(15*this.level), 0, 0, 0);
    }

    updateValue() {
        this.text = "Summon a barrier around your Statue, protecting everything inside it and making enemies caught inside unable to act. Wall has " + (35+(15*this.level)) + " Health.";
    }
}

class WallModel extends SkillModel {
    constructor() {
        super(4, 2, -2000, -2000, 0, 0);
    }
}

///

class Explosion extends SkillData {
    constructor() {
        super(5, 0);
        this.name = "MAGICAL FIREWORKS";
        this.lifeTime = 30;
        this.damage = 20+(10*this.level);
        this.cooldown = 6;
        this.text = "Implode the area at your mouse location, dealing " + this.damage + " damage three times and knocking back all enemies hit.";
        this.areaOfEffect = "At Mouse Location."
        this.src = "./Skill_Icon/sk5.png";
        this.audioSRC = "./Music/explosionSound.wav";
        
    }

    usage(target) {
        target.takeDamage(this.damage);
        target.takeDamage(this.damage);
        target.takeDamage(this.damage);
    }

    updateValue() {
        this.damage = 20+(10*this.level);
        this.text = "Implode the area at your mouse location, dealing " + this.damage + " damage three times and knocking back all enemies hit.";
    }
}

class ExplosionModel extends SkillModel {
    constructor() {
        super(5, 0, currentMouseX, currentMouseY, 200, 200);
    }
}
////

class MegaHeal extends SkillData {
    constructor() {
        super(6, 1);
        this.name = "MEGA HEAL";
        this.lifeTime = 30;
        this.health = 20+(10*this.level);
        this.cooldown = 10;
        this.text = "Recover " + this.health + " Health for both you and the Statue.";
        this.areaOfEffect = "Self."
        this.src = "./Skill_Icon/sk6.png";
        this.audioSRC = "./Music/megaHealSound.wav";
    }

    usage(target) {
        currentCharacter.heal(this.health);
        currentBase.heal(this.health);
    }

    updateValue() {
        this.health = 20+(10*this.level);
        this.text = "Recover " + this.health + " Health for both you and the Statue.";
    }
}

class MegaHealModel extends SkillModel {
    constructor() {
        super(6, 2, currentCharacter.model.hitBox.x+47, currentCharacter.model.hitBox.y+65, 150, 150);
    }
}
///


class ExplosiveStun extends SkillData {
    constructor() {
        super(7, 1);
        this.name = "SWIRLING ORB";
        this.lifeTime = 59;
        this.damage = 30+(10*this.level);
        this.cooldown = 5;
        this.text = "Summon a magical orb at your mouse location, dealing " + this.damage + " damage and stunning all enemies hit.";
        this.areaOfEffect = "At Mouse Location."
        this.src = "./Skill_Icon/sk7.png";
        this.audioSRC = "./Music/explosiveStunSound.wav";
    }

    usage(target) {
        target.takeDamage(this.damage);
        target.takeStatusEffect(new Stun(60));
    }

    updateValue() {
        this.damage = 30+(10*this.level);
        this.text = "Summon a magical orb at your mouse location, dealing " + this.damage + " damage and stunning all enemies hit.";
    }
}

class ExplosiveStunModel extends SkillModel {
    constructor() {
        super(7, 0, currentMouseX, currentMouseY, 100, 100);
    }
}
///

class Smite extends SkillData {
    constructor() {
        super(8, 1);
        this.name =  "SKYBLASTING TORRENT";
        this.lifeTime = 30;
        this.damage = 50+(16*this.level);
        this.cooldown = 3;
        this.text = "Summon a torrent on the ground underneath your mouse location, which sprouts into the air, dealing " + this.damage + " damage to all ground and air enemies hit.";
        this.areaOfEffect = "At Mouse Location, Vertical."
        this.src = "./Skill_Icon/sk8.png";
        this.audioSRC = "./Music/smiteSound.wav";
    }

    usage(target) {
        target.takeDamage(this.damage);
    }

    updateValue() {
        this.damage = 50+(16*this.level);
        this.text = "Summon a torrent on the ground underneath your mouse location, which sprouts into the air, dealing " + this.damage + " damage to all ground and air enemies hit.";
    }
}

class SmiteModel extends SkillModel {
    constructor() {
        super(8, 0, currentMouseX, 576/2, 120, 500);
    }
}

//////

class PoisonGas extends SkillData {
    constructor() {
        super(9, 1);
        this.name = "POISON GAS";
        this.lifeTime = 121;
        this.damage = 25+(8*this.level);
        this.cooldown = 6;
        this.text = "Create fumes of poison gas on the ground underneath your mouse location, dealing " + this.damage + " damage per second and slowing all enemies hit.";
        this.areaOfEffect = "Ground Only."
        this.src = "./Skill_Icon/sk9.png";
        this.audioSRC = "./Music/poisonGasSound.wav";
    }

    usage(target) {
        target.takeDamage(this.damage);
        
        target.takeStatusEffect(new Slow(90));
    }

    
    updateValue() {
        this.damage = 25+(8*this.level);
        this.text = "Create fumes of poison gas on the ground underneath your mouse location, dealing " + this.damage + " damage per second and slowing all enemies hit.";
    }
}

class PoisonGasModel extends SkillModel {
    constructor() {
        super(9, 0, currentMouseX, 530, 400, 50);
    }
}
////

class DeflectiveWall extends SkillData {
    constructor() {
        super(10, 2);
        this.name = "VENGEANCE BARRIER";
        this.lifeTime = 10;
        this.cooldown = 12;
        this.text = "Create a red barrier with " + (30+(10*this.level)) + " Health, surrounding your statue and protecting anything inside it. Additonally, it deals " + (20+(10*this.level)) + " damage to any enemies that attacks it.";
        this.areaOfEffect = "Around The Statue."
        this.src = "./Skill_Icon/sk10.png";
        this.audioSRC = "./Music/deflectiveWallSound.wav";
    }

    usage(target) {
        let deflectwallModel1 = new CharacterModel(0, 350, 200, 0);
        deflectwallModel1.currentLocation.x = currentBase.model.currentLocation.x-125;
        deflectwallModel1.currentSpriteState = deflectiveWallSprite;
        let deflectwall1 = new Character(deflectwallModel1, 3, 30+(10*this.level), 20+(10*this.level), 0, 0);
    }

    updateValue() {
        this.text = "Create a red barrier with " + (30+(10*this.level)) + " Health, surrounding your statue and protecting anything inside it. Additonally, it deals " + (20+(10*this.level)) + " damage to any enemies that attacks it.";
    }
}

class DeflectiveWallModel extends SkillModel {
    constructor() {
        super(10, 2, -2000,-2000, 0, 0);
    }
}

/////

class Barrage extends SkillData {
    constructor() {
        super(11, 2);
        this.name = "HAIL OF BULLET";
        this.lifeTime = 20;
        this.damage = 16+(8*this.level);
        this.cooldown = 6;
        this.text = "Launches 5 consecutive bullet quickly towards your mouse location, each dealing " + this.damage + " damage. These bullets apply any bullet buffs you have.";
        this.areaOfEffect = "Towards Mouse Location."
        this.src = "./Skill_Icon/sk11.png";
        this.audioSRC = "./Music/barrageSound.wav";
    }

    usage(target) {
       
        let bullet0 = new Bullet(this.damage, {x: currentCharacter.model.hitBox.x+currentCharacter.model.width/2, y: currentCharacter.model.hitBox.y+(currentCharacter.model.hitBox.height/2-30)}, {x: currentMouseX, y: currentMouseY}, 80, bulletSpeed, 40*sizeModifier, 40*sizeModifier, 0); 

        for (let i = 0; i < 5; i++) {
            setTimeout(()=> {
                let bullet1 = new Bullet(this.damage, {x: currentCharacter.model.hitBox.x+currentCharacter.model.width/2, y: currentCharacter.model.hitBox.y+(currentCharacter.model.hitBox.height/2-30)}, {x: currentMouseX, y: currentMouseY}, 80, bulletSpeed, 40*sizeModifier, 40*sizeModifier, 0);
            }, 100*i);
        }
    }

    updateValue() {
        this.damage = 16+(8*this.level);
        this.text = "Launches 5 consecutive bullet quickly towards your mouse location, each dealing " + this.damage + " damage. These bullets apply any bullet buffs you have.";
    }
}

class BarrageModel extends SkillModel {
    constructor() {
        super(11, 2,  currentCharacter.model.hitBox.x+47, currentCharacter.model.hitBox.y+65, 150, 150);
    }
}

///

class DivineShield extends SkillData {
    constructor() {
        super(12, 3);
        this.name = "DIVINE PROTECTION";
        this.lifeTime = 160+20*this.level;
        this.cooldown = 12;
        this.text = "Calls down the holy protective power for  " + (this.lifeTime/60).toFixed(2) + " seconds. During this time, if enemies attack you or the Statue, all damage is converted to heal.";
        this.areaOfEffect = "Self."
        this.src = "./Skill_Icon/sk12.png";
        this.audioSRC = "./Music/divineShieldSound.wav";
    }

    usage(target) {
       currentCharacter.takeStatusEffect(new DivineShieldStatus(60));
       currentBase.takeStatusEffect(new DivineShieldStatus(60));
    }

    updateValue() {
        this.lifeTime = 160+20*this.level;
        this.text = "Calls down the holy protective power for  " + (this.lifeTime/60).toFixed(2) + " seconds. During this time, if enemies attack you or the Statue, all damage is converted to heal.";
    }
}

class DivineShieldModel extends SkillModel {
    constructor() {
        super(12, 2, 640, 620, 60, 60);
    }
}

////

class Nuke extends SkillData {
    constructor() {
        super(13, 3);
        this.name = "DEMONIC ERASER";
        this.lifeTime = 30;
        this.cooldown = 18;
        this.damage = 130 + (50*this.level)
        this.text = "Summon a gigantic, destructive, world-ending magical explosion at the side which your mouse is on, dealing a whopping " + this.damage + " damage.";
        this.areaOfEffect = "At mouse location."
        this.src = "./Skill_Icon/sk13.png";
        this.audioSRC = "./Music/nukeSound.wav";
    }

    usage(target) {
        for (let i = 0; i < 3; i++) {
            target.takeDamage(Math.ceil(this.damage/3));
        }
    }

    updateValue() {
        this.damage = 130 + (50*this.level)
        this.text = "Summon a gigantic, destructive, world-ending magical explosion at the side which your mouse is on, dealing a whopping " + this.damage + " damage.";
    }
    
}

class NukeModel extends SkillModel {
    constructor() {
        super(13, 0, currentMouseX, currentCharacter.model.hitBox.y-105, 550, 475);
    }
}

///

class Lightning extends SkillData {
    constructor() {
        super(14, 0);
        this.lifeTime = 12;
        this.damage = playerOriginalATK/2;
    }

    usage(target) {
        target.takeDamage(this.damage);
    }

    updateValue() {}
}

class LightningModel extends SkillModel {
    constructor(locationX) {
        super(14, 0, locationX, 576/2, 80, 500);
    }
} 

///

class Rewind extends SkillData {
    constructor() {
        super(15, 4);
        this.name = "GEMSTONE: REWIND";
        this.lifeTime = 30;
        this.cooldown = 60-2*this.level;
        this.text = "Immediately refunds your cooldown."
        this.areaOfEffect = "Self."
        this.src = "./Skill_Icon/sk15.png";
    }

    usage(target) {
        currentCooldown[0] = 1;
        currentCooldown[1] = 1;
        currentCooldown[2] = 1;
    }

    updateValue() {
        this.cooldown = 60-2*this.level;
    }
}

class RewindModel extends SkillModel {
    constructor() {
        super(15, 2, currentCharacter.model.hitBox.x+47, currentCharacter.model.hitBox.y+65, 50, 50);
    }
}


///

class Rage extends SkillData {
    constructor(currentFireRate, currentBulletSpeed) {
        super(16, 4);
        this.name = "GEMSTONE: RAMPAGE";
        this.lifeTime = 150+(30*this.level);
        this.cooldown = 50-(this.level);
        this.text = "You gain a massive amount of Fire Rate and Bullet Speed."
        this.areaOfEffect = "Self."
        this.src = "./Skill_Icon/sk16.png";
        this.currFireRate = currentFireRate;
        this.currBulletSpeed = currentBulletSpeed;
    }

    usage(target) {
        this.lifeTime -= 60;
        if (this.lifeTime > 1) {
            fireRate = 6;
            bulletSpeed = 30;
        } else {
            fireRate = this.currFireRate;
            bulletSpeed = this.currBulletSpeed;
        }

        console.log(this.lifeTime);
    }

    updateValue() {
        this.cooldown = 50-(this.level);
        this.lifeTime = 150+(30*this.level);
    }
    
}

class RageModel extends SkillModel {
    constructor() {
        super(16, 2, currentCharacter.model.hitBox.x+47, currentCharacter.model.hitBox.y+65, 50, 50);
    }
}

///

class TimeStop extends SkillData {
    constructor(spawnLimit) {
        super(17, 4);
        this.name = "GEMSTONE: TIME STOP";
        this.lifeTime = 150+(30*this.level);
        this.cooldown = 60-(this.level);
        this.text = "Stuns all enemies on screen."
        this.areaOfEffect = "Self."
        this.src = "./Skill_Icon/sk17.png";
        this.spwlm = spawnLimit;
    }

    usage(target) {
        this.lifeTime-= 60;
        if (this.lifeTime > 1) {
            for (let i = 0; i < monsterArray.length; i++) {
                if (monsterArray[i] != undefined) {
                    monsterArray[i].takeStatusEffect(new Stun(60));
                }
            }
        spawnLimit = 200;

        } else {
            spawnLimit = this.spwlm;
        }
    }

    updateValue() {
        this.lifeTime = 150+(30*this.level);
        this.cooldown = 60-(this.level);
    }
}

class TimeStopModel extends SkillModel {
    constructor() {
        super(17, 2, currentCharacter.model.hitBox.x+47, currentCharacter.model.hitBox.y+65, 50, 50);
    }
}




function processSkill() {
    for (let i = 0; i < skillAnimationArray.length; i++) {
            if (skillAnimationArray[i] != undefined) {
                animationContext.fillStyle = skillAnimationArray[i].model.color;

                skillAnimationArray[i].resolve();
        }
    }
}


// How to create a SKill?
// 1) Intitiate the Data.
// 2) Create the Model.
// 3) new Skill (Data, Model) - this is created on button press.

// Remember to update Skill Level Array.

// NOTE OF SKILL TYPE:

// Cast At Mouse, Self Cast: Self Explanatory.
// If cast that take player as location, take center X as the middle of the hit box.

function createSkillDataArray() {
    let zero = new PiercingShot();

    let one = new FlameArea();

    let two = new Recovery();

    let three = new StunZone();

    let four = new Wall();

    let five = new Explosion();

    let six = new MegaHeal();

    let seven = new ExplosiveStun();

    let eight = new Smite();

    let nine = new PoisonGas();

    let ten = new DeflectiveWall();

    let eleven = new Barrage();

    let twelve = new DivineShield();

    let thirteen = new Nuke();

    let fourteen = new Lightning();

    let fifteen = new Rewind();

    let sixteen = new Rage();

    let seventeen = new TimeStop();

}

createSkillDataArray();