// JavaScript Document

// Dark mode toggle functionality
const darkModeCheckbox = document.getElementById('darkModeCheckbox');

darkModeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');

    // This function dynamically fetches and formats the current time and date.
    const getCurrentTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
			// Define options for the date format
    		const options = {
        		day: '2-digit',   // e.g., '01', '31'
        		month: 'short',   // e.g., 'Jan', 'Feb', 'Dec'
        		year: 'numeric'   // e.g., '2025'
    		};
		const dateString = now.toLocaleDateString('en-GB', options);
        return `The current time is ${timeString} on ${dateString}.`;
    };
	
	// This function dynamically fetches the current day
	const getCurrentDay = () => {
    	const now = new Date();

    	// Options for the day format
    	const options = {
        	weekday: 'long' // e.g., "Monday", "Tuesday"
    	};

    	// Use toLocaleDateString with the options to get the day name
    	const dayString = now.toLocaleDateString(undefined, options);
    	return `Today is ${dayString}.`;
	};
	
	// Function to display a typing animation
	const showTypingIndicator = () => {
    	const typingIndicator = document.createElement('div');
    	typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    	typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    	chatMessages.appendChild(typingIndicator);
    	chatMessages.scrollTop = chatMessages.scrollHeight;
    	return typingIndicator; // Return the element so we can easily remove it later
	};
	
	// New function to navigate back
	const goBack = () => {
    	window.location.href = "../server/index.html";
	};
	
	// New function to navigate to calculator app
	const goToSimpleCal = () => {
      	window.open("../../calculator/simple-calculator/index.html","bfs","fullscreen,scrollbars,width=500px,height=617px");	
	};
	
	const goToPercentCal = () => {
      	window.open("../../calculator/index.html","bfs","fullscreen,scrollbars");	
	};
	
	const goToResumeMaker = () => {
      	window.open("../build-resume/index.html","bfs","fullscreen,scrollbars");	
	};

    // New predefined answers including time and location.
    const predefinedAnswers = {
        // ... (existing predefined answers) ...
        "hello": "Hello there! How can I help you today? ??",
        "hi": "Hi there! What can I do for you?",
        "how are you": "I'm a bot, but I'm doing great! Thanks for asking.??",
        "what is your name": "I don't have a name, but you can call me Bot. How can I help?",
        "what can you do": "I can answer questions about HTML, CSS, and JavaScript. Try asking me about one of those!",
        "bye": "Goodbye! Have a great day! ??",
        "thank you": "You're welcome! Feel free to ask another question anytime.",

        // HTML Questions
        "what is html": "HTML stands for HyperText Markup Language. It's the standard language for creating web pages. ??",
        "what is a tag": "An HTML tag is a set of characters that defines a specific element in a web page, like a paragraph or a heading.",
        "what is a doctype": "The <!DOCTYPE html> declaration is not an HTML tag; it's an instruction to the web browser about what version of HTML the page is written in.",
        "how to link to a stylesheet": "You can link to a stylesheet using the `<link>` tag in the `<head>` section of your HTML document.",

        // CSS Questions
        "what is css": "CSS stands for Cascading Style Sheets. It's used for styling web pages, like colors and layouts. ??",
        "how to change font size": "You can change the font size using the `font-size` CSS property.",
        "what is a class": "A class is an attribute used in HTML to apply the same styles to multiple elements. In CSS, it's selected with a period (e.g., `.my-class`).",
        "what is an id": "An ID is an attribute used in HTML to give a unique identifier to a single element. In CSS, it's selected with a hash (e.g., `#my-id`).",
        "what is the box model": "The CSS box model is a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.",

        // JavaScript Questions
        "what is javascript": "JavaScript is a programming language that enables interactive web pages. ??",
        "what is a variable": "A variable is a container for storing data values. In JavaScript, you can declare them using `var`, `let`, or `const`.",
        "what is a function": "A function is a block of code designed to perform a particular task. It's executed when 'something' invokes it.",
        "what is an array": "An array is a special variable that can hold more than one value at a time, often in a list-like structure.",
        "how to write a comment": "You can write a single-line comment using `//` or a multi-line comment using `/* ... */`.",

        // General & Fun Questions
        "what is the time": getCurrentTime(),
        "what is the date": getCurrentTime(),
        "what time is it": getCurrentTime(),
		"what is the day today": getCurrentDay(),
		"what day today": getCurrentDay(),
		"what day today is": getCurrentDay(),
		"exit": goBack,
		"quit": goBack,
		"bye": goBack,
		"bbye": goBack,
		"need a calculator": goToSimpleCal,
		"get me a calculator": goToSimpleCal,
		"calculator please": goToSimpleCal,
		"need to do percentage calculation": goToPercentCal,
		"give me a percentage calculator": goToPercentCal,
		"no percentage calculator": goToPercentCal,
		"need to create resume": goToResumeMaker,
        "tell me a joke": "Why don't programmers like nature? It has too many bugs! \u{1F916}",
        "who created you": "I was created using HTML, CSS, and JavaScript as a demonstration. You are my creator!",
        "what is the meaning of life": "That is a complex question! I'm not advanced enough to answer that one. But keep exploring!",
		"what is your age": "I don't have an age in the way humans do. I was created to help with HTML, CSS, and JavaScript, so you could say my age is defined by the moment my code runs! ðŸ¤”",
    	"how old are you": "Time is an abstract concept for me, but I'm always learning and growing with every conversation!",
        "what is the weather like": "I am unable to provide real-time weather information. Try searching online for a weather report for your area!"
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim().toLowerCase();
        if (userMessage === '') return;

        addMessage(userMessage, 'user-message');
            
		// Get the response from your predefinedAnswers object
    	let botResponse = predefinedAnswers[userMessage];

    	// THIS IS THE CRUCIAL PART OF THE FIX
    	// Check if the value is a function
    	if (typeof botResponse === 'function') {
        	// If it's a function, CALL it to get the string it returns
        	botResponse = botResponse();
    	} 
		else if (!botResponse) {
        	// Handle cases where the user's message isn't in your list
        	botResponse = "I'm sorry, I don't understand that question.";
    	}

    	// Now, 'botResponse' will always be a string and can be displayed
    	// ... (code to display the bot's response) ...

    	userInput.value = '';
        
		const typingIndicator = showTypingIndicator();
		
		setTimeout(() => {
			 chatMessages.removeChild(typingIndicator);
            const botResponse = getBotResponse(userMessage.toLowerCase());
            addMessage(botResponse, 'bot-message');
        }, 1500); // Simulate a slight delay for the bot's response
		
		
    });

    function addMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
    }

    function getBotResponse(input) {
        // Find a matching key in our predefined answers
        for (const key in predefinedAnswers) {
            if (input.includes(key)) {
                return predefinedAnswers[key];
            }
        }
        // Return a default response if no match is found
        return "I'm sorry, I don't understand that. Please try asking about HTML, CSS, or JavaScript. ðŸ¤”";
    }
});

function reloadClear() {
  window.localStorage.clear();
  window.location.reload(true);
  return false;
}