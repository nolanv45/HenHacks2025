import React, { useState } from 'react';
import './App.css';
import { AIIntegrationPage } from './AiIntegration'; // Correct import
import MapComponent from './Map';

function App() {
  // Define the page types
  type page = 'home' | 'Ai Page' | 'Recipe Page' | 'Map Page';
  const [currentPage, setCurrentPage] = useState<page>('home'); // Initialize currentPage state as 'home'

  // Function to change the page to 'Ai Page'
  function goToAiPage(): void {
    setCurrentPage('Ai Page'); // Set the state to 'Ai Page'
  }

  // Function to change the page to 'Map Page'
  function goToMapPage(): void {
    setCurrentPage('Map Page'); // Set the state to 'Map Page'
    console.log("Navigating to Map Page");
  }

  function goToHomePage(): void {
    setCurrentPage('home');
  }

  function checkKeyValidity(event: React.SyntheticEvent<HTMLDivElement, Event>): void {
    const userKey = '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';
    if (!userKey || userKey.length === 0) {
      alert('Invalid API key');
    } else {
      console.log('API key is valid');
    }
  }

  return (
    <div className="App" onLoad={checkKeyValidity}>
      <header className="App-header">
        {currentPage === 'home' && (
          <div className='div1'>
            <audio controls>
          <source src="/Folk Round.mp3" type="audio/mpeg"></source>
          Your browser does not support the audio element.
  </audio>
            <p className='text'>Welcome to our homepage.</p>
            {/* Button for the Ai Page */}
            <button className="ButtonRecipes" onClick={goToAiPage}>
              Click here for a recipe from medieval England!
            </button>
            
            {/* Button for the Map Page */}
            <button className='ButtonMap' onClick={goToMapPage}>
              Click here for a map of diseases in medieval England!
            </button>
          </div>
        )}

        {currentPage === 'Ai Page' && (
         
            <AIIntegrationPage userKey={'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'} goToHomePage={goToHomePage} />
          
        )}

        {currentPage === 'Map Page' && (
         
            <MapComponent goToHomePage={goToHomePage} />
        
        )}
      </header>
    </div>
  );
}

export default App;


// export class Recipe{
//   title:string;
//   ingredients:string[];
//   duration:number;
//   description:string;
//   type:string;
//   origin:string;
//   constructor(title:string, ingredients:string[], duration:number, description:string, type:string, origin:string){
//     this.title=title;
//     this.ingredients=ingredients;
//     this.duration=duration;
//     this.description=description;
//     this.type=type;
//     this.origin=origin;
//   }
// }

// const Recipes= [new Recipe("Cabbage Chowder", ["cabbage", "onions", "leeks", "salt", "saffron", "chicken stock"],20,   "Take faire Cabochis, pike hem and wassh hem, and parboyle hem; then̄ presse oute the water on̄ a faire borde, choppē hem, and cast hem in a faire potte with goode fressh broth and with Mary-bones, And lette hem boyle; then̄ take faire grate brede, and cast there-to, saferon̄, salt, and lete boyle ynogh, And then̄ serue hit forth.", "soup", "England"),
// new Recipe("Bukkenade", ["beef", "parsley", "sage", "hassop", "clove", "mace", "egg", "verjuice", "ginger", "salt", "saffron"], 60, "Vele, kede, or henne in Bokenade. Take Vele, Kyde, or Henne, an boyle hem in fayre Water, or ellys in freysshe brothe, an smyte hem in pecys, an pyke hem clene; an than draw the same brothe thorwe a straynoure,an caste ther-to Percely, Sawge, Ysope, Maces, Clowys, an let boyle tyl the flesshe be y-now; than sette it from the fyre, and a-lye it vp with raw 3olkys of eyroun, and caste ther-to pouder Gyngere, Veriows, Safroun, and Salt, and thanne serue it forth for a gode mete.", "beef", "England"),
// new Recipe("Cruste Rolle", ["flour", "egg", "salt", "saffron", "oil"], 20, "Take floure, water, saffron, sugur, and salt, and make fyne paast þer-of, and faire thyn kakes; and kutte hem like losenges, and fry hem in fyne oile, and serue hem forthe hote in a dissh in lenten tyme.", "bread", "England"),
// new Recipe("Flaune of Almayne", ["currnat", "apple", "cream", "egg", "sugar", "bread", "butter", "cinnamon", "ginger", "salt", "saffron"],60, "A flaune of Almayne. First take raysins of coraunce, or elles other fressh reysins, and gode ripe peres, or elles gode appuls, and pyke oute the cokes of hom, and pare hom, and grinde hom, and the reysins in a clene morter, and do then to hom a lytel swete creme of mylk, and streyne hom thurgh a clene streynour, and take x egges, or as many mo as wol suffice, and bete hom wel togedur, bothe the qwyte and the yolke, and draw hit thurgh a streynour, and grate faire qwyte bred, and do therto a gode quantitie, and more swete crem, and do therto, and do al this togedur; and take saffron, and pouder of ginger, and canel, and do therto, and a lytel salt, and a quantitie of faire swete buttur, and make a faire coffyn, or two, or as many as needes, and bake hom a lytel in an oven, and do this bature in hom, and let bake hom as thow woldes bake flaunes, or crustades, and when thay byn baken ynogh, strawe upon hom pouder of canel, and of qwyte sugur. And this is a gode maner of crustade.", "fruit", "England"),
// new Recipe("Blancmanger", ["chicken", "rice", "water", "sugar", "salt", "ginger", "pepper", "almond milk"], 20, "Take faire Almondes, and blanche hem, And grynde hem with sugour water into faire mylke; and take ryse, and seth. Andwhan they beth wel y-sodde, take hem vppe, and caste hem to the almondes mylke, and lete hem boile togidre til thei be thikk; And thentake the brawne of a Capon, and tese hit small, And caste thereto; and then take Sugur and salt, and caste thereto, and serue hit forthin maner of mortrewes.", "poultry", "France"),
// new Recipe("Gyngerbrede", ["honey", "cinnamon", "pepper", "saffron", "bread crumbs"], 15, "Take a quart of hony, & sethe it, & skeme it clene; take Safroun, pouder Pepir, & þrow þer-on; take gratyd Brede, & make it so chargeaunt þat it wol be y-lechyd; þen take pouder Canelle, & straw þer-on y-now; þen make yt square, lyke as þou wolt leche yt; take when þou lechyst hyt, an caste Box leves a-bouyn, y-stykyd þer-on, on clowys. And 3if þou wolt haue it Red, coloure it with Saunderys y-now.", "dessert", "England"),
// ];
