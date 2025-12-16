class TerminalAnimation {
  constructor() {
    this.terminal = document.querySelector('.terminal');
    this.currentLine = 0;
    this.isTyping = false;
    this.isSkipped = false;
    this.userContext = null;

    // Gather user context first (PHASE 1)
    this.userContext = this.gatherUserContext();

    this.script = [
      {
        type: 'command',
        text: '> _',
        delay: 500
      },
      {
        type: 'command',
        text: 'npm install',
        delay: 300,
        callback: () => this.showInstallAnimation()
      },
      {
        type: 'command',
        text: 'npm run deploy',
        delay: 500,
        callback: () => this.showDeployAnimation()
      }
    ];

    this.init();
  }

  // PHASE 1: Context Collection System
  gatherUserContext() {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // Get time slot
    let timeSlot = 'morning';
    if (hour >= 0 && hour < 6) timeSlot = 'late-night';
    else if (hour >= 6 && hour < 9) timeSlot = 'early-morning';
    else if (hour >= 9 && hour < 12) timeSlot = 'morning';
    else if (hour >= 12 && hour < 17) timeSlot = 'afternoon';
    else if (hour >= 17 && hour < 21) timeSlot = 'evening';
    else if (hour >= 21) timeSlot = 'night';

    // Get device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // Get OS
    let os = 'Unknown';
    if (navigator.userAgent.indexOf('Win') !== -1) os = 'Windows';
    else if (navigator.userAgent.indexOf('Mac') !== -1) os = 'MacOS';
    else if (navigator.userAgent.indexOf('Linux') !== -1) os = 'Linux';
    else if (navigator.userAgent.indexOf('Android') !== -1) os = 'Android';
    else if (navigator.userAgent.indexOf('iOS') !== -1) os = 'iOS';

    // Get browser
    let browser = 'Unknown';
    if (navigator.userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
    else if (navigator.userAgent.indexOf('Safari') !== -1) browser = 'Safari';
    else if (navigator.userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (navigator.userAgent.indexOf('Edge') !== -1) browser = 'Edge';

    // Get visit data from localStorage
    const visitData = this.getVisitData();

    return {
      hour,
      timeSlot,
      dayOfWeek,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      deviceType,
      os,
      browser,
      visitCount: visitData.count,
      isFirstVisit: visitData.isFirst,
      lastVisit: visitData.last
    };
  }

  getVisitData() {
    const STORAGE_KEY = 'azitti_visit_data';
    let data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      // First visit
      const newData = {
        count: 1,
        isFirst: true,
        last: new Date().toISOString(),
        first: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    } else {
      // Returning visitor
      data = JSON.parse(data);
      data.count += 1;
      data.isFirst = false;
      data.last = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  }

  // PHASE 2: Personalized Message Generator
  generatePersonalizedGreeting() {
    const ctx = this.userContext;

    // Message arrays
    const timeMessages = {
      'early-morning': [
        "Early bird catches the worm! ☀️",
        "Good morning, bright and early!",
        "Rise and shine! The day awaits."
      ],
      'morning': [
        "Good morning! Ready to explore?",
        "Morning! Coffee and code time.",
        "A fresh morning start! ☕"
      ],
      'afternoon': [
        "Good afternoon! Hope your day's going well.",
        "Afternoon vibes! Time to browse.",
        "Perfect afternoon for some exploration."
      ],
      'evening': [
        "Good evening! Winding down?",
        "Evening! Perfect time to explore.",
        "Welcome this fine evening! 🌆"
      ],
      'night': [
        "Burning the midnight oil? 🌙",
        "Good night! Late browsing session?",
        "Night owl detected! Welcome."
      ],
      'late-night': [
        "Wow, it's late! Hope you're okay! 🦉",
        "3 AM thoughts brought you here?",
        "Late night coding session? Same."
      ]
    };

    const visitMessages = {
      first: [
        "Welcome! First time here?",
        "Hey there, newcomer! 👋",
        "First visit! Great to meet you."
      ],
      returning: [
        "Welcome back! Good to see you again.",
        "Oh hey, you're back! 😊",
        "Returning visitor! Thanks for coming back."
      ],
      frequent: [
        "A familiar face! Welcome back, friend! ⭐",
        "Frequent visitor! You're practically family now.",
        `Visit #${ctx.visitCount}! I appreciate your loyalty! 🎉`
      ]
    };

    // Device messages based on OS and visit count
    const getDeviceMessage = () => {
      const os = ctx.os;
      const isMobile = ctx.deviceType === 'mobile';
      const visitCount = ctx.visitCount;

      if (isMobile) {
        // Mobile messages
        if (os === 'iOS') {
          const iosMessages = [
            "On mobile? Bold move!",
            "Tapping away on iOS",
            "iPhone user spotted! 📱"
          ];
          return this.randomPick(iosMessages);
        } else if (os === 'Android') {
          const androidMessages = [
            "On mobile? Bold move!",
            "Tapping away on Android",
            "Android user in the house! 🤖"
          ];
          return this.randomPick(androidMessages);
        } else {
          return "On mobile? Bold move!";
        }
      } else {
        // Desktop messages with visit integration
        if (os === 'MacOS') {
          if (ctx.isFirstVisit) {
            const macFirstVisit = [
              "Welcome! First time on a Mac (or just here)?",
              "Nice Mac you got there!",
              "Spotted: MacOS in the wild"
            ];
            return this.randomPick(macFirstVisit);
          } else if (visitCount >= 10) {
            const macFrequent = [
              `Double digits! Thanks for #${visitCount}! 🎉 (Mac user)`,
              `Visit #${visitCount} from a Mac - legendary!`,
              `${visitCount} visits! You're a Mac-wielding legend! 🍎`
            ];
            return this.randomPick(macFrequent);
          } else if (visitCount >= 5) {
            const macRegular = [
              `${visitCount}th visit! You're becoming a regular! (via Mac)`,
              "MacOS crew represent!",
              "Fellow Mac user! 🍎"
            ];
            return this.randomPick(macRegular);
          } else {
            const macReturning = [
              "Fellow Mac user! 🍎",
              "Nice Mac you got there!",
              "MacOS crew represent!",
              "Spotted: MacOS in the wild"
            ];
            return this.randomPick(macReturning);
          }
        } else if (os === 'Windows') {
          if (ctx.isFirstVisit) {
            return "Welcome! Windows warrior detected";
          } else if (visitCount >= 10) {
            return `Visit #${visitCount}! PC master race! 💪`;
          } else if (visitCount >= 5) {
            return `${visitCount} visits from a Windows warrior!`;
          } else {
            const windowsMessages = [
              "Windows warrior detected",
              "PC master race!",
              "Windows user in the wild! 🪟"
            ];
            return this.randomPick(windowsMessages);
          }
        } else if (os === 'Linux') {
          if (ctx.isFirstVisit) {
            return "Welcome! Ah, a Linux user! Respect.";
          } else if (visitCount >= 10) {
            return `Visit #${visitCount}! Linux legend! 🐧`;
          } else if (visitCount >= 5) {
            return `${visitCount} visits! Linux gang! 🐧`;
          } else {
            const linuxMessages = [
              "Ah, a Linux user! Respect.",
              "Linux gang! 🐧",
              "Open source warrior detected! 🐧"
            ];
            return this.randomPick(linuxMessages);
          }
        } else {
          return `Running on ${os}`;
        }
      }
    };

    const deviceInfo = getDeviceMessage();

    // Priority-based selection
    let greeting = '';

    // 1. Visit status (highest priority)
    if (ctx.isFirstVisit) {
      greeting = this.randomPick(visitMessages.first);
    } else if (ctx.visitCount >= 5) {
      greeting = this.randomPick(visitMessages.frequent);
    } else {
      greeting = this.randomPick(visitMessages.returning);
    }

    // 2. Time context
    const timeGreeting = this.randomPick(timeMessages[ctx.timeSlot]);

    // Combine naturally
    return {
      main: greeting,
      time: timeGreeting,
      device: deviceInfo,
      day: ctx.dayName
    };
  }

  randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  init() {
    this.terminal.innerHTML = '';
    this.setupSkipButton();

    // Check if animation has already played this session
    const hasPlayedThisSession = sessionStorage.getItem('azitti_animation_played');

    if (hasPlayedThisSession) {
      // Skip directly to greeting and cards
      this.skipToEnd();
    } else {
      // Play full animation
      this.runScript();
      // Mark animation as played for this session
      sessionStorage.setItem('azitti_animation_played', 'true');
    }
  }

  skipToEnd() {
    // Show minimal terminal history and go straight to cards
    const messages = [
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ > _',
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ npm install',
      '<span class="green">✓ Dependencies installed successfully</span>',
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ npm run deploy',
      '<span class="green">✓ Deployed successfully</span>'
    ];

    messages.forEach((message) => {
      const line = this.createLine();
      line.innerHTML = message;
    });

    // Show greeting and cards immediately
    setTimeout(() => {
      this.showGreetingAndCards();
      const skipButton = document.getElementById('skipButton');
      if (skipButton) {
        skipButton.classList.add('hidden');
      }
    }, 100);
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

    // PHASE 6: Skip straight to greeting and cards (no animation, no build)
    const messages = [
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ > _',
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ npm install',
      '<span class="gray">Installing dependencies...</span>',
      '<div class="progress-container"><div class="progress-bar"><div class="progress-fill" style="width: 100%"></div></div><span class="progress-text">100%</span></div>',
      '<span class="green">✓ Dependencies installed successfully</span>',
      '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ npm run deploy',
      '<span class="gray">Deploying to production...</span>',
      '<div class="progress-container"><div class="progress-bar"><div class="progress-fill" style="width: 100%"></div></div><span class="progress-text">100%</span></div>',
      '<span class="green">✓ Deployed successfully</span>'
    ];

    messages.forEach((message, index) => {
      setTimeout(() => {
        const line = this.createLine();
        line.innerHTML = message;

        if (index === messages.length - 1) {
          // Show greeting and cards after last message (no GSAP animation when skipped)
          setTimeout(() => {
            this.showGreetingAndCards();
            // Hide skip button
            const skipButton = document.getElementById('skipButton');
            if (skipButton) {
              skipButton.classList.add('hidden');
            }
          }, 200);
        }
      }, index * 60);
    });
  }

  async runScript() {
    if (this.isSkipped) return;

    for (let i = 0; i < this.script.length; i++) {
      if (this.isSkipped) return;

      const command = this.script[i];
      await this.executeCommand(command);
      await this.delay(command.delay);
    }

    // PHASE 6: After deploy completes, trigger GSAP animation
    await this.delay(500);
    await this.playWelcomeAnimation();

    // Show greeting and cards
    await this.delay(200);
    this.showGreetingAndCards();
  }

  executeCommand(command) {
    return new Promise(async (resolve) => {
      const line = this.createLine();

      if (command.type === 'command') {
        line.innerHTML = '<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ ';
        this.typeText(line, command.text, async () => {
          if (command.callback) {
            await command.callback();
          }
          resolve();
        });
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

        // 50% faster: 1600ms -> 1000ms
        this.animateProgress(progressBar.fill, 100, 1000, () => {
          setTimeout(() => {
            const successLine = this.createLine();
            successLine.innerHTML = '<span class="green">✓ Dependencies installed successfully</span>';
            resolve();
          }, 150);
        });
      }, 200);
    });
  }

  // PHASE 3: Deploy Animation
  showDeployAnimation() {
    return new Promise((resolve) => {
      const line = this.createLine();
      line.innerHTML = '<span class="gray">Deploying to production...</span>';

      setTimeout(() => {
        const progressLine = this.createLine();
        const progressBar = this.createProgressBar();
        progressLine.appendChild(progressBar.container);

        // 50% faster: 1400ms -> 900ms
        this.animateProgress(progressBar.fill, 100, 900, () => {
          setTimeout(() => {
            const successLine = this.createLine();
            successLine.innerHTML = '<span class="green">✓ Deployed successfully</span>';
            resolve();
          }, 200);
        });
      }, 200);
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

  // PHASE 4: GSAP Scramble Animation
  async playWelcomeAnimation() {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'welcome-overlay';
      overlay.innerHTML = `
        <div class="welcome-content">
          <div class="welcome-text-top">Welcome to</div>
          <div class="welcome-text-main" id="scrambleTarget"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Fade out terminal, show overlay
      const terminalContainer = document.querySelector('.intro-section');
      terminalContainer.style.transition = 'opacity 0.5s ease';
      terminalContainer.style.opacity = '0.3';

      setTimeout(() => {
        overlay.style.opacity = '1';
      }, 100);

      // Scramble animation (using CSS animation instead of GSAP)
      setTimeout(() => {
        const target = document.getElementById('scrambleTarget');
        this.scrambleText(target, 'zitti.ro', 1200, () => {
          // Animation complete, fade out
          setTimeout(() => {
            overlay.style.opacity = '0';
            terminalContainer.style.opacity = '1';

            setTimeout(() => {
              document.body.removeChild(overlay);
              resolve();
            }, 500);
          }, 300);
        });
      }, 600);
    });
  }

  scrambleText(element, finalText, duration, callback) {
    const chars = '01$@#%&*!<>[]{}';
    const startTime = Date.now();

    // Start with fully scrambled text
    let scrambled = '';
    for (let i = 0; i < finalText.length; i++) {
      scrambled += chars[Math.floor(Math.random() * chars.length)];
    }
    element.textContent = scrambled;

    const scramble = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let result = '';
      for (let i = 0; i < finalText.length; i++) {
        if (progress > i / finalText.length) {
          result += finalText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = result;

      if (progress < 1) {
        setTimeout(scramble, 50);
      } else {
        element.textContent = finalText;
        callback();
      }
    };

    scramble();
  }

  // PHASE 5: Show Greeting and Command Cards
  showGreetingAndCards() {
    const greeting = this.generatePersonalizedGreeting();

    // Add some spacing
    this.createLine();

    // Show personalized greeting
    const greetingLine = this.createLine();
    greetingLine.innerHTML = `<span class="greeting-main">${greeting.main}</span>`;

    const timeLine = this.createLine();
    timeLine.innerHTML = `<span class="gray">${greeting.time} • ${greeting.day} • ${greeting.device}</span>`;

    this.createLine();

    // Show "Available destinations" header
    const headerLine = this.createLine();
    headerLine.innerHTML = '<span class="destinations-header">Available destinations:</span>';

    this.createLine();

    // Create command cards
    const cardsContainer = this.createLine();
    cardsContainer.className = 'terminal-line cards-container';

    const commands = [
      { cmd: 'me', icon: '👤', desc: 'About & Contact', url: 'pages/contact/index.html' },
      { cmd: 'coding', icon: '💻', desc: 'My Projects', url: 'https://projects.zitti.ro' },
      { cmd: 'library', icon: '📚', desc: 'Book Collection', url: 'pages/book-library/index.html' },
      { cmd: 'stars', icon: '⭐', desc: 'Star Map', url: 'pages/star-map/index.html' },
      { cmd: 'games', icon: '🎲', desc: 'Party Games', url: 'https://games.zitti.ro' }
    ];

    commands.forEach((cmd, index) => {
      const card = document.createElement('div');
      card.className = 'command-card';
      card.innerHTML = `
        <div class="card-icon">${cmd.icon}</div>
        <div class="card-name">${cmd.cmd}</div>
        <div class="card-desc">${cmd.desc}</div>
      `;

      card.addEventListener('click', () => {
        card.classList.add('card-clicked');
        setTimeout(() => {
          window.location.href = cmd.url;
        }, 300);
      });

      // Stagger animation
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);

      cardsContainer.appendChild(card);
    });

    this.createLine();
    const orLine = this.createLine();
    orLine.innerHTML = '<span class="gray">Or type a command below:</span>';

    // Enable interactive input
    setTimeout(() => {
      this.enableInteractiveMode();

      // Hide skip button
      const skipButton = document.getElementById('skipButton');
      if (skipButton) {
        skipButton.classList.add('hidden');
      }
    }, 500);
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
    inputLine.innerHTML = `<span class="blue">azitti@dev</span>:<span class="yellow">~</span>$ ${command}`;

    // Navigation commands
    const commands = {
      'me': 'pages/contact/index.html',
      'coding': 'https://projects.zitti.ro',
      'library': 'pages/book-library/index.html',
      'stars': 'pages/star-map/index.html',
      'games': 'https://games.zitti.ro'
    };

    if (commands[command]) {
      const responseLine = this.createLine();
      responseLine.innerHTML = `<span class="green">Navigating to ${command}...</span>`;

      setTimeout(() => {
        window.location.href = commands[command];
      }, 800);
      return;
    }

    // Easter egg commands
    if (this.handleEasterEgg(command)) {
      return;
    }

    // Command not found
    const errorLine = this.createLine();
    errorLine.innerHTML = `<span class="red">Command not found: ${command}</span>`;

    const helpLine = this.createLine();
    helpLine.innerHTML = `<span class="gray">Available commands: me, coding, library, stars, games, help</span>`;

    setTimeout(() => {
      this.enableInteractiveMode();
    }, 1000);
  }

  handleEasterEgg(command) {
    const cmd = command.toLowerCase();

    // ls - list files
    if (cmd === 'ls' || cmd === 'ls -la' || cmd === 'ls -l') {
      const line = this.createLine();
      line.innerHTML = `<span class="blue">drwxr-xr-x</span>  me/
<span class="blue">drwxr-xr-x</span>  coding/
<span class="blue">drwxr-xr-x</span>  library/
<span class="blue">drwxr-xr-x</span>  stars/
<span class="gray">-rw-r--r--</span>  README.md
<span class="gray">-rw-r--r--</span>  secrets.txt <span class="gray">(access denied)</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1000);
      return true;
    }

    // pwd - print working directory
    if (cmd === 'pwd') {
      const line = this.createLine();
      line.innerHTML = `<span class="green">/home/visitor/portfolio</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1000);
      return true;
    }

    // whoami
    if (cmd === 'whoami') {
      const line = this.createLine();
      line.innerHTML = `<span class="green">visitor</span> <span class="gray">(a curious developer)</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1000);
      return true;
    }

    // sudo
    if (cmd.startsWith('sudo')) {
      const line = this.createLine();
      line.innerHTML = `<span class="red">[sudo]</span> password for visitor: <span class="gray">●●●●●●●●</span>
<span class="red">Sorry, user visitor is not in the sudoers file. This incident will be reported.</span>
<span class="gray">Nice try! 😏</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1500);
      return true;
    }

    // rm -rf (dangerous!)
    if (cmd.includes('rm -rf') || cmd.includes('rm -r')) {
      const line = this.createLine();
      line.innerHTML = `<span class="red">⚠️  INITIATING SELF-DESTRUCT SEQUENCE...</span>`;

      setTimeout(() => {
        const line2 = this.createLine();
        line2.innerHTML = `<span class="red">████████░░ 80%</span>`;

        setTimeout(() => {
          const line3 = this.createLine();
          line3.innerHTML = `<span class="green">Just kidding! Nothing was deleted. 😅</span>
<span class="gray">Pro tip: Don't run rm -rf in production!</span>`;
          setTimeout(() => this.enableInteractiveMode(), 2000);
        }, 800);
      }, 1000);
      return true;
    }

    // clear
    if (cmd === 'clear' || cmd === 'cls') {
      this.terminal.innerHTML = '';
      const line = this.createLine();
      line.innerHTML = `<span class="gray">Terminal cleared! (but memories remain...)</span>`;
      setTimeout(() => this.enableInteractiveMode(), 500);
      return true;
    }

    // history
    if (cmd === 'history') {
      const line = this.createLine();
      line.innerHTML = `<span class="gray">  1  npm install
  2  npm run deploy
  3  ${command}

Hint: You can type 'me', 'coding', 'library', or 'stars'</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1000);
      return true;
    }

    // help
    if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
      const line = this.createLine();
      line.innerHTML = `<span class="yellow">Available Commands:</span>
<span class="green">Navigation:</span>
  me       - About & Contact
  coding   - My Projects
  library  - Book Collection
  stars    - Star Map
  games    - Party Games

<span class="green">System:</span>
  ls       - List files
  pwd      - Current directory
  whoami   - Who are you?
  clear    - Clear terminal
  history  - Command history
  help     - This message

<span class="gray">Try other commands for surprises! 🎉</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1500);
      return true;
    }

    // git status
    if (cmd === 'git status') {
      const line = this.createLine();
      line.innerHTML = `<span class="gray">On branch</span> <span class="green">main</span>
<span class="gray">Your branch is up to date with 'origin/main'.</span>

<span class="gray">nothing to commit, working tree clean</span>
<span class="green">✓ All good! Keep coding!</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1200);
      return true;
    }

    // vim
    if (cmd === 'vim' || cmd === 'vi') {
      const line = this.createLine();
      line.innerHTML = `<span class="green">~
~
~
~
~
~</span>
<span class="gray">You are now stuck in vim. Type :q to escape... or just refresh! 😈</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1500);
      return true;
    }

    // exit
    if (cmd === 'exit' || cmd === 'quit') {
      const line = this.createLine();
      line.innerHTML = `<span class="gray">You can't leave... but you can navigate! Try: me, coding, library, stars</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1000);
      return true;
    }

    // cat
    if (cmd === 'cat') {
      const line = this.createLine();
      line.innerHTML = `<span class="gray">  /\\_/\\
 ( o.o )
  > ^ <

Meow! 🐱</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1000);
      return true;
    }

    // hack / matrix
    if (cmd === 'hack' || cmd === 'matrix') {
      const line = this.createLine();
      line.innerHTML = `<span class="green">ACCESSING MAINFRAME...</span>`;

      setTimeout(() => {
        const line2 = this.createLine();
        line2.innerHTML = `<span class="green">█▓▒░ HACKING IN PROGRESS ░▒▓█</span>`;

        setTimeout(() => {
          const line3 = this.createLine();
          line3.innerHTML = `<span class="green">01001000 01100001 01100011 01101011 01100101 01100100</span>`;

          setTimeout(() => {
            const line4 = this.createLine();
            line4.innerHTML = `<span class="green">ACCESS GRANTED! Welcome, Neo. 😎</span>`;
            setTimeout(() => this.enableInteractiveMode(), 1500);
          }, 500);
        }, 500);
      }, 800);
      return true;
    }

    // ping
    if (cmd.startsWith('ping')) {
      const line = this.createLine();
      line.innerHTML = `<span class="gray">PING zitti.ro (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.051 ms</span>

<span class="green">Pong! 🏓</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1200);
      return true;
    }

    // coffee
    if (cmd === 'coffee') {
      const line = this.createLine();
      line.innerHTML = `<span class="gray">    (  )   (   )  )
     ) (   )  (  (
     ( )  (    ) )
     _____________
    <_____________> ___
    |             |/ _ \\
    |               | | |
    |               |_| |
 ___|             |\\___/
/    \\___________/    \\
\\_____________________/</span>

<span class="green">☕ Here's your coffee! *slurp* Ahhhh...</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1500);
      return true;
    }

    // beer
    if (cmd === 'beer') {
      const line = this.createLine();
      line.innerHTML = `<span class="yellow">      ___
     |   |
     |   |
     |   |
    |||||||
    |||||||
    \\_____/</span>

<span class="green">🍺 Cheers! You earned it!</span>`;
      setTimeout(() => this.enableInteractiveMode(), 1200);
      return true;
    }

    return false;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure everything is loaded
  setTimeout(() => {
    new TerminalAnimation();
  }, 500);
});