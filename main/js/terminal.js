class TerminalAnimation {
  constructor() {
    this.terminal = document.querySelector('.terminal');
    this.currentLine = 0;
    this.isTyping = false;
    this.isSkipped = false;

    this.script = [
      {
        type: 'command',
        text: '> _',
        delay: 800
      },
      {
        type: 'command',
        text: 'npm install',
        delay: 400,
        callback: () => this.showInstallAnimation()
      },
      {
        type: 'command',
        text: 'npm run build',
        delay: 800,
        callback: () => this.showBuildAnimation()
      },
      {
        type: 'error',
        text: 'ERROR: Build failed.',
        delay: 800
      },
      {
        type: 'error',
        text: 'Reason: Developer went for coffee...',
        delay: 1600
      },
      {
        type: 'final',
        text: '>> Site still under construction.',
        delay: 800
      },
      {
        type: 'help',
        text: 'Available commands: me, coding, library, stars',
        delay: 400
      },
      {
        type: 'interactive',
        text: 'Type a command to navigate:',
        delay: 400
      }
    ];

    this.init();
  }

  init() {
    this.terminal.innerHTML = '';
    this.setupSkipButton();
    this.runScript();
  }

  setupSkipButton() {
    const skipButton = document.getElementById('skipButton');
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        this.skipToInteractive();
      });
    }
  }

  skipToInteractive() {
    this.isSkipped = true;
    this.terminal.innerHTML = '';

    // Show the final messages quickly
    const messages = [
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ > _',
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ npm install',
      '<span class="gray">Installing dependencies...</span>',
      '<div class="progress-container"><div class="progress-bar"><div class="progress-fill" style="width: 100%"></div></div><span class="progress-text">100%</span></div>',
      '<span class="green">✓ Dependencies installed successfully</span>',
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ npm run build',
      '<span class="gray">Building project...</span>',
      '<div class="progress-container"><div class="progress-bar"><div class="progress-fill failed" style="width: 47%"></div></div><span class="progress-text">47%</span></div>',
      '<span class="red">ERROR: Build failed.</span>',
      '<span class="red">Reason: Developer went for coffee...</span>',
      '<span class="gray">>> Site still under construction.</span>',
      '<span class="command-help">Available commands: me, coding, library, stars</span>',
      '<span class="gray">Type a command to navigate:</span>'
    ];

    messages.forEach((message, index) => {
      setTimeout(() => {
        const line = this.createLine();
        line.innerHTML = message;

        if (index === messages.length - 1) {
          // Enable interactive mode after last message
          setTimeout(() => {
            this.enableInteractiveMode();
            // Hide skip button
            const skipButton = document.getElementById('skipButton');
            if (skipButton) {
              skipButton.classList.add('hidden');
            }
          }, 200);
        }
      }, index * 100);
    });
  }

  async runScript() {
    if (this.isSkipped) return;

    for (let i = 0; i < this.script.length; i++) {
      if (this.isSkipped) return; // Stop if skipped during execution

      const command = this.script[i];
      await this.executeCommand(command);
      await this.delay(command.delay);
    }
  }

  executeCommand(command) {
    return new Promise(async (resolve) => {
      const line = this.createLine();

      if (command.type === 'command') {
        line.innerHTML = '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ ';
        this.typeText(line, command.text, async () => {
          if (command.callback) {
            await command.callback(); // Wait for callback to complete
          }
          resolve();
        });
      } else if (command.type === 'error') {
        line.innerHTML = `<span class="red">${command.text}</span>`;
        resolve();
      } else if (command.type === 'final') {
        line.innerHTML = `<span class="gray">${command.text}</span>`;
        resolve();
      } else if (command.type === 'help') {
        line.innerHTML = `<span class="command-help">${command.text}</span>`;
        resolve();
      } else if (command.type === 'interactive') {
        line.innerHTML = `<span class="gray">${command.text}</span>`;
        setTimeout(() => {
          this.enableInteractiveMode();
          // Hide skip button when interactive mode starts
          const skipButton = document.getElementById('skipButton');
          if (skipButton) {
            skipButton.classList.add('hidden');
          }
          resolve();
        }, 200);
      }
    });
  }

  createLine() {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    this.terminal.appendChild(line);
    this.scrollToBottom();
    return line;
  }

  typeText(element, text, callback) {
    this.isTyping = true;
    let i = 0;
    const speed = 64 + Math.random() * 32; // 20% faster (was 80 + 40)

    const type = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed + Math.random() * 16); // 20% faster (was 20)
      } else {
        this.isTyping = false;
        callback();
      }
    };

    type();
  }

  showInstallAnimation() {
    return new Promise((resolve) => {
      const line = this.createLine();
      line.innerHTML = '<span class="gray">Installing dependencies...</span>';

      setTimeout(() => {
        const progressLine = this.createLine();
        const progressBar = this.createProgressBar();
        progressLine.appendChild(progressBar.container);

        this.animateProgress(progressBar.fill, 100, 1600, () => { // 20% faster (was 2000)
          // Wait a bit after progress completes, then show success message
          setTimeout(() => {
            const successLine = this.createLine();
            successLine.innerHTML = '<span class="green">✓ Dependencies installed successfully</span>';
            resolve();
          }, 240); // 20% faster (was 300)
        });
      }, 300);
    });
  }

  showBuildAnimation() {
    return new Promise((resolve) => {
      const line = this.createLine();
      line.innerHTML = '<span class="gray">Building project...</span>';

      setTimeout(() => {
        const progressLine = this.createLine();
        const progressBar = this.createProgressBar();
        progressLine.appendChild(progressBar.container);

        // Build fails at 47%
        this.animateProgress(progressBar.fill, 47, 1200, () => { // 20% faster (was 1500)
          // Change progress bar to red when it fails
          setTimeout(() => {
            progressBar.fill.classList.add('failed');
            resolve();
          }, 400); // 20% faster (was 500)
        });
      }, 300);
    });
  }

  createProgressBar() {
    const container = document.createElement('div');
    container.className = 'progress-container';

    const bar = document.createElement('div');
    bar.className = 'progress-bar';

    const fill = document.createElement('div');
    fill.className = 'progress-fill';

    const text = document.createElement('span');
    text.className = 'progress-text';
    text.textContent = '0%';

    bar.appendChild(fill);
    container.appendChild(bar);
    container.appendChild(text);

    return { container, fill, text };
  }

  animateProgress(fillElement, targetPercent, duration, callback) {
    const startTime = Date.now();
    const progressContainer = fillElement.parentElement.parentElement;
    const progressText = progressContainer.querySelector('.progress-text');

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = Math.floor(targetPercent * progress);

      fillElement.style.width = currentPercent + '%';
      progressText.textContent = currentPercent + '%';

      // Add realistic download-style blocks
      if (currentPercent < targetPercent) {
        // Add some randomness to make it feel more realistic
        if (Math.random() > 0.7) {
          setTimeout(animate, 40 + Math.random() * 80); // 20% faster
        } else {
          setTimeout(animate, 16); // 20% faster
        }
      } else {
        callback();
      }
    };

    animate();
  }

  scrollToBottom() {
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  enableInteractiveMode() {
    const inputLine = this.createLine();
    inputLine.className = 'input-line';
    inputLine.innerHTML = '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ ';

    const input = document.createElement('input');
    input.className = 'terminal-input';
    input.type = 'text';
    input.placeholder = ' enter command...';

    inputLine.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = input.value.trim().toLowerCase();
        this.handleUserCommand(command, inputLine);
      }
    });
  }

  handleUserCommand(command, inputLine) {
    // Remove the input field and show the command
    inputLine.innerHTML = `<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ ${command}`;

    const commands = {
      'me': '/contact-me/index.html',
      'coding': 'https://projects.zitti.ro',
      'library': '/book-library/index.html',
      'stars': '/star-map/index.html'
    };

    if (commands[command]) {
      const responseLine = this.createLine();
      responseLine.innerHTML = `<span class="green">Navigating to ${command}...</span>`;

      setTimeout(() => {
        window.location.href = commands[command];
      }, 1000);
    } else {
      const errorLine = this.createLine();
      errorLine.innerHTML = `<span class="red">Command not found: ${command}</span>`;

      const helpLine = this.createLine();
      helpLine.innerHTML = `<span class="gray">Available commands: me, coding, library, stars</span>`;

      // Re-enable input after error
      setTimeout(() => {
        this.enableInteractiveMode();
      }, 1000);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure everything is loaded
  setTimeout(() => {
    new TerminalAnimation();
  }, 500);
});