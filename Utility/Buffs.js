let SRSpawnChance = 0;

let commonBuffArray = [];
let rareBuffArray = [];
let superRareBuffArray = [];
let URBuffArray = [];

let currentBuffArray = [];

let rerollAmount = originalRerollAmount;

let damageBlessingBuff = -1;
let fireRateBlessingBuff = -1;
let healthBlessingBuff = -1;
let goldBlessingBuff = -1;

let fireRateCapSpeed = true;


class Buff {
    constructor(rarity) {
        this.name = "";
        this.src = "";
        this.rarity = rarity; // 0 for Common, 1 for Rare, 2 for Super Rare, 3 for Boss-Like.
        this.text = "";
        if (this.rarity == 0) {
            commonBuffArray.push(this);
        } else if (this.rarity == 1) {
            rareBuffArray.push(this);
        } else if (this.rarity == 2) {
            superRareBuffArray.push(this);
        } if (this.rarity == 3) {
            URBuffArray.push(this);
        } 
    }
    applyBuff() { // To be overriden.

    } 
}

class damageBuff extends Buff {
    constructor(rarity) {
        super(rarity);
        this.name = "DESTRUCTIVE BLESSING";
        this.src = "./BuffIcons/damageBuff.png";
        this.value = (5+5*rarity);
        this.text = "Increase Bullet Damage by " + this.value + "%.";
    }

    applyBuff() {
        bulletDamage += (this.value/100) * playerOriginalATK;
        let newBuff = parseInt(document.getElementById("damageBuff").innerText)+(this.value);
        document.getElementById("damageBuff").innerHTML = newBuff;
    }
}

class fireRateBuff extends Buff {
    constructor(rarity) {
        super(rarity);
        this.name = "RAMPAGE BLESSING";
        this.src = "./BuffIcons/fireRateBuff.png"
        this.value = (5+5*rarity);
        this.text = "Increase Fire Rate and Bullet Speed by " + this.value + "%";
    }

    applyBuff() {
        fireRate = Math.floor(fireRate*(1-this.value/100));
        if (fireRateCapSpeed) {
            if (fireRate < 10) {
                fireRate = 10;
            }
        } else {
            if (fireRate < 7) {
                fireRate = 7;
            }
        }
        let newBuff = parseInt(document.getElementById("fireRateBuff").innerText)+(this.value);
        document.getElementById("fireRateBuff").innerHTML = newBuff;
        

        bulletSpeed += Math.floor(originalBulletSpeed * (this.value/200));
        newBuff = parseInt(document.getElementById("bulletSpeedBuff").innerText)+(this.value/2);
        document.getElementById("bulletSpeedBuff").innerHTML = newBuff;
    }
}

class healthBuff extends Buff {
    constructor(rarity) {
        super(rarity);
        this.name = "VITALITY BLESSING";
        this.src = "./BuffIcons/healthBuff.png"
        this.value = (5+5*rarity);
        this.text = "Increase Health by " + this.value + "% and Statue HP by half that amount.";
    }

    applyBuff() {
        currentCharacter.maxHP += Math.floor((this.value/100) * playerOriginalHP);
        currentCharacter.hp += Math.floor((this.value/100) * playerOriginalHP);

        currentBase.maxHP += Math.floor((this.value/200) * baseOriginalHP);
        currentBase.hp += Math.floor((this.value/200) * baseOriginalHP);

        let newBuff = parseInt(document.getElementById("healthBuff").innerText)+(this.value);
        document.getElementById("healthBuff").innerHTML = newBuff;
    }
}

class recoveryBuff extends Buff {
    constructor(rarity) {
        super(rarity);
        this.name = "ENDURANCE BLESSING";
        this.src = "./BuffIcons/recoveryBuff.png"
        this.value = (5+5*rarity);
        this.text = "Increase Recovery Speed by " + this.value + "%.";
    }

    applyBuff() {
        recoverySpeed += Math.floor((this.value/50) * originalRecoverySpeed);
        let newBuff = parseInt(document.getElementById("recoveryBuff").innerText)+(this.value);
        document.getElementById("recoveryBuff").innerHTML = newBuff;
    }
}


class movementBuff extends Buff {
    constructor(rarity) {
        super(rarity);
        this.name = "WIND BLESSING";
        this.src = "./BuffIcons/movementBuff.png"
        this.value = (5+5*rarity);
        this.text = "Increase Move Speed and Jump Height by " + this.value + "%.";
    }

