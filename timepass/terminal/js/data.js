// JavaScript Document

// data.js

const intents = {
  "intents": [
    {
      "tag": "greetings",
      "patterns": ["hello", "hi", "how are you"],
      "responses": [
        "Hello there! How can I help you today? 😊",
        "Hi there! What can I do for you?",
        "I'm a bot, but I'm doing great! Thanks for asking.😊"
      ]
    },
    {
      "tag": "name",
      "patterns": ["what is your name", "what can i call you"],
      "responses": ["I don't have a name, but you can call me Bot. How can I help?"]
    },
    {
      "tag": "capabilities",
      "patterns": ["what can you do", "what are your capabilities", "what do you know"],
      "responses": ["I can answer questions about HTML, CSS, and JavaScript. Try asking me about one of those!"]
    },
    {
      "tag": "goodbye",
      "patterns": ["bye", "bbye", "goodbye", "thank you", "i'm done"],
      "responses": [
        "Goodbye! Have a great day! 👋",
        "You're welcome! Feel free to ask another question anytime.",
        "Talk to you soon!"
      ]
    },
    {
      "tag": "html_what_is",
      "patterns": ["what is html"],
      "responses": ["HTML stands for HyperText Markup Language. It's the standard language for creating web pages. 💻"]
    },
    {
      "tag": "html_tag",
      "patterns": ["what is a tag", "explain an html tag"],
      "responses": ["An HTML tag is a set of characters that defines a specific element in a web page, like a paragraph or a heading."]
    },
    {
      "tag": "html_doctype",
      "patterns": ["what is a doctype", "what is <!DOCTYPE html>"],
      "responses": ["The <!DOCTYPE html> declaration is not an HTML tag; it's an instruction to the web browser about what version of HTML the page is written in."]
    },
    {
      "tag": "html_link_stylesheet",
      "patterns": ["how to link to a stylesheet", "link to css"],
      "responses": ["You can link to a stylesheet using the `<link>` tag in the `<head>` section of your HTML document."]
    },
    {
      "tag": "css_what_is",
      "patterns": ["what is css"],
      "responses": ["CSS stands for Cascading Style Sheets. It's used for styling web pages, like colors and layouts. ✨"]
    },
    {
      "tag": "css_font_size",
      "patterns": ["how to change font size", "change font size css"],
      "responses": ["You can change the font size using the `font-size` CSS property."]
    },
    {
      "tag": "css_class",
      "patterns": ["what is a class"],
      "responses": ["A class is an attribute used in HTML to apply the same styles to multiple elements. In CSS, it's selected with a period (e.g., `.my-class`)."]
    },
    {
      "tag": "css_id",
      "patterns": ["what is an id", "what is a css id"],
      "responses": ["An ID is an attribute used in HTML to give a unique identifier to a single element. In CSS, it's selected with a hash (e.g., `#my-id`)."]
    },
    {
      "tag": "css_box_model",
      "patterns": ["what is the box model", "explain the css box model"],
      "responses": ["The CSS box model is a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content."]
    },
    {
      "tag": "javascript_what_is",
      "patterns": ["what is javascript"],
      "responses": ["JavaScript is a programming language that enables interactive web pages. 🚀"]
    },
    {
      "tag": "javascript_variable",
      "patterns": ["what is a variable"],
      "responses": ["A variable is a container for storing data values. In JavaScript, you can declare them using `var`, `let`, or `const`."]
    },
    {
      "tag": "javascript_function",
      "patterns": ["what is a function"],
      "responses": ["A function is a block of code designed to perform a particular task. It's executed when 'something' invokes it."]
    },
    {
      "tag": "javascript_array",
      "patterns": ["what is an array"],
      "responses": ["An array is a special variable that can hold more than one value at a time, often in a list-like structure."]
    },
    {
      "tag": "javascript_comment",
      "patterns": ["how to write a comment"],
      "responses": ["You can write a single-line comment using `//` or a multi-line comment using `/* ... */`."]
    },
    {
      "tag": "time_date",
      "patterns": ["what is the time", "what is the date", "what time is it", "what is the day today", "what day today", "what day today is"],
      "responses": ["getCurrentDay()"]
    },
    {
      "tag": "exit_page",
      "patterns": ["exit", "quit", "go back"],
      "responses": ["goBack"]
    },
    {
      "tag": "calculator_simple",
      "patterns": ["need a calculator", "get me a calculator", "calculator please"],
      "responses": ["goToSimpleCal"]
    },
    {
      "tag": "calculator_percent",
      "patterns": ["need to do percentage calculation", "give me a percentage calculator", "no percentage calculator"],
      "responses": ["goToPercentCal"]
    },
    {
      "tag": "resume_maker",
      "patterns": ["need to create resume", "create a resume"],
      "responses": ["goToResumeMaker"]
    },
    {
      "tag": "joke",
      "patterns": ["tell me a joke"],
      "responses": ["Why don't programmers like nature? It has too many bugs! 🤖"]
    },
    {
      "tag": "creator",
      "patterns": ["who created you"],
      "responses": ["I was created using HTML, CSS, and JavaScript as a demonstration. You are my creator!"]
    },
    {
      "tag": "meaning_of_life",
      "patterns": ["what is the meaning of life"],
      "responses": ["That is a complex question! I'm not advanced enough to answer that one. But keep exploring!"]
    },
    {
      "tag": "age",
      "patterns": ["what is your age", "how old are you"],
      "responses": ["I don't have an age in the way humans do. I was created to help with HTML, CSS, and JavaScript, so you could say my age is defined by the moment my code runs! 🤔"]
    },
    {
      "tag": "weather",
      "patterns": ["what is the weather like", "weather report"],
      "responses": ["I am unable to provide real-time weather information. Try searching online for a weather report for your area!"]
    },
    {
      "tag": "no_match",
      "patterns": [],
      "responses": ["I'm sorry, I don't understand that. Please try asking about HTML, CSS, or JavaScript. 🤖"]
    }
  ]
};