let enemiesData = [];

let NormalMonsterData = {
    name: "SILVERGATOR",
    type: "GROUND MONSTER",
    src: "./Enemies/normalAvatar.png",
    hp: 60,
    atk: 20,
    desc: "With their incredible population size, Silvergators trample every lands they pass through. Being the regular resident of the Outerness, these monsters possess regular physique and no other abilities.",
    speed: "Slow",
    target: "All",
};

enemiesData.push(NormalMonsterData);

let FastMonsterData = {
    name: "DARK LYCAN",
    type: "GROUND MONSTER",
    src: "./Enemies/fastAvatar.png",
    hp: 40,
    atk: 20,
    desc: "Due to their natural thirst towards energy, Dark Lycans arrive from the Outerness with the primary intent to devour every magical creations. Possesing high speed, these wolves totally ignore the mage and rush straight to atttack the Statue.",
    speed: "Fast",
    target: "Statue",
};

enemiesData.push(FastMonsterData);

let TankMonsterData = {
    name: "SOULLESS AMMOR",
    type: "GROUND MONSTER",
    src: "./Enemies/tankAvatar.png",
    hp: 100,
    atk: 0,
    desc: "A special creature created by the Outerness to aid the monsters on their way. Although these monsters does not deal damage, their high health and mobility helps to tank damage for the monsters behind.",
    speed: "Very Fast",
    target: "None",
};

enemiesData.push(TankMonsterData);

let FlyMonsterData = {
    name: "WYVERN",
    type: "AIR MONSTER",
    src: "./Enemies/flyAvatar.png",
    hp: 40,
    atk: 10,
    desc: "Sometimes, dangers come from the sky. Although Wyverns have regular stats, they can fly and attack from above, requiring mages to take them down with precise aiming.",
    speed: "Normal",
    target: "All",
};

enemiesData.push(FlyMonsterData);

let SniperMonsterData = {
    name: "LONG-RANGE WYVERN",
    type: "AIR MONSTER",
    src: "./Enemies/sniperAvatar.png",
    hp: 40,
    atk: 10,
    desc: "In the Wyvern species, some of them can mutate a special ability. Long-range Wyverns are some of those. Possessing very long range (their are off-screen), mages will need to move around to spot where they are.",
    speed: "Slow",
    target: "Player",
};

enemiesData.push(SniperMonsterData);

let bossMonsterData = {
    name: "THE CRYSTAL BEING",
    type: "GROUND MONSTER (ELITE)",
    src: "./Enemies/bossAvatar.png",
    hp: 400,
    atk: 30,
    desc: "One of the largest enemies in the Outerness. Despite their slow movement, Crystal Beings have immense destructive power and incredibly high Health. Taking down these monsters will make your next Blessing be filled with full Legendaries.",
    speed: "Very Slow",
    target: "All",
};

enemiesData.push(bossMonsterData);

function loadMonsterData() {
    for (let i = 0; i < 6; i++) {
        document.getElementById("monster" + i + "display").style.backgroundImage = "url('" + enemiesData[i].src + "')";
    }
}

function displayMonster(index) {

    if (totalMonsterKilled > 200) {
        document.getElementById("monsterCardName").innerHTML = enemiesData[index].name;
        document.getElementById("monsterCardType").innerHTML = enemiesData[index].type;
        document.getElementById("monsterCardsrc").style.backgroundImage = "url('" + enemiesData[index].src + "')";

        document.getElementById("monsterCardInfo").innerHTML = enemiesData[index].desc;

        document.getElementById("monsterHP").innerHTML = enemiesData[index].hp;
        document.getElementById("monsterDamage").innerHTML = enemiesData[index].atk;

        document.getElementById("monsterSpeed").innerHTML = enemiesData[index].speed;

        document.getElementById("monsterTarget").innerHTML = enemiesData[index].target;
    }

}