    applyBuff() {
        speed += this.value/10;
        if (speed > 20) {
            speed = 20;
        }
        let newBuff = parseInt(document.getElementById("speedBuff").innerText)+(this.value);
        document.getElementById("speedBuff").innerHTML = newBuff;
        
        gravity -= this.value/20;

        ceiling += this.value/20;

        if (ceiling > 280) {
            ceiling = 280;
        }
        if (gravity < 3) {
            gravity = 3;
        }
        
        newBuff = parseInt(document.getElementById("jumpBuff").innerText)+(this.value);
        document.getElementById("jumpBuff").innerHTML = newBuff;
        
    }
}

class goldBuff extends Buff {
    constructor(rarity) {
        super(rarity);
        this.name = "WEALTH BLESSING";
        this.src = "./BuffIcons/goldBuff.png"
        this.rarity = rarity;
        this.value = (5+5*rarity);
        this.text = "Increase Gold Generation by " + this.value + "%.";
    }

    applyBuff() {
        goldEarnBuff += (this.value/100);
        let newBuff = parseInt(document.getElementById("goldBuff").innerText)+(this.value);
        document.getElementById("goldBuff").innerHTML = newBuff;
    }
}

class piercingBuff extends Buff { // Only SSR
    constructor(rarity) {
        super(rarity);
        this.name = "MAGICAL JAVELIN";
        this.src = "./BuffIcons/piercingBuff.png";
        this.rarity = rarity;
        this.value = 1;
        this.text = "Your bullet now can pierce through enemies.";
    }

    applyBuff() {
        piercing = 1;
    }
}

class lightningBuff extends Buff { // Only SSR
    constructor(rarity) {
        super(rarity)
        this.name = "THUNDERSTRIKE";
        this.src = "./BuffIcons/lightningBuff.png";
        this.rarity = rarity;
        this.value = 1;
        this.text = "Your bullet now calls down a thunder strike, dealing " + (playerOriginalATK/2) + " damage to every monsters on its wake.";
    }

    applyBuff() {
        lightning = 1;
    }
}

class amountBuff extends Buff { // Only SSR
    constructor(rarity) {
        super(rarity)
        this.name = "DOUBLE SHOTS";
        this.src = "./BuffIcons/amountBuff.png";
        this.rarity = rarity;
        this.value = 1;
        this.text = "You deal less damage, but shoot 1 more bullet.";
    }

    applyBuff() {
        bulletAmount += 1;
        damageModifier = 0.6;
    }
}

class levelBuff extends Buff { // Only SSR
    constructor(rarity) {
        super(rarity)
        this.name = "MAGUS'S POWER";
        this.src = "./BuffIcons/levelBuff.png";
        this.rarity = rarity;
        this.value = 1;
        this.text = "All of your current Skills temporarily gain 1 level.";
    }

    applyBuff() {
        for (let i = 0; i < skillLevelArray.length; i++) {
            skillLevelArray[i] += 1;
        }
    }
}

class sizeBuff extends Buff { // Only SSR
    constructor(rarity) {
        super(rarity);
        this.name = "GARGANTUAL ENCHANT";
        this.src = "./BuffIcons/sizeBuff.png";
        this.rarity = 3;
        this.value = 1;
        this.text = "Your bullets' sizes are doubled, and they gain damage as well.";
    }

    applyBuff() {
        sizeModifier = 2;
        damageModifier = 1.1;
    }
}


class cooldownBuff extends Buff { // Only SR.
    constructor(rarity) {
        super(rarity);
        this.name = "WIZARDY WISDOM";
        this.src = "./BuffIcons/cdBuff.png";
        this.rarity = 3;
        this.value = 1;
        this.text = "Decrease the cooldown of all skills in half.";
    }

    applyBuff() {
        magusMode = 1;
    }
}


class stunBuff extends Buff { // Only SR.
    constructor(rarity) {
        super(rarity);
        this.name = "CONCUSSION";
        this.src = "./BuffIcons/stunBuff.png";
        this.rarity = 3;
        this.value = 1;
        this.text = "Your bullet have 20% chance to stun enemies for 0.5 second.";
    }

    applyBuff() {
        stunMode = 1;
    }
}

class speedDMGBuff extends Buff { // Only SR.
    constructor(rarity) {
        super(rarity);
        this.name = "DESCENDANT OF THE WIND";
        this.src = "./BuffIcons/speedDMGBuff.png";
        this.rarity = 3;
        this.value = 1;
        this.text = "Your bullet gain damage proportional to your Movement Speed.";
    }

    applyBuff() {
        speedDMGMode = 1;
    }
}

class hpDMGBuff extends Buff { // Only SR.
    constructor(rarity) {
        super(rarity);
        this.name = "DESCENDANT OF THE TITAN";
        this.src = "./BuffIcons/hpDMGBuff.png";
        this.rarity = 3;
        this.value = 1;
        this.text = "Your bullet gain damage proportional to your max Health.";
    }

