import React, { JSX, useState } from "react";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import "./AiIntegration.css"; // Create this CSS file
//import { ChatGPT } from './AI'; // Assuming you have a ChatGPT component
 // Create this query function

export function AIIntegrationPage({ userKey }: { userKey: string }): JSX.Element {
  const [ingredients, setIngredients] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [recipeGenerated, setRecipeGenerated] = useState<boolean>(false);

  function updateIngredients(event: React.ChangeEvent<HTMLInputElement>) {
    setIngredients(event.target.value);
  }

  function updateCountry(event: React.ChangeEvent<HTMLInputElement>) {
    setCountry(event.target.value);
  }

  function handleSubmit() {
    setRecipeGenerated(true);
  }

  function goBack() {
    setRecipeGenerated(false);
  }

  return (
    <div className="ai-integration-page">
      <div >
        <h2 className="header">Get a European Recipe!</h2>
        <FormGroup>
          <FormLabel className="text">Enter Your Ingredients:</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            value={ingredients}
            onChange={updateIngredients}
            className="responsebox"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel className="text">Select European Country:</FormLabel>
          <FormControl
            type="text"
            value={country}
            onChange={updateCountry}
            className="responsebox"
          />
        </FormGroup>
        <Button onClick={handleSubmit} className="submitAns">
          Get Recipe
        </Button>
      </div>
      <div >
        <h2 className="recipe">Click For Your Recipe</h2>
        <Button className="submitAns" href="home" >
          Go Back
        </Button>
    
      </div>
    </div>
  );
}