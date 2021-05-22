let dinos = {
    "dinos": [
        {
            "species": "Triceratops",
            "weight": 13000,
            "height": 114,
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "First discovered in 1889 by Othniel Charles Marsh"
        },
        {
            "species": "Tyrannosaurus Rex",
            "weight": 11905,
            "height": 144,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "The largest known skull measures in at 5 feet long."
        },
        {
            "species": "Anklyosaurus",
            "weight": 10500,
            "height": 55,
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Anklyosaurus survived for approximately 135 million years."
        },
        {
            "species": "Brachiosaurus",
            "weight": 70000,
            "height": "372",
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Jurasic",
            "fact": "An asteroid was named 9954 Brachiosaurus in 1991."
        },
        {
            "species": "Stegosaurus",
            "weight": 11600,
            "height": 79,
            "diet": "herbavor",
            "where": "North America, Europe, Asia",
            "when": "Late Jurasic to Early Cretaceous",
            "fact": "The Stegosaurus had between 17 and 22 seperate places and flat spines."
        },
        {
            "species": "Elasmosaurus",
            "weight": 16000,
            "height": 59,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Elasmosaurus was a marine reptile first discovered in Kansas."
        },
        {
            "species": "Pteranodon",
            "weight": 44,
            "height": 20,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Actually a flying reptile, the Pteranodon is not a dinosaur."
        },
        {
            "species": "Pigeon",
            "weight": 0.5,
            "height": 9,
            "diet": "herbavor",
            "where": "World Wide",
            "when": "Holocene",
            "fact": "All birds are living dinosaurs."
        }
    ]
};
const HUMAN = "human";
const PIGEON = "Pigeon";

const DINOS = "dinos";
let combinedDataStore = {};
let tiles = [];

/**
 * @description  On button click, prepare and display infographic
   @description form submit action
*/
document.getElementById ("comparebtn").addEventListener("click", () => {
    let humanData = (function (dinoCompareForm) {
        /** IIFE to validate form data
         * @description Validate FORM input fields && create human object
         * @return {Object} human object -> which has details from the FORM 
        */
        let errorText = '';
        let humanData = {};

        //check for input values and prepare error message
        for (let i = 0; i < dinoCompareForm.length; i++) {
            if (!dinoCompareForm[i].value) {
                dinoCompareForm[i].classList.add('input-error');
                errorText = dinoCompareForm[i].name + ' field is required.';
                break;
            } else {
                dinoCompareForm[i].classList.remove('input-error');
                humanData[dinoCompareForm[i].id] = dinoCompareForm[i].value;
            }
        }

        //set message if error
        let errorMessageElm = document.getElementById('error-message');
        if (errorText) {
            errorMessageElm.innerHTML = errorText;
            errorMessageElm.classList.remove('hidden');
        } else {
            errorMessageElm.classList.add('hidden');
            return humanData;
        }
    })(document.forms['dino-compare']);

    let dinoData = dinos;
    if (humanData) {
        setallSpeciesStores(dinoData, humanData);
        compareAndCreateDinoTiles();
        addHumanTile();
        removeFormFromSceen();
        addFinalTilesToDOM();
    }
}, false);

/** 
 * @description remove the FORM from screen
 */
let removeFormFromSceen = function () {
    let formElement = document.getElementById("dino-compare");
    formElement.classList.add("hidden");
};

/**
 * @description set store for data
 */
let setallSpeciesStores = function (dinoData, humanData) {
    combinedDataStore.dinos = shuffle(dinoData[DINOS]); //added shuffle to randomize dino tiles
    combinedDataStore.human = {
        name: humanData.name,
        weight: parseInt(humanData.weight),
        height: parseInt(humanData.feet)*12 + parseInt(humanData.inches),
        diet: humanData.diet
    };
};

/**
 * @description Generates Tiles for each Dino in dino.json file.
 */
let compareAndCreateDinoTiles = function(){
    combinedDataStore[DINOS].forEach(function (obj) {
        if (obj.species === PIGEON) {
            let bird = new Bird(obj.weight, obj.height, obj.diet, obj.fact);
            tiles.push(bird);
        } else {
            let dino = new Dino(obj.weight, obj.height, obj.diet, obj.species, obj.fact);
            dino.compareHeight(combinedDataStore.human.height);
            dino.compareWeight(combinedDataStore.human.weight);
            dino.compareDiet(combinedDataStore.human.diet);
            tiles.push(dino);
        }
    });
};

