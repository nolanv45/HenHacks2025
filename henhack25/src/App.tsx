import React, { useState } from 'react';
import './App.css';
import { AIIntegrationPage } from './AiIntegration'; 
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
            <p className='text'>Welcome to Ye Ole Cookbook!.</p>
            {/* Button for the Ai Page */}
            <button className="ButtonRecipes" onClick={goToAiPage}>
              Click here for a recipe from medieval Europe!
            </button>
            
            {/* Button for the Map Page */}
            <button className='ButtonMap' onClick={goToMapPage}>
              Click here for a map of food in medieval Europe!
            </button>
          </div>
        )}

        {currentPage === 'Ai Page' && (
          <div>
            <AIIntegrationPage 
              userKey={'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'} 
              goToHomePage={() => setCurrentPage('home')}
            />
          </div>
        )}

        {currentPage === 'Map Page' && (
          <div>
            <MapComponent goToHomePage={() => setCurrentPage('home')}/>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;



