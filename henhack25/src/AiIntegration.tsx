import React, { JSX, useState } from "react";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import "./AiIntegration.css"; // Create this CSS file
import { GoogleGenerativeAI } from "@google/generative-ai";
import App from "./App";
import { Loader } from './Loader';
//import { ChatGPT } from './AI'; // Assuming you have a ChatGPT component
 // Create this query function

 interface AIIntegrationPageProps {
  userKey: string;
  goToHomePage: () => void;
}

export function AIIntegrationPage({ userKey, goToHomePage }: AIIntegrationPageProps): JSX.Element {
  const [ingredients, setIngredients] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [recipeGenerated, setRecipeGenerated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // type page = 'home' | 'Ai Page' | 'Recipe Page' | 'Map Page';
  // const [currentPage, setCurrentPage] = useState<page>('Ai Page');
  interface Recipe {
    title: string;
    time: string;
    ingredients: string[];
    instructions: string[];
    macronutrients: {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
    };
  }


  const [recipe, setRecipe] = useState<Recipe | null>(null);






  function updateIngredients(event: React.ChangeEvent<HTMLInputElement>) {
    setIngredients(event.target.value);
  }

  function updateCountry(event: React.ChangeEvent<HTMLInputElement>) {
    setCountry(event.target.value);
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const apiKey = "AIzaSyDR-VHD19VDVq_t8ORrz4SCctc5Z_Rc6uQ";
      if (!apiKey) {
        console.error("API key not found in environment variables.");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Generate a recipe from ${country} using the following ingredients: ${ingredients}.
    Format the response as valid JSON with the following keys:
    {
        "title": "Recipe title",
      "time": "Estimated preparation and cooking time",
      "ingredients": ["List of ingredients with quantities"],
      "instructions": ["Step 1", "Step 2", "Step 3", ...],
      "macronutrients": {
        "calories": "value",
        "protein": "value",
        "carbs": "value",
        "fat": "value"
      }
    }
    Return only the JSON object without extra formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text(); // Await the text response

      // Ensure the response text is valid JSON
      const jsonStartIndex = text.indexOf('{');
      const jsonEndIndex = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStartIndex, jsonEndIndex);

      const recipeData = JSON.parse(jsonString);
  
      setRecipe(recipeData); // Use the state setter
      setRecipeGenerated(true);
    } catch (error) {
        console.error("Error generating recipe:", error);
      } finally {
        setLoading(false); // Stop loading
      }
  }
  return (
    <div className="ai-integration-page">
        {loading && <Loader />}
    {!loading && !recipeGenerated ? (
      <div>
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
        <p className="recipe-time"><strong>Time:</strong> {recipe?.time}</p>
        </FormGroup>
        <Button onClick={handleSubmit} className="submitAns">
          Get Recipe
        </Button>
      </div>
    ) : (
      <div className="recipe-container">
        <h2 className="recipe-title"><strong>{recipe?.title}</strong></h2>
        
        {recipe && <p className="recipe-time"><strong>Time:</strong> {recipe.time}</p>}
        
        <h3>Ingredients</h3>
        <ul className="recipe-ingredients">
          {recipe?.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
  
        <h3>Instructions</h3>
        <ol className="recipe-instructions">
          {recipe?.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
  
        <h3>Macronutrients</h3>
        <ul className="recipe-macronutrients">
          <li><strong>Calories:</strong> {recipe?.macronutrients.calories}</li>
          <li><strong>Protein:</strong> {recipe?.macronutrients.protein}</li>
          <li><strong>Carbs:</strong> {recipe?.macronutrients.carbs}</li>
          <li><strong>Fat:</strong> {recipe?.macronutrients.fat}</li>
        </ul>
  
        <Button onClick={goToHomePage} className="submitAns">
          Go Home
        </Button>
      </div>
    )}
  </div>
  );
}