    applyBuff() {
        hpDMGMode = 1;
    }
}

class statusDMGBuff extends Buff { // Only SR.
    constructor(rarity) {
        super(rarity);
        this.name = "WEAKPOINT EXPOSURE";
        this.src = "./BuffIcons/statusDMGBuff.png";
        this.rarity = 3;
        this.value = 1;
        this.text = "Your bullet deal 30% more damage on enemies that is having status effects.";
    }

    applyBuff() {
        statusDMGMode = 1;
    }
}



let damageBuffC = new damageBuff(0);
let damageBuffR = new damageBuff(1);
let damageBuffSR = new damageBuff(2);

let fireRateBuffC = new fireRateBuff(0);
let fireRateBuffR = new fireRateBuff(1);
let fireRateBuffSR = new fireRateBuff(2);

let healthBuffC = new healthBuff(0);
let healthBuffR = new healthBuff(1);
let healthBuffSR = new healthBuff(2);

let recoveryBuffC = new recoveryBuff(0);
let recoveryBuffR = new recoveryBuff(1);
let recoveryBuffSR = new recoveryBuff(2);

let movementBuffC = new movementBuff(0);
let movementBuffR = new movementBuff(1);
let movementBuffSR = new movementBuff(2);

let goldBuffC = new goldBuff(0);
let goldBuffR  = new goldBuff(1);
let goldBuffSR = new goldBuff(2);

let piercingUR = new piercingBuff(3);
let lightingUR = new lightningBuff(3);
let amountUR = new amountBuff(3);
let levelUR = new levelBuff(3);
let sizeUR = new sizeBuff(3);
let cdUR = new cooldownBuff(3);
let stunUR = new stunBuff(3);
let spdDMGUR = new speedDMGBuff(3);
let hpDMGUR = new hpDMGBuff(3);
let statusDMGUR = new statusDMGBuff(3);

let obtainedUR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let currentUR = [];
let onUR = false;

function generateBuff() {
    SRSpawnChance += 0.35;
    let spawnedCommon = [0, 0, 0, 0, 0, 0];
    let spawnedRare = [0, 0, 0, 0, 0, 0];
    let spawnedSuperRare = [0, 0, 0, 0, 0, 0];

    if (fireRateCapSpeed && fireRate == 10) {
        spawnedCommon[1] = 1;
        spawnedRare[1] = 1;
        spawnedSuperRare[1] = 1;
    } else if (!fireRateCapSpeed && fireRate == 7) {
        spawnedCommon[1] = 1;
        spawnedRare[1] = 1;
        spawnedSuperRare[1] = 1;
    }

    if (ceiling == 280 || gravity == 1) {
        spawnedCommon[4] = 1;
        spawnedRare[4] = 1;
        spawnedSuperRare[4] = 1;
    }

    for (let i = 1; i < 5; i++) {
        let currentBuff = undefined;

        let cardid = "buff" + i;
        let cardName = "card" + i + "Name";
        let cardIcon = "card" + i + "Icon";
        let cardInfo = "card" + i + "Info";
        let cardRarity = "card" + i + "Rarity";
        
        document.getElementById(cardid).className = "";
        document.getElementById(cardid).classList.add("buffCard");

        let buffResult = Math.floor(6*Math.random()); 


        let rarityResult = Math.floor(10*Math.random()); // 0, 1, 2 for rarity.
        if (rarityResult > 8) {
            SRSpawnChance = 0;
        } 

        if (URSpawnChance == 1) {
            onUR = true;
            buffResult = Math.floor(10*Math.random());
            while (obtainedUR[buffResult] > 0) {
                buffResult = Math.floor(10*Math.random());
            }
            currentBuff = URBuffArray[buffResult];
            currentUR.push(buffResult);
            document.getElementById(cardid).classList.add("URBuff");
            document.getElementById(cardRarity).innerHTML = "LEGENDARY";
            URSpawnChance = 0;
            buffResult = Math.floor(6*Math.random());
        } else if (SRSpawnChance > 1) {
            currentBuff = superRareBuffArray[buffResult];
            spawnedSuperRare[buffResult] = 1;
            document.getElementById(cardid).classList.add("SRBuff");
            document.getElementById(cardRarity).innerHTML = "SUPER RARE";
            SRSpawnChance = 0;
        } else {

            if (rarityResult < 6){
                while (spawnedCommon[buffResult] > 0) {
                    buffResult = Math.floor(6*Math.random());
                }
                currentBuff = commonBuffArray[buffResult];
                spawnedCommon[buffResult] = 1;
                document.getElementById(cardid).classList.add("CBuff");
                document.getElementById(cardRarity).innerHTML = "COMMON";
            } else if (rarityResult < 9) {
                while (spawnedRare[buffResult] > 0) {
                    buffResult = Math.floor(6*Math.random());
                }
                currentBuff = rareBuffArray[buffResult];
                spawnedRare[buffResult] = 1;
                document.getElementById(cardid).classList.add("RBuff");
                document.getElementById(cardRarity).innerHTML = "RARE";

            } else if (rarityResult < 10) {
                while (spawnedSuperRare[buffResult] > 0) {
                    buffResult = Math.floor(6*Math.random());
                }
                currentBuff = superRareBuffArray[buffResult];
                spawnedSuperRare[buffResult] = 1;
                document.getElementById(cardid).classList.add("SRBuff");
                document.getElementById(cardRarity).innerHTML = "SUPER RARE";
            }
        }

        currentBuffArray.push(currentBuff);

        //console.log(currentBuff);

        document.getElementById(cardName).innerHTML = currentBuff.name;
        document.getElementById(cardIcon).src = currentBuff.src;
        document.getElementById(cardInfo).innerHTML = currentBuff.text;
    }

    if (rerollAmount == 0) {
        document.getElementById("reroll").style.display = "none";
    } else {
        document.getElementById("reroll").style.display = "block";
        document.getElementById("rerollTimes").innerHTML = rerollAmount;
    }
}

