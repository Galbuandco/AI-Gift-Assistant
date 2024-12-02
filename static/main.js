var operative_mode = "local";


import { GoogleGenerativeAI } from "@google/generative-ai";

function preferences(){
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Choose Model</h2>
      <p>Do you want to use a local model or use Gemini APIs?</p>
      <button id="local-model">Local Model</button>
      <button id="api-model">API Model</button>
      <br>
      <br>
      <a style="font-weight: 600; color: orange; text-shadow: 2px 2px 5px #ffffff; " href="/guide.html" target="_blank">How to choose?🤔 </a>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById('local-model').addEventListener('click', () => {
    // Handle local model selection
    popup.style.display = 'none';
    localStorage.removeItem('geminiApiKey');
  });

  document.getElementById('api-model').addEventListener('click', () => {
    // Handle API model selection
    popup.style.display = 'none';
    const apiKeyPopup = document.createElement('div');
    apiKeyPopup.className = 'popup';
    apiKeyPopup.innerHTML = `
      <div class="popup-content">
        <h2>Enter Gemini API Key</h2>
        <input type="text" id="gemini-api-key" placeholder="API Key">
        <button id="submit-api-key">Submit</button>
        <br>
        <br>
        <label>
          <input type="checkbox" id="save-credentials">
          Save API key for future use
        </label>
      </div>
    `;

    document.body.appendChild(apiKeyPopup);

    document.getElementById('submit-api-key').addEventListener('click', () => {
      const apiKeyInput = document.getElementById('gemini-api-key').value;
      if (apiKeyInput) {
        // Save the API key and proceed
        //localStorage.setItem('geminiApiKey', apiKeyInput);
        operative_mode = apiKeyInput;
        if (document.getElementById('save-credentials').checked) {
          localStorage.setItem('geminiApiKey', apiKeyInput);
        } else {
          localStorage.removeItem('geminiApiKey');
        }
        
        apiKeyPopup.style.display = 'none';
      } else {
        alert('Please enter a valid API key.');
      }
    });
  });

  // Apply styles for the popup
  const style = document.createElement('style');
  style.innerHTML = `
    .popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .popup-content {
      background: antiquewhite;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }
    .popup-content button {
    background-color: #ff9c45;
    color: white;
    border-radius: 10px;
    border-width: 0;
    padding: 10px;
    margin: 10px;
    box-shadow: #0000005b 1px 1px 5px;
    font-size: large;
    }
    #gemini-api-key {
    background-color: antiquewhite;
    border-radius: 10px;
    padding: 5%;
    border-color: #ff9c45;
    border-style: solid;
    box-shadow: #0000005b 1px 1px 5px;
    }
    #save-credentials {
      font-size: 10px;
    }
  `;
  document.head.appendChild(style);
}


window.addEventListener('load', () => {
  const savedApiKey = localStorage.getItem('geminiApiKey');

  if (savedApiKey) {
    operative_mode = savedApiKey;
    return;
  }

  preferences();

});

document.getElementById('settings').addEventListener('click', () => {
  preferences();
});

document.getElementById('gift-form').addEventListener('submit', async (event) => {
    
  if (operative_mode == "local") {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading widget
    const loadingWidget = document.createElement('div');
    loadingWidget.className = 'loading-widget';
    loadingWidget.innerText = 'Thinking how to save your a$$...';
    document.getElementById('gift-suggestion').appendChild(loadingWidget);

    // Remove submit button
    const submitButton = document.querySelector('#submit-button');
    if (submitButton) {
        submitButton.style.display = 'none';
    }

    const session = await ai.languageModel.create();

    const istruzione = `I need help finding a gift. Here are the details of the recipient and the occasion:
            - Recipient Details:
              Relationship: ${data.relationship}
              Age Group: ${data['age-group']}
              Gender: ${data.gender}
              Interests and Hobbies: ${data.interests}
              Occupation: ${data.occupation}
              Lifestyle: ${data.lifestyle}
            - Occasion:
              Type of Event: ${data['event-type']}
            - Additional Details:
              Budget Range: ${data.budget}
              Preferred gift type:  ${data['type']}
            Suggest two personalized and creative gift ideas that match this profile, mind to avoid subscription based products. Include common and unique suggestions, and briefly justify each choice.`;

    const result = await session.prompt(istruzione);

    const formattedResult = result.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    const final = formattedResult.replace(/#.*$/gm, '');

    const formattedResultWithLineBreaks = final.replace(/\n/g, '<br>');

    const formattedResultWithAsterisks = formattedResultWithLineBreaks.replace(/\*/g, '-');    

    console.log(`Result: ${result}`);

 /*    const res = await session.prompt(`Take the following ideas and give me for each idea a product name: "${result}". Make sure it's in the ${data.budget}`); */

    // Remove loading widget
    document.getElementById('gift-suggestion').removeChild(loadingWidget);

    form.style.display = 'none';

    // Apply glass effect to the result container
    const giftSuggestionContainer = document.getElementById('gift-suggestion');
    giftSuggestionContainer.style.background = 'rgba(255, 255, 255, 0.5)';
    giftSuggestionContainer.style.backdropFilter = 'blur(10px)';
    giftSuggestionContainer.style.borderRadius = '10px';
    giftSuggestionContainer.style.padding = '20px';
    giftSuggestionContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    document.getElementById('gift-suggestion').innerHTML = formattedResultWithAsterisks;

  } else {
    const genAI = new GoogleGenerativeAI(operative_mode);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };


    event.preventDefault();

    

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading widget
    const loadingWidget = document.createElement('div');
    loadingWidget.className = 'loading-widget';
    loadingWidget.innerText = 'Thinking how to save your a$$...';
    document.getElementById('gift-suggestion').appendChild(loadingWidget);

    // Remove submit button
    const submitButton = document.querySelector('#submit-button');
    if (submitButton) {
        submitButton.style.display = 'none';
    }

    const istruzione = `I need help finding a gift. Here are the details of the recipient and the occasion:
            - Recipient Details:
              Relationship: ${data.relationship}
              Age Group: ${data['age-group']}
              Gender: ${data.gender}
              Interests and Hobbies: ${data.interests}
              Occupation: ${data.occupation}
              Lifestyle: ${data.lifestyle}
            - Occasion:
              Type of Event: ${data['event-type']}
            - Additional Details:
              Budget Range: ${data.budget}
              Preferred gift type:  ${data['type']}
            Suggest two personalized and creative gift ideas that match this profile, mind to avoid subscription based products. Include common and unique suggestions, and briefly justify each choice.`;

    var res = await run(istruzione, model, generationConfig);

     // Remove loading widget
     document.getElementById('gift-suggestion').removeChild(loadingWidget);

     form.style.display = 'none';
 
     // Apply glass effect to the result container
     const giftSuggestionContainer = document.getElementById('gift-suggestion');
     giftSuggestionContainer.style.background = 'rgba(255, 255, 255, 0.5)';
     giftSuggestionContainer.style.backdropFilter = 'blur(10px)';
     giftSuggestionContainer.style.borderRadius = '10px';
     giftSuggestionContainer.style.padding = '20px';
     giftSuggestionContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

     const formattedResult = res.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

     const final = formattedResult.replace(/#.*$/gm, '');
 
     const formattedResultWithLineBreaks = final.replace(/\n/g, '<br>');
 
     document.getElementById('gift-suggestion').innerHTML = formattedResultWithLineBreaks;
    
  }
});

async function run(input, model, generationConfig) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage(input);
  console.log(result.response.text());
  return result.response.text();
}
