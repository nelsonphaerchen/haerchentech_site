// script.js

// 1. Define the AngularJS Module
angular.module('TerminalApp', [])
    // 2. Define the Controller
    .controller('TerminalController', TerminalController);

// Inject $sce for safe HTML rendering
TerminalController.$inject = ['$sce'];

function TerminalController($sce) {
    const term = this; 
    
    term.history = [];      
    term.currentCommand = ''; 

    // 3. Define the Content (PAGES) right here!
    const PAGES = {
        'home': 'Welcome to my purely client-side terminal portfolio! Type **help** to see available commands.',
        'about': 'I am a developer focused on JavaScript and web technologies. This site runs entirely in your browser!',
        'github': 'Redirecting to GitHub... <a href="https://github.com/yourusername" target="_blank">Click here to continue.</a>',
        'linkedin': 'Redirecting to LinkedIn... <a href="https://linkedin.com/in/yourusername" target="_blank">Click here to continue.</a>',
        'projects': `
            --- My Key Projects ---
            - **Project Alpha:** A front-end web app using AngularJS.
            - **Project Beta:** A static site built with HTML/CSS.
        `,
    };

    // 4. Generate the Help Menu dynamically
    const helpCommands = Object.keys(PAGES)
        .map(cmd => {
            let description = `[Description for ${cmd}...]`;
            // Simple logic to provide better descriptions
            if (cmd === 'home') description = 'Goes to the main welcome message.';
            if (cmd === 'about') description = 'Displays information about me.';
            if (cmd === 'projects') description = 'Shows a list of key projects.';
            if (cmd === 'github') description = 'Opens my GitHub profile in a new tab.';
            if (cmd === 'linkedin') description = 'Opens my LinkedIn profile in a new tab.';
            
            return `**${cmd}** - ${description}`;
        })
        .join('\n');

    PAGES['help'] = `
        Available Commands:
        -------------------
        ${helpCommands}
        **clear** - Clear the terminal output.
        **help** - Show this help message.
    `;
    // --- End Content Definition ---

    // --- Core Functions ---

    term.printToOutput = function(text, isCommand = false) {
        let formattedText = text;
        
        if (!isCommand) {
            // Replace **text** with <strong>text</strong> and handle newlines
            formattedText = text.trim()
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        
        // Trust the HTML content for rendering links and strong tags
        term.history.push({ 
            text: $sce.trustAsHtml(formattedText), 
            isCommand: isCommand 
        });
        
        // Scroll logic (AngularJS $timeout would be better, but setTimeout is simpler)
        setTimeout(() => {
            const outputElement = document.getElementById('output');
            outputElement.scrollTop = outputElement.scrollHeight;
        }, 0);
    };

    term.handleInput = function() {
        const command = term.currentCommand.toLowerCase().trim();

        // 1. Echo the command back to the terminal
        term.printToOutput(command, true);

        // 2. Handle special commands
        if (command === 'clear') {
            term.history = []; 
        } else if (PAGES[command]) {
            // 3. If the command exists, display its content
            term.printToOutput(PAGES[command]);
        } else if (command) {
            // 4. If the command is not empty and not found
            term.printToOutput(`Error: Command not found: ${command}. Type **help** for a list of commands.`);
        }

        // 5. Clear the input field
        term.currentCommand = ''; 
    };

    // --- Initialization ---
    // Print the welcome message when the controller loads
    term.printToOutput(PAGES['home']); 
}