// public/script.js
const output = document.getElementById('output');
const input = document.getElementById('command-input');

// --- Content Data ---
const PAGES = {
    // The key is the command the user types
    'home': 'Welcome to my terminal portfolio! Type **help** to see available commands.',
    'about': 'I am an Infrastructure Engineer. This is a demo of a terminal-style website created using AI (Gemini)!',
    'help': `
        Available Commands:
        -------------------
        **home** - Go to the main welcome page.
        **about** - Learn more about me.
        **github** - Link to my GitHub profile.
        **linkedin** - Link to my LinkedIn profile.
        **clear** - Clear the terminal output.
        **help** - Show this help message.
    `,
    'github': 'Redirecting to GitHub... <a href="https://github.com/nelsonphaerchen" target="_blank">Click here to continue.</a>',
    'linkedin': 'Redirecting to LinkedIn... <a href="https://linkedin.com/in/nelsonphaerchen" target="_blank">Click here to continue.</a>',
    // ADD NEW COMMANDS HERE
};

// --- Terminal Functions ---

// Function to print text to the output area
function printToOutput(text, isCommand = false) {
    // 1. Create a new line (div)
    const newLine = document.createElement('div');
    
    // 2. Prepend the prompt if it was a user command
    if (isCommand) {
        newLine.innerHTML = `<span id="prompt">$</span> ${text}`;
    } else {
        // Simple text, replace **text** with <strong>text</strong>
        const formattedText = text.trim()
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        newLine.innerHTML = formattedText;
    }
    
    // 3. Append to the output and scroll to the bottom
    output.appendChild(newLine);
    output.scrollTop = output.scrollHeight;
}

// Function to handle the command
function handleCommand(command) {
    const lowerCommand = command.toLowerCase().trim();

    // 1. Echo the command back to the terminal
    printToOutput(lowerCommand, true);

    // 2. Handle special commands
    if (lowerCommand === 'clear') {
        output.innerHTML = ''; // Clear the output div
    } else if (PAGES[lowerCommand]) {
        // 3. If the command exists, display its content
        printToOutput(PAGES[lowerCommand]);
    } else if (lowerCommand) {
        // 4. If the command is not empty and not found
        printToOutput(`Error: Command not found: ${lowerCommand}. Type **help** for a list of commands.`);
    }

    // 5. Always clear the input field
    input.value = '';
}

// --- Event Listener ---

// Listen for the 'Enter' key press on the input field
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleCommand(input.value);
    }
});

// --- Initial Message ---
printToOutput(PAGES['home']); // Print the welcome message on load