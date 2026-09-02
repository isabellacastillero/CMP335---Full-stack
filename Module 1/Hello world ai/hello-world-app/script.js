function greetUser() {
    const nameInput = document.getElementById('name');
    const greetingParagraph = document.getElementById('greeting');
    
    const userName = nameInput.value;
    greetingParagraph.textContent = `Hello, ${userName}!`;
}

document.getElementById('greetButton').addEventListener('click', greetUser);