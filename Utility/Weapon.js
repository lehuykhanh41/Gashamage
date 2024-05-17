let weaponDataArray = [];

class Weapon {
    constructor(id, name, atk, fireRate, bulletSpeed, amount, hp, type) {
        this.id = id;
        this.name = name
        this.level = originalPlayerWeaponLevel[id];
        this.atk = atk;
        this.fireRate = fireRate;
        this.bulletSpeed = bulletSpeed;
        this.amount = amount;
        this.hp = hp;
        this.src = "";
        this.text = "";
        this.type = type; // 0 for ranged, 1 for melee.
        weaponDataArray.push(this);
    }

    levelUp(value) {
        this.atk += value;
    }
}

class BasicStaff extends Weapon {
    constructor() {
        super(0, "BASIC STAFF", 20, 30, 15, 1, 0, 0);
        this.src = "./Weapon_Icon/WP0.png";
        this.text = "A well-rounded staff given to any guardian mages who protects the Statues, balanced at every aspects of magic.";
        this.skillUnlockLevel = 8;
        this.skillName = "ARTILLERY";
        this.skillText = "PASSIVE: This staff now fires 2 bullet at the same time.";
    }

    ascend() {
        if (originalPlayerWeaponLevel[this.id] >= this.skillUnlockLevel) {
            bulletAmount += 1;
        } else {
            bulletAmount = originalBulletAmount;
        }
    }
}

class RepeaterStaff extends Weapon {
    constructor() {
        super(1, "THE REPEATER", 10, 15, 15, 1, 0, 0);
        this.src = "./Weapon_Icon/WP1.png";
        this.text = "An augmented staff that utilizes the flow of magic. Although this weapon has low damage, it makes up by its amazing, unbeatable fire speed that can push back even the toughest enemy.";
        this.skillUnlockLevel = 8;
        this.skillName = "OVERRIDE";
        this.skillText = "PASSIVE: Remove the limit of your Fire Rate. You can obtain more Fire Rate blessing.";
    }

    ascend() {
        if (originalPlayerWeaponLevel[this.id] >= this.skillUnlockLevel) {
            fireRateCapSpeed = false;
        } else {
            fireRateCapSpeed = true;
        }
    }
}

class SniperStaff extends Weapon {
    constructor() {
        super(2, "THE LONGRANGER", 60, 90, 25, 1, 0, 0);
        this.src = "./Weapon_Icon/WP2.png";
        this.text = "Originally belongs to the hunter mages, now this staff has been ultilized in battles. Requiring high precision, each shot from this staff hits harder than anything else.";
        this.skillUnlockLevel = 8;
        this.skillName = "RELOADER";
        this.skillText = "PASSIVE: Your shots now fire 2 consecutive bullets."
    }

    ascend() {
        if (originalPlayerWeaponLevel[this.id] >= this.skillUnlockLevel) {
            sniperWeaponBuff = true;
        } else {
            sniperWeaponBuff = false;
        }
    }

}

class AutomaticStaff extends Weapon {
    constructor() {
        super(3, "THE AUTOMATOR", 20, 30, 15, 1, 0, 0);
        this.src = "./Weapon_Icon/WP3.png";
        this.text = "Just being newly developed, but The Automator has quickly proven itself to be one of the most reliable equipments to the guardian mages thanks to its build-in modern automatic firing augmentation.";
        this.skillUnlockLevel = 5;
        this.skillText = "PASSIVE: You automatically fire bullets to enemies. Upgrading the staff improves this ability's Fire Rate."
        this.skillName = "AUTOMATIC SHOTS"
        this.passiveFireRate = 40;
    }

    ascend() {
        this.passiveFireRate -= (this.level*2);
        if (originalPlayerWeaponLevel[this.id] >= this.skillUnlockLevel) {
            automaticShot = true;
        } else {
            automaticShot = false;
        }
    }
}

let basicStaff = new BasicStaff();

let repStaff = new RepeaterStaff();

let sniperStaff = new SniperStaff();

let automateStaff = new AutomaticStaff();

function loadWeaponLevel() {
    for (let i = 0; i < originalPlayerWeaponLevel.length; i++) {
        if (originalPlayerWeaponLevel[i] > 1) {
            weaponDataArray[i].atk = weaponDataArray[i].atk + (originalPlayerWeaponLevel[i] * Math.floor(weaponDataArray[i].atk/10));
        }
    }
}