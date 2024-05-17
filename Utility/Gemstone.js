let gemstoneDataArray = []; // Use to hold metadata about gemstones.

let originalgemstoneLevelArray = []; // THis is the original level array

function loadGemstoneLevel() {
    for (let i = 0; i < 14; i++) {
        originalgemstoneLevelArray[i] = originalPlayerGemstoneLevel[i];
        if (gemstoneDataArray[i] !== undefined) {
            gemstoneDataArray[i].level = originalPlayerGemstoneLevel[i];
            gemstoneDataArray[i].updateValue();
        }
    }
}

class Gemstone {
    constructor (id, rarity) {
        this.name = "";
        this.text = "";
        this.src = "";
        this.id = id;
        this.level = originalPlayerGemstoneLevel[id];
        this.nextLevel = 1;
        this.value = 0;
        this.damage = 0;
        this.health = 0;
        this.shield = 0;
        this.rarity = rarity; // 0 for Common, 1 for Rare, 2 for Super Rare, 3 for Legendary, 4 for Ultimate.
        this.type = 0; // 0 for side gem, 1 for Main Gem, 2 for Main Gem Active.
        gemstoneDataArray.push(this);
    }

    applyGem(target) {} // To be overriden.

    updateValue() {} // To be overriden.
}

//////////////////

class LowAmountGem extends Gemstone {
    constructor() {
        super(0, 0);
        this.name = "GEMSTONE OF BULLET";
        this.value = 0.02+(0.01*this.level);
        this.type = 0;
        this.text = "When firing, you have " + Math.round(this.value*100) + "% chance to shoot another bullet.";
        this.src = "./Gemstone_Icon/GS0.png";
    }

    applyGem() {
        amountGemBuff += this.value;
    }

    updateValue() {
        this.value = 0.02+(0.01*this.level);
        this.text = "When firing, you have " + Math.round(this.value*100) + "% chance to shoot another bullet.";
    }
}

//
class LowPiercingGem extends Gemstone {
    constructor() {
        super(1, 0);
        this.name = "GEMSTONE OF PIERCE";
        this.value = 0.02+(0.01*this.level);
        this.type = 0;
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to pierce enemies.";
        this.src = "./Gemstone_Icon/GS1.png";
    }

    applyGem() {
        piercingGemBuff += this.value;
    }

    updateValue() {
        this.value = 0.02+(0.01*this.level);
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to pierce enemies.";
    }
}

//

class LowCritGem extends Gemstone {
    constructor() {
        super(2, 0);
        this.name = "GEMSTONE OF CRITICAL";
        this.value = 0.01+(0.005*this.level);
        this.type = 0;
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to critically strike for additional damage.";
        this.src = "./Gemstone_Icon/GS2.png";
    }

    applyGem() {
        critGemBuff += this.value;
    }

    updateValue() {
        this.value = 0.01+(0.005*this.level);
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to critically strike for additional damage.";
    }
}

//

class LowGoldGem extends Gemstone {
    constructor() {
        super(3, 0);
        this.name = "GEMSTONE OF WEALTH";
        this.value = 0.01*this.level;
        this.type = 0;
        this.text = "Increase your Gold gain by " + Math.round(this.value*100) + "%.";
        this.src = "./Gemstone_Icon/GS3.png";
    }

    applyGem() {
        goldEarnBuff += this.value;
    }

    updateValue() {
        this.value = 0.01*this.level;
        this.text = "Increase your Gold gain by " + Math.round(this.value*100) + "%.";
    }
}

//

class HighAmountGem extends Gemstone {
    constructor() {
        super(4, 1);
        this.name = "GEMSTONE OF ARTILLERY";
        this.value = 0.04+(0.02*this.level);
        this.type = 0;
        this.text = "When firing, you have " + Math.round(this.value*100) + "% chance to shoot another bullet.";
        this.src = "./Gemstone_Icon/GS4.png";
    }

    applyGem() {
        amountGemBuff += this.value;
    }

    updateValue() {
        this.value = 0.04+(0.02*this.level);
        this.text = "When firing, you have " + Math.round(this.value*100) + "% chance to shoot another bullet.";
    }
}

//
class HighPiercingGem extends Gemstone {
    constructor() {
        super(5, 1);
        this.name = "GEMSTONE OF PENETRATION";
        this.value = 0.04+(0.02*this.level);
        this.type = 0;
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to pierce enemies.";
        this.src = "./Gemstone_Icon/GS5.png";
    }

    applyGem() {
        piercingGemBuff += this.value;
    }

    updateValue() {
        this.value = 0.04+(0.02*this.level);
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to pierce enemies.";
    }
}

//

class HighCritGem extends Gemstone {
    constructor() {
        super(6, 1);
        this.name = "GEMSTONE OF STRIKE";
        this.value = 0.02+(0.01*this.level);
        this.type = 0;
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to critically strike for additional damage.";
        this.src = "./Gemstone_Icon/GS6.png";
    }

    applyGem() {
        critGemBuff += this.value;
    }

    updateValue() {
        this.value = 0.02+(0.01*this.level);
        this.text = "When firing, your bullet have " + Math.round(this.value*100) + "% chance to critically strike for additional damage.";
    }
}

//

