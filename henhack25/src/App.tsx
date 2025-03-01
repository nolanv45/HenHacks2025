import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          Welcome to our homepage.
        </p>
        
      </header>
    </div>
  );
}

export default App;

export class Recipe{
  title:string;
  ingredients:string[];
  duration:number;
  description:string;
  constructor(title:string, ingredients:string[], duration:number, description:string){
    this.title=title;
    this.ingredients=ingredients;
    this.duration=duration;
    this.description=description;
  }
}

const Recipes= [new Recipe("Cabbage Chowder", ["cabbage", "onions", "leeks", "salt", "saffron", "chicken stock"],20,   "Take faire Cabochis, pike hem and wassh hem, and parboyle hem; then̄ presse oute the water on̄ a faire borde, choppē hem, and cast hem in a faire potte with goode fressh broth and with Mary-bones, And lette hem boyle; then̄ take faire grate brede, and cast there-to, saferon̄, salt, and lete boyle ynogh, And then̄ serue hit forth."),
new Recipe ]