/**
 * @description Represents a Species
 * @constructor
 * @param {string} weight - The weight of the specie
 * @param {string} height - The height of the specie
 * @param {string} diet - The diet of the specie
 * @param {string} species - The classification of the specie
 */
function Species (weight, height, diet, species){
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.species = species;
}

/**
 * @description Represents a Dino extends Species
 * @constructor Same parameter as parent class: Species
 * @param Extra param {string} fact - The fact about the dino
 */
function Dino (weight, height, diet, species, fact) {
    Species.call(this, weight, height, diet, species);
    this.facts = [fact];
}
/**
 * @description Represents a Bird extends Dino
 * @constructor
 */
function Bird (weight, height, diet, fact) {
    Dino.call(this, weight, height, diet, PIGEON, fact);
}
/**
 * @description Represents a Human extends Specie
 * @constructor
 */
function Human (weight, height, diet, name) {
    Species.call(this, weight, height, diet, HUMAN);
    this.name = name;
}

/**
 * @description Compare a Dino height and entered human height from the form
 * @param {int} heightHuman
 */
Dino.prototype.compareHeight = function (heightHuman) {
    let heightFact = "Height: ";
    const HIGHT_LIMIT = 50;
    if (heightHuman > this.height + HIGHT_LIMIT) {
        heightFact += "You are much taller than a " + this.species + " Dino.";
    } else if (heightHuman > this.height) {
        heightFact += "You are taller than a " + this.species + " Dino.";
    } else if (heightHuman === this.height) {
        heightFact += "You and " + this.species + " Dino are equally tall.";
    } else if (heightHuman < this.height + HIGHT_LIMIT) {
        heightFact += "You are much shorter than a " + this.species + " Dino.";
    } else if (heightHuman < this.height) {
        heightFact += "You are shorter than a " + this.species + " Dino.";
    }
    this.facts.push(heightFact);
};

/**
 * @description Compare a Dino weight and entered human weight from the form
 * @param {int} weightHuman
 */
Dino.prototype.compareWeight = function (weightHuman) {
    let weightFact = "Weight: ";
    const WEIGHT_LIMIT = 5000;
    if (weightHuman > this.weight + WEIGHT_LIMIT) {
        weightFact += "You are much heavier than a " + this.species + " Dino.";
    } else if (weightHuman > this.weight) {
        weightFact += "You are heavier than a " + this.species + " Dino.";
    } else if (weightHuman === this.weight) {
        weightFact += "You and " + this.species + " Dino weigh the same";
    } else if (weightHuman < this.weight + WEIGHT_LIMIT) {
        weightFact += "You are much lighter than a " + this.species + " Dino.";
    } else if (weightHuman < this.weight) {
        weightFact += "You are lighter than a " + this.species + " Dino.";
    }
    this.facts.push(weightFact);
};

/**
 * @description Compare a Dino Diet and selected  diet from the form
 * @param {string} dietHuman
 */
Dino.prototype.compareDiet = function (dietHuman) {
    let dietFact = "Diet: ";
    if (dietHuman !== this.diet) {
        dietFact += "You don't eat the same food. You are " + dietHuman + ", while " + this.species + " are " + this.diet + ".";
    } else {
        dietFact += "You and " + this.species + " eat the same food.";
    }
    this.facts.push(dietFact);
};
/**
 * @description Create a human object and insert in to the center tile
 */
let addHumanTile = function(){
    let human = new Human(combinedDataStore.human.weight, combinedDataStore.human.height, combinedDataStore.human.diet, combinedDataStore.human.name);
    tiles.splice(4, 0, human);
};


/**
 * @description Add tiles HTML to DOM
 */
let addFinalTilesToDOM = function () {
    let gridItems = "";
    let gridElement = document.getElementById("grid");
    tiles.forEach(function (item, index) {
        let randomIndex = item.facts && Math.floor(Math.random()*item.facts.length);
        let itemElement = `<div class="grid-item"><img src="images/${item.species}.png" /><h3>${item.name ? item.name : item.species}</h3><br /><br /><br /><br />${getFact(item, randomIndex)}</div>`;
        gridItems += itemElement;
    });
    gridElement.innerHTML = gridItems;

    function getFact(item, randomIndex) {
        return item.facts ? ("<p>• "+ item.facts[randomIndex] + "</p>") : "";
    }
};

/**
 * @description shuffle array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}