function generateURBuff() {
    
    let spawnedUR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 1; i < 5; i++) {
        let currentBuff = undefined;

        let cardid = "buff" + i;
        let cardName = "card" + i + "Name";
        let cardIcon = "card" + i + "Icon";
        let cardInfo = "card" + i + "Info";
        let cardRarity = "card" + i + "Rarity";
        
        document.getElementById(cardid).className = "";
        document.getElementById(cardid).classList.add("buffCard");

        let buffResult = Math.floor(10*Math.random());

        while (spawnedUR[buffResult] > 0 || obtainedUR[buffResult] > 0) {
            buffResult = Math.floor(10*Math.random());
        }

        currentBuff = URBuffArray[buffResult];
        currentUR.push(buffResult);
        spawnedUR[buffResult] = 1;
        document.getElementById(cardid).classList.add("URBuff");
        document.getElementById(cardRarity).innerHTML = "LEGENDARY";

        currentBuffArray.push(currentBuff);

        //console.log(currentBuff);

        document.getElementById(cardName).innerHTML = currentBuff.name;
        document.getElementById(cardIcon).src = currentBuff.src;
        document.getElementById(cardInfo).innerHTML = currentBuff.text;
    }
        document.getElementById("reroll").style.display = "none";
}


function takeBuffCard(index) {
    document.getElementById("playerRankUp").currentTime = 0;
    document.getElementById("playerRankUp").play();
    document.getElementById("battleMusic").volume = 0.5;
    currentBuffArray[index].applyBuff();
    rerollAmount = originalRerollAmount;

    if (currentBuffArray[index].rarity == 3) {
        obtainedUR[currentUR[index]] = 1;
        if (URMode = 1) {
            URMode = 0;
        }
    }


    document.getElementById("buffScreen").classList.remove("fadeIn");
    document.getElementById("buffScreen").classList.add("fadeOut");

    document.getElementById("buffStats").classList.remove("fadeIn");
    document.getElementById("buffStats").classList.add("fadeOut");
    
    setTimeout(()=> {
        document.getElementById("buffScreen").style.display = "none";
        document.getElementById("buffStats").style.display = "none"

        document.getElementById("resources").style.display = "block";
    }, 270);

    currentBuffArray = [];
    if (onUR) {
        onUR = false;
    }

    isTakingBuff = false;

    pause = false;

    isMovingRight = false;
    isMovingLeft = false;
    usingSkill = false;
    checkGameState();
}

function reroll() {

    document.getElementById("buffScreen").classList.remove("fadeIn");
    document.getElementById("buffScreen").classList.add("fadeOut");

    currentUR = [];

    setTimeout(()=> {
        document.getElementById("buffScreen").classList.remove("fadeOut");
        document.getElementById("buffScreen").classList.add("fadeIn");

        if (rerollAmount > 0) {
            currentBuffArray = [];
            rerollAmount -= 1;
            if (onUR) {
                URSpawnChance = 1;
            }
            generateBuff();
        }
    }, 290);
}

function resetURBuff() {
    obtainedUR = [];
    URMode = 0;
    URSpawnChance = 0;
    SRSpawnChance = 0;
}