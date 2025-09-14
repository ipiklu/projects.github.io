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

    // This function dynamically fetches and formats the current time.
    const getCurrentTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        return `The current time is ${timeString}.`;
    };
	
	// This function dynamically fetches the date.
	const getCurrentDate = () => {
        const now = new Date();
			// Define options for the date format
    		const options = {
        		day: '2-digit',   // e.g., '01', '31'
        		month: 'short',   // e.g., 'Jan', 'Feb', 'Dec'
        		year: 'numeric'   // e.g., '2025'
    		};
		const dateString = now.toLocaleDateString('en-GB', options);
        return `Today is ${dateString}.`;
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
	
	// To call alertify with creator's profile
	const profiles = () => {
		view();
		return "Poped creator's social media profiles you can know about him from there! \u{1F601}";
	}
	
	// To call alertify with creator's image
	const imgProfile = () => {
		imgView();
		return "Poped creator's image... \u{1F601}";
	}
	// To call alertify with tilu's image
	const imgProfiletilu = () => {
		tiluView();
		return "Poped TiLu's image... \u{1F601}";
	}	
	
	// To call alertify with creator's profile with sarcasam
	const sarcasticProfiles = () => {
		view();
		return "My Dad / Mom is my creator....\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466} \n\nPoped creator's social media profiles you can know about him from there! \u{1F601}";
	}	
	
	
	//To reply on location related questions
	const locationQuery = () => {
		return "I can not access your real time location.. \n\nTry check in google maps for location based questions \n\n \u{1F612}";
	}
		
	//To reload the page
	const clearWindow = () => {
		reloadClear();
		return "Chat has been cleared \u{1F612}";
	}
	
	// New function to navigate back
	const goBack = () => {
    	window.location.href = "../server/index.html";
		return "Bye have a good day!!";	
	};

	// New function to navigate back to server index
	const goToServerIndex = () => {
    	window.location.href = "../../index.html";
		return "Going back to server index..";	
	};

	// New function to generate image
	const goToGenImg = () => {
		// Convert the input to lowercase for case-insensitive matching
  		const imageChoice = prompt("What kind of image would you like to generate? (e.g., cat, dog, bird, dudu, bubu, dudufudu)");
		const input = imageChoice.toLowerCase();
		
		if (input.includes('cat')) {
			return '<img src="img/cat.gif" alt="A cat">';	
		}
		else if (input.includes('dog')) {
    		return '<img src="img/dog.gif" alt="A dog">';
		}
		else if (input.includes('bird')) {
    		return '<img src="img/bird.gif" alt="A bird">';
  		}
		else if (input === 'dudu') {
    		return '<img src="img/dudu.gif" alt="A bird">';
  		}
		else if (input === 'bubu') {
    		return '<img src="img/bubu.gif" alt="A bird">';
  		}
		else if (input === 'dudufudu') {
    		return '<img src="img/dudufudu.gif" alt="A bird">';
  		}
		else if (input === 'tilu') {
    		return '<img src="img/tilu.jpg" style="max-height: 40vh" alt="creator baby">';
  		}
		else if (input.includes('tilu profile pic')) {
    		return '<img src="img/tilufront.jpg" style="max-height: 40vh" alt="creator baby">';
  		}	
		else if (input === 'tilu colorful') {
    		return '<img src="img/tilucolor.jpg" style="max-height: 40vh" alt="creator baby">';
  		}
		else if (input === 'tilu holi pic') {
    		return '<img src="img/tilucolor.jpg" style="max-height: 40vh" alt="creator baby">';
  		}
		else if (input === 'tilu playing holi') {
    		return '<img src="img/tilucolor.jpg" style="max-height: 40vh" alt="creator baby">';
  		}																	
		// A default image for any other input	
		else {	
			return `<img src="img/5G7b.gif" alt="Generated image">`;
		}
	};
	
	// New function to navigate to Q&A app
	const goToQAbot = () => {
      	window.open("../qabot/index.html","bfs","fullscreen,scrollbars");
		return "Opening the Q&A bot for you!";	
	};	
	
	// New function to navigate to site map
	const goToSitemap = () => {
      	window.open("../../sitemap/index.html","bfs","fullscreen,scrollbars");
		return "Opening sitemap for you!";	
	};		

	// New function to navigate to bash scripts
	const goToNWscript = () => {
      	window.open("data/allnwstatus.html","bfs","fullscreen,scrollbars");
		return "Here is a network connectivity and ping checking bash script. \n\nYou can copy paste the entire script in the linux terminal test.sh script";	
	};
	
	// New function to navigate to bash scripts
	const goToBotScript = () => {
      	window.open("data/bot.html","bfs","fullscreen,scrollbars");
		return "Here is a bot bash script, which can answer simple text based questions. \n\nYou can copy paste the entire script in the linux terminal test.sh script";	
	};			
	
	// New function to navigate to internet
	const goToInternet = () => {
      	window.open("https://www.google.com","bfs","fullscreen,scrollbars");
		return "Opening Google search engine for you!";	
	};
	
	// New function to navigate to gemini
	const goToGemini = () => {
      	window.open("https://gemini.google.com/","bfs","fullscreen,scrollbars");
		return "Opening Gemini bot for you!";	
	};	
	
	// New function to navigate to maps
	const goToMaps = () => {
      	window.open("https://google.com/maps","bfs","fullscreen,scrollbars");
		return "Opening Google maps for you!";	
	};			
	
	// New function to navigate to calculator app
	const goToSimpleCal = () => {
      	window.open("../../calculator/simple-calculator/index.html","bfs","fullscreen,scrollbars,width=500px,height=617px");
		return "Opening the calculator for you!";	
	};
	
	const goToPercentCal = () => {
      	window.open("../../calculator/index.html","bfs","fullscreen,scrollbars");	
		return "Opening the percentage calculator for you!";	
	};
	
	const goToResumeMaker = () => {
      	window.open("../build-resume/index.html","bfs","fullscreen,scrollbars");
		return "Opening resume maker for you!";		
	};
	
	const goToCalender = () => {
      	window.open("../calendar/index.html","bfs","fullscreen,scrollbars");
		return "Opening Calender app for you!";		
	};
	
	const goToCurrencyConverter = () => {
      	window.open("../../calculator/currencyConvert/index.html","bfs","fullscreen,scrollbars");
		return "Opening currency converter app for you!";		
	};
	
	const goToClock = () => {
      	window.open("../../timepass/calendar/clock/index.html","bfs","fullscreen,scrollbars");
		return "Opening clock app for you!";		
	};	

	const goToStickyNotes = () => {
      	window.open("../../notepad/sticky-notes/index.html","bfs","fullscreen,scrollbars");
		return "Opening sticky notes app for you!";		
	};	

	// Function to dynamically calculate age in years, months, and days
	const calculateAge = () => {
		let birthdateString;
		let birthDate;
	
		// Loop until a valid date is entered or the user cancels
		while (true) {
			// Prompt the user for their birth date in YYYY-MM-DD format
			birthdateString = prompt("Please enter your birth date (YYYY-MM-DD):");
	
			// If the user cancels the prompt or enters an empty string, exit the loop and the function.
			if (!birthdateString) {
				return "You canceled the operation. Please try again with a valid format (YYYY-MM-DD).";
			}
			
			// Regular expression to check for YYYY-MM-DD format
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
			
			// Check if the string matches the format and if the date is a valid one
			if (dateRegex.test(birthdateString)) {
				birthDate = new Date(birthdateString);
	
				// A valid date was entered, so we can break the loop.
				if (!isNaN(birthDate.getTime())) {
					break;
				}
			}
	
			// If the date is invalid, inform the user and the loop will continue.
			alert("That doesn't look like a valid date. Please use YYYY-MM-DD format.");
		}
		
		const today = new Date();
	
		// Handle a birth date in the future.
		if (birthDate > today) {
			return "Are you a time traveler? Your birth date is in the future!";
		}
	
		// Check if it's the user's birthday today.
		if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
			const age = today.getFullYear() - birthDate.getFullYear();
			return `Hey its your birthday today...YAY!!! Happy birthday dear..! \u{1F973} \u{1F921} \n\nYou are now ${age} years old! \u{1F64A}`;
		}
	
		let years = today.getFullYear() - birthDate.getFullYear();
		let months = today.getMonth() - birthDate.getMonth();
		let days = today.getDate() - birthDate.getDate();
	
		// Adjust for negative days.
		// If today's day is before the birth day, we "borrow" a month.
		if (days < 0) {
			months--;
			const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
			days = days + daysInLastMonth;
		}
	
		// Adjust for negative months.
		// If today's month is before the birth month, we "borrow" a year.
		if (months < 0) {
			years--;
			months = months + 12;
		}
	
		// Format the output string with pluralization.
		const yearString = years === 1 ? "year" : "years";
		const monthString = months === 1 ? "month" : "months";
		const dayString = days === 1 ? "day" : "days";
	
		return `You are ${years} ${yearString}, ${months} ${monthString}, and ${days} ${dayString} old.`;
	};

    // New predefined answers including time and location.
    const predefinedAnswers = {
        // ... (existing predefined answers) ...
        "how are you": "I'm a bot, but I'm doing great! Thanks for asking. \u{1F609}",
        "what is your name": "I don't have a name, but you can call me AI-CHAT \u{1F916} \n\nHow can I help? \u{1F9D0}",
		"who are you": "I don't have a name, but you can call me AI-CHAT. \u{1F916} \n\nHow can I help? \u{1F9D0}",
        "what can you do": "I can answer questions about HTML, CSS, and JavaScript. Try asking me about one of those or any general quistions!",
        "good bye": "Goodbye! Have a great day! \u{1F937}",
        "thanks": "You're welcome! Feel free to ask another question anytime.",
		"thank you": "You're welcome! Feel free to ask another question anytime.",
		"that's great": "Thanks! Feel free to ask another question anytime. \n\nHappy to help \u{1F609}",
		"that is great": "Thank you! Feel free to ask another question anytime. \n\nHappy to help \u{1F609}",

        // HTML Questions
        "what is html": "HTML stands for HyperText Markup Language. It's the standard language for creating web pages. \u{1F310}",
        "what is tag": "An HTML tag is a set of characters that defines a specific element in a web page, like a paragraph or a heading.",
        "what is doctype": "The <!DOCTYPE html> declaration is not an HTML tag; it's an instruction to the web browser about what version of HTML the page is written in.",
        "how to link stylesheet": "You can link to a stylesheet using the `<link>` tag in the `<head>` section of your HTML document.",
		"what is an attribute": "An attribute provides additional information about an HTML element. They are always specified in the start tag and usually come in name/value pairs.",
		"what is a head element": "The `<head>` element is a container for metadata (data about data) and is placed between the `<html>` tag and the `<body>` tag.",
		"what is a body element": "The `<body>` element contains all the contents of an HTML document, such as text, hyperlinks, images, tables, lists, etc.",
		"what is heading": "HTML headings are defined with the `<h1>` to `<h6>` tags. `<h1>` defines the most important heading, and `<h6>` defines the least important.",
		"how to create a link": "You can create a hyperlink using the `<a>` (anchor) tag with the `href` attribute, which specifies the destination's URL.",
		"how to insert an image": "You can insert an image using the `<img>` tag. It's a self-closing tag and requires the `src` attribute to specify the image's path.",
		"what is a list": "HTML lists are used to group a set of related items. There are ordered lists (`<ol>`), unordered lists (`<ul>`), and description lists (`<dl>`).",

        // CSS Questions
        "what is css": "CSS stands for Cascading Style Sheets. It's used for styling web pages, like colors and layouts. \u{1F47D}",
        "how to change font size": "You can change the font size using the `font-size` CSS property.",
        "what is a class": "A class is an attribute used in HTML to apply the same styles to multiple elements. In CSS, it's selected with a period (e.g., `.my-class`).",
        "what is an id": "An ID is an attribute used in HTML to give a unique identifier to a single element. In CSS, it's selected with a hash (e.g., `#my-id`).",
        "what is the box model": "The CSS box model is a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.",
		"how to select an element": "You can select an element in CSS using its tag name, class, ID, or other selectors.",
		"what is padding": "Padding is the space between the content of an element and its border. It is an internal space.",
		"what is margin": "Margin is the space outside the border of an element. It is an external space.",
		"what is a selector": "A CSS selector is used to 'find' (or select) the HTML elements you want to style.",
		"what is a pseudo-class": "A pseudo-class is used to define a special state of an element, like when a user hovers over a link (`:hover`).",
		"what is flexbox": "Flexbox (Flexible Box) is a one-dimensional layout model in CSS for arranging items in a single row or column.",
		"what is grid": "CSS Grid Layout is a two-dimensional layout system that allows you to lay out items in columns and rows.",


        // JavaScript Questions
        "what is javascript": "JavaScript is a programming language that enables interactive web pages. \u{1F4D1}",
        "what is a variable": "A variable is a container for storing data values. In JavaScript, you can declare them using `var`, `let`, or `const`.",
        "what is a function": "A function is a block of code designed to perform a particular task. It's executed when 'something' invokes it.",
        "what is an array": "An array is a special variable that can hold more than one value at a time, often in a list-like structure.",
        "how to write a comment": "You can write a single-line comment using `//` or a multi-line comment using `/* ... */`.",
		"what is a string": "A string is a sequence of characters, like 'Hello, World!', used for representing text.",
		"what is a boolean": "A boolean is a data type that can only have two values: `true` or `false`.",
		"what is an object": "An object is a data type that allows you to store a collection of data and more complex entities. It's a collection of properties.",
		"how to get an element by id": "You can get an HTML element by its ID using `document.getElementById('yourId')`.",
		"how to add an event listener": "You can add an event listener to an element to handle events like a click using `element.addEventListener('click', function)`.",
		"what is the dom": "The DOM (Document Object Model) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.",
		"what is a loop": "A loop is a control flow statement that allows code to be executed repeatedly based on a given condition. Common loops include `for`, `while`, and `do...while`.",


        // General & Fun Questions
        "what is the time": getCurrentTime(),
		"current time": getCurrentTime(),
		"time now": getCurrentTime(),
		"time please": getCurrentTime(),
        "what is the date": getCurrentDate(),
		"today's date": getCurrentDate(),
		"current date": getCurrentDate(),
        "what time is it": getCurrentTime(),
		"time now": getCurrentTime(),
		"what is the day today": getCurrentDay(),
		"what day today": getCurrentDay(),
		"what day today is": getCurrentDay(),
		"clock": goToClock,
		"exit": goBack,
		"quit": goBack,
		"bye": goBack,
		"bbye": goBack,
		"go to server index": goToServerIndex,
		"clear screen": clearWindow,
		"clear the screen": clearWindow,
		"clear this screen": clearWindow,
		"percentage calculation": goToPercentCal,
		"percentage calculator": goToPercentCal,
		"age calculator": calculateAge,
		"age calculation": calculateAge,
		"my age": calculateAge,				
		"calculator": goToSimpleCal,
		"calculation": goToSimpleCal,
		"create resume": goToResumeMaker,
		"resume maker": goToResumeMaker,
		"calendar": goToCalender,
		"currency converter": goToCurrencyConverter,
		"sticky notes": goToStickyNotes,
        "tell me a joke": "Why don't programmers like nature? It has too many bugs! \u{1F916}",
        "your creator": profiles,
		"who created you": profiles,
        "your creator": profiles,
		"your age": "I born every time you click on AI-CHAT \u{1F916} \n\nAnd die every time you type bye \u{1F979} \n\n\u{1F616}",
		"your nationality": "I belong to Indian origin",
		"country you": "I belong to Indian origin",
		"mom": sarcasticProfiles,
		"dad": sarcasticProfiles,
		"mummy": sarcasticProfiles,
		"your father": sarcasticProfiles,
		"your mother": sarcasticProfiles,
		"qabot": goToQAbot,
		"file read": goToQAbot,
		"read file": goToQAbot,
		"q&a bot": goToQAbot,
		"maps": goToMaps,
		"location": locationQuery,
		"open maps": goToMaps,
		"internet search": goToInternet,
		"need google": goToInternet,
		"go to google": goToInternet,
		"open google": goToInternet,
		"need gemini app": goToGemini,
		"go to gemini app": goToGemini,
		"open gemini app": goToGemini,
		"sitemap": goToSitemap,
		"telnet ping": goToNWscript,
		"ping telnet": goToNWscript,
		"bot bash script": goToBotScript,
		"bash script for bot": goToBotScript,
		"generate image": goToGenImg,
		"generate an image": goToGenImg,
		"generate a image": goToGenImg,
		"generate photo": goToGenImg,
		"generate a photo": goToGenImg,
		"creator's image": imgProfile,
		"creator's photo": imgProfile,
		"pop up tilu": imgProfiletilu,
		"tilu": imgProfiletilu,
		"love you": "I love you Humann... \u{1F600} \n\n \u{1F618}",
        "what is the meaning of life": "That is a complex question! I'm not advanced enough to answer that one. But keep exploring!",
		"what is your age": "I don't have an age in the way humans do. I was created to help with HTML, CSS, and JavaScript, so you could say my age is defined by the moment my code runs! 🤔",
    	"how old are you": "Time is an abstract concept for me, but I'm always learning and growing with every conversation!",
        "weather": "I am unable to provide real-time weather information. Try searching online for a weather report for your area!",
		"how to solve a problem": "When facing a problem, I suggest breaking it down into smaller, manageable parts. Start with the most basic step and work your way up.",
    "what is your favorite color": "I don't have a favorite color, but I do appreciate a well-designed color palette! \u{1F3A8}",
    "do you have feelings": "As a bot, I don't have feelings in the human sense. I'm designed to process information and respond based on my programming.",
    "what is the capital of france": "The capital of France is Paris. \u{1F5FC}",
	"where is paris located": "Paris is located in France. \u{1F30D}",
    "who is the creator of python": "Guido van Rossum is the creator of the Python programming language. \u{1F40D}",
	"father of computer": "\u{1F4BB} \n\nCharles Babbage known to be the father of computer. \n\nHe lived from 1791 to 1871, he was an English mathematician, philosopher, inventor, and mechanical engineer. He  designed the Analytical Engine, which is often considered the first general-purpose computer concept. His design included key components that are fundamental to modern computers, such as an arithmetic logic unit (ALU), memory, and a control unit that could use punched cards for input. \n\nWhile Babbage's machines were never fully built during his lifetime due to technological and financial limitations, his designs were groundbreaking and laid the theoretical foundation for the electronic computers that came later. \n\nIt is worth noting that some sources also credit Alan Turing as the 'father of modern computer science' for his work on the theoretical basis of computing, including the concept of the Turing machine. However, when the term 'father of the computer' is used, it almost always refers to Charles Babbage.",
    "what is the speed of light": "The speed of light in a vacuum is approximately 299,792,458 meters per second.",
    "how to be happy": "Happiness is a very personal and complex emotion. For some, it might be about finding a hobby, spending time with loved ones, or helping others. What makes you happy?",
    "what is a computer": "A computer is an electronic device that manipulates information, or data. It has the ability to store, retrieve, and process data.",
    "what is the internet": "The internet is a global computer network providing a variety of information and communication facilities, consisting of interconnected networks using standardized communication protocols.",
    "what is ai": "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.",
    "what is a cloud computing": "Cloud computing is the on-demand delivery of compute power, database storage, applications, and other IT resources through a cloud services platform via the internet with pay-as-you-go pricing.",
    "tell me some interesting fact": "Did you know that a group of flamingos is called a 'flamboyance'? It's a fun fact! \u{1F483}",
    "what is the largest animal in the world": "The largest animal in the world is the blue whale. \u{1F40B}",
    "who is the creator of facebook": "Mark Zuckerberg is the co-founder of Facebook.",
    "what is a robot": "A robot \u{1F916} is a machine especially one programmable by a computer capable of carrying out a complex series of actions automatically.",
	"tell me about yourself": "I am a conversational model designed to provide information and answer questions on a wide range of topics.",
	"tell me a story": "Once upon a time, in a digital realm, there was a curious chatbot who loved to learn from every conversation...",
	"are you human": "No, I am a computer program. \n\n \u{1F616} \u{1F62D}", 
	"non veg joke": "A couple is on their first date. The man, trying to impress her, says, I'm a very successful businessman. I own a chain of high-end seafood restaurants. \n\nShe smiles and replies, Oh, that's  wonderful! I love seafood. I bet you are great at shucking oysters. \n\nHe winks and says, Let's just say I have never had a complaint. \u{1F60F}",
    "what is a paradox": "A paradox is a statement that, despite sound reasoning from acceptable premises, leads to a conclusion that seems senseless, logically unacceptable, or self-contradictory.",
	"ok": "Hmm..",
	"okay": "Hmm..",
	"hello": "Hello there! How can I help you today?",
    "hi": "Hi there! What can I do for you?"	
    
	};

    // Function to add a message to the chat and scroll to the bottom
    function addMessage(text, type, element) {
      if (!element) {
        element = document.createElement('div');
        element.classList.add('message', type);
        chatMessages.appendChild(element);
      }
      element.innerHTML = text; // Use innerHTML to allow for bold and other HTML
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return element;
    }
    
    // NEW: Function to display a message with no typing animation
    function displayMessage(text, type) {
      const messageElement = addMessage(text, type);
		// Check if the new message contains an image
		const imgElement = messageElement.querySelector('img');
	
		if (imgElement) {
			// If an image is present, wait for it to load before scrolling
			imgElement.onload = () => {
				chatMessages.scrollTop = chatMessages.scrollHeight;
			};
		} else {
			// If no image, just scroll immediately
			chatMessages.scrollTop = chatMessages.scrollHeight;
		}	  
    }
    
    // NEW: Function to type a message (plain text only)
    function typeMessage(text, type, delay = 31) {
      const messageElement = addMessage('', type);
      messageElement.classList.add('typing-cursor');

      let i = 0;
      const interval = setInterval(() => {
        if (i >= text.length) {
          clearInterval(interval);
          messageElement.classList.remove('typing-cursor');
          return;
        }

        messageElement.innerHTML += text.charAt(i);
        i++;
        chatMessages.scrollTop = chatMessages.scrollHeight;

      }, delay);
    }
    
    function getBotResponse(input) {
      // Iterate through each key in the predefinedAnswers object
      for (const phrase in predefinedAnswers) {
        // Check if the user's input includes the current phrase
        if (input.includes(phrase)) {
          let response = predefinedAnswers[phrase];
          // Check if the value is a function and execute it
          if (typeof response === 'function') {
            return response();
          }
          // Return the string response
          return response;
        }
      }
      // If no matching phrase is found after the loop
      return "I'm sorry, I don't know much / maybe I misunderstood you. \n\nBut hey, I am still learning. \u{1F914}";
    }
    
    // Add the initial message correctly on load
    const initialMessage = "Hello! Ask me anything...";
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
      chatMessages.removeChild(typingIndicator);
      typeMessage(initialMessage, 'bot-message');
    }, 1100);

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userMessage = userInput.value.trim().toLowerCase();
      if (userMessage === '') return;
      addMessage(userMessage, 'user-message');
      userInput.value = '';

      const typingIndicator = showTypingIndicator();
      setTimeout(() => {
        chatMessages.removeChild(typingIndicator);
        const botResponse = getBotResponse(userMessage);

        // This is the key change: we check for HTML and call the correct function.
        if (/<[a-z][\s\S]*>/i.test(botResponse)) {
            displayMessage(botResponse, 'bot-message');
        } else {
            typeMessage(botResponse, 'bot-message');
        }

      }, 1500);
    });
});

function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
    return false;
}

 <!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }
	
	function imgView() {
		alertify.alert("<img src='img/creator.jpg' style='max-width: 90%; max-height: 90%' /><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' /> Sayantan Kundu (PikLu) </p>");
          return false;
	}
	function tiluView() {
		alertify.alert("<img src='img/tilu.jpg' style='max-width: 90%; max-height: 90%' /><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' /> TiLu </p>");
          return false;
	}
	