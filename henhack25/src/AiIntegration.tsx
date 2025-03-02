import React, { JSX, useState } from "react";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import "./AiIntegration.css"; // Create this CSS file
import { GoogleGenerativeAI } from "@google/generative-ai";
//import { ChatGPT } from './AI'; // Assuming you have a ChatGPT component
 // Create this query function

export function AIIntegrationPage({ userKey }: { userKey: string }): JSX.Element {
  const [ingredients, setIngredients] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [recipeGenerated, setRecipeGenerated] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<string>("");

  function updateIngredients(event: React.ChangeEvent<HTMLInputElement>) {
    setIngredients(event.target.value);
  }

  function updateCountry(event: React.ChangeEvent<HTMLInputElement>) {
    setCountry(event.target.value);
  }


  function goBack() {
    setRecipeGenerated(false);
  }
  async function handleSubmit() {
    try {
      const apiKey = "AIzaSyDR-VHD19VDVq_t8ORrz4SCctc5Z_Rc6uQ";
      if (!apiKey) {
        console.error("API key not found in environment variables.");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Generate a recipe from ${country} using the following ingredients: ${ingredients}.`;
  

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      setRecipe(text); // Use the state setter
      setRecipeGenerated(true);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  }
//   <div className="ai-integration-page">
//       <div >
//         <h2 className="header">Get a European Recipe!</h2>
//         <FormGroup>
//           <FormLabel className="text">Enter Your Ingredients:</FormLabel>
//           <FormControl
//             as="textarea"
//             rows={3}
//             value={ingredients}
//             onChange={updateIngredients}
//             className="responsebox"
//           />
//         </FormGroup>
//         <FormGroup>
//           <FormLabel className="text">Select European Country:</FormLabel>
//           <FormControl
//             type="text"
//             value={country}
//             onChange={updateCountry}
//             className="responsebox"
//           />
//         </FormGroup>
//         <Button onClick={handleSubmit} className="submitAns">
//           Get Recipe
//         </Button>
//       </div>
//       <div >
//         <h2 className="recipe">Click For Your Recipe</h2>
//         <Button className="submitAns" href="home" >
//           Go Back
//         </Button>
    
//       </div>
//     </div>
  return (
  <div className="ai-integration-page">
    <div hidden={recipeGenerated}> {/* Add hidden attribute */}
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
    <div hidden={!recipeGenerated}> {/* Add hidden attribute */}
      <h2 className="recipe">Your Recipe</h2>
      <p>{recipe}</p> {/* Display the recipe */}
      <Button onClick={goBack} className="submitAns">
        Go Back
      </Button>
    </div>
  </div>
  );
}