class HighGoldGem extends Gemstone {
    constructor() {
        super(7, 1);
        this.name = "GEMSTONE OF PROSPERITY";
        this.value = 0.02*this.level;
        this.type = 0;
        this.text = "Increase your Gold gain by " + Math.round(this.value*100) + "%.";
        this.src = "./Gemstone_Icon/GS7.png";
    }

    applyGem() {
        goldEarnBuff += this.value;
    }

    updateValue() {
        this.value = 0.02*this.level;
        this.text = "Increase your Gold gain by " + Math.round(this.value*100) + "%.";
    }
}

//

class baseRecoveryGem extends Gemstone {
    constructor() {
        super(8, 2);
        this.name = "ENDURANCE GEMSTONE";
        this.value = (0.003*this.level);
        this.type = 1; // Main Gem
        this.text = "Allow your Statue to recover by itself, at " + (this.value*60).toFixed(2) + " Health per second";
        this.src = "./Gemstone_Icon/GS8.png";
    }

    applyGem() {
        statueRecoveryGem += this.value;
    }

    updateValue() {
        this.value = (0.003*this.level);
        this.text = "Allow your Statue to recover by itself, at " + (this.value*60).toFixed(2) + " Health per second";
    }
}

//

class DiamondEarnGem extends Gemstone {
    constructor() {
        super(9, 2);
        this.name = "MINING GEMSTONE";
        this.value = (0.02*this.level);
        this.type = 1; // Main Gem
        this.text = "You earn 1 more Diamond each time you kill a Boss Monster. Additionally, you have " + Math.round(this.value*100) + "% chance to earn 1 Diamond whenever a monster is killed.";
        this.src = "./Gemstone_Icon/GS9.png";
    }

    applyGem() {
        diamondEarnBuff += 1;
        diamondGemBuff += this.value;
    }

    updateValue() {
        this.value = (0.02*this.level);
        this.text = "You earn 1 more Diamond each time you kill a Boss Monster. Additionally, you have " + Math.round(this.value*100) + "% chance to earn 1 Diamond whenever a monster is killed.";
    }
}

//

// 

class RefreshGem extends Gemstone {
    constructor() {
        super(10, 2);
        this.name = "REWIND GEMSTONE";
        this.value = 0;
        this.type = 2; // Main Gem active
        this.text = "ACTIVE ABILITY - REWIND: Immediately clears all of your Skills' cooldown. Upgrading this Gemstone reduce this ability's cooldown.";
        this.src = "./Gemstone_Icon/GS10.png";
    }
    applyGem() {
        originalPlayerSkillLevel[15] = this.level;
    }

    updateValue() {
    }
}

//

class RageGem extends Gemstone {
    constructor() {
        super(11, 3);
        this.name = "RAMPAGING GEMSTONE";
        this.value = 3+(0.5*this.level);
        this.type = 2; // Main Gem active
        this.text = "ACTIVE ABILITY - RAMPAGE: Drastically increase your Fire Rate and Bullet Speed for " + this.value + " seconds. Upgrading this Gemstone reduce this ability's cooldown and increase its effect.";
        this.src = "./Gemstone_Icon/GS11.png";
    }
    applyGem() {
        originalPlayerSkillLevel[16] = this.level;
    }

    updateValue() {
        this.value = 3+(0.5*this.level);
        this.text = "ACTIVE ABILITY - RAMPAGE: Drastically increase your Fire Rate and Bullet Speed for " + this.value + " seconds. Upgrading this Gemstone reduce this ability's cooldown and increase its effect.";
    }
}

//

class TimeStopGem extends Gemstone {
    constructor() {
        super(12, 3);
        this.name = "TIMESTOP GEMSTONE";
        this.value = 150 + 30*this.level;
        this.type = 2; // Main Gem active
        this.text = "ACTIVE ABILITY - TIME STOP: Stun all enemies globally for " + Math.floor(this.value/60) + " seconds. Upgrading this Gemstone reduce this ability's cooldown and increase its effect.";
        this.src = "./Gemstone_Icon/GS12.png";
    }
    applyGem() {
        originalPlayerSkillLevel[17] = this.level;
    }

    updateValue() {
        this.value = 150 + 30*this.level;
        this.text = "ACTIVE ABILITY - TIME STOP: Stun all enemies globally for " + Math.floor(this.value/60) + " seconds. Upgrading this Gemstone reduce this ability's cooldown and increase its effect.";
    }
}

//

class ReaperGem extends Gemstone {
    constructor() {
        super(13, 3);
        this.name = "THE REAPER";
        this.value = 60 + 20*this.level;
        this.type = 2; // Main Gem active
        this.text = "ACTIVE ABILITY - REAPAER: For " + Math.floor(this.value/60) + " seconds, your bullet instanly kill enemy.";
        this.src = "./Gemstone_Icon/GS13.png";
    }
    applyGem() {
        // Create 
    }
}


let lowamntgem = new LowAmountGem();
let lowpgem = new LowPiercingGem();
let lowcrtgem = new LowCritGem();
let lowgldgem = new LowGoldGem();

let highamntgem = new HighAmountGem();
let highpgem = new HighPiercingGem();
let highcrtgem = new HighCritGem();
let highgldgem = new HighGoldGem();

let stsbuff = new baseRecoveryGem();
let dmndearngem = new DiamondEarnGem();
let rewindgem = new RefreshGem();
let ragegem = new RageGem();

let timestopgem = new TimeStopGem();
let reapergem = new ReaperGem();