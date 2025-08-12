        // Get references to the DOM elements
        const outputDiv = document.getElementById('output');
        const terminalDiv = document.getElementById('terminal-container');
        const hiddenInput = document.getElementById('hidden-input');

        // A structured file system representation with file content
        const fileSystem = {
            'type': 'directory',
            'children': {
                'home': {
                    'type': 'directory',
                    'children': {
                        'documents': {
                            'type': 'directory',
                            'children': {
                                'essay.txt': { 'type': 'file', 'content': 'This is a sample essay file.\nIt contains multiple lines of text.' },
                                'report.pdf': { 'type': 'file' }
                            }
                        },
                        'pictures': {
                            'type': 'directory',
                            'children': {
                                'vacation.jpg': { 'type': 'file' }
                            }
                        },
                        'videos': {
                            'type': 'directory',
                            'children': {
                                'cat_video.mp4': { 'type': 'file' }
                            }
                        },
                        'README.md': { 'type': 'file', 'content': '# Web-Terminal\nThis is a simulated Linux terminal built with HTML, CSS, and JavaScript.' }
                    }
                }
            }
        };

        // An array to keep track of the current path
        let currentPath = ['home'];
        let commandHistory = [];
        let historyIndex = -1;

        // State variable to handle special modes like telnet or vi
        let mode = 'normal';
        let telnetSession = false;
        let netcatSession = false;

        // Command handler mapping, now in the global scope
        const commands = {
            'help': (args, onComplete) => {
                printLine('Available commands:');
                printLine('  ls - list files in the current directory');
                printLine('  cd [directory] - change the current directory');
                printLine('  pwd - print the current working directory');
                printLine('  whoami - print the current user');
                printLine('  hostname [-i|-f] - print the system hostname or IP');
                printLine('  mkdir [name] - create a new directory');
                printLine('  touch [name] - create a new file');
                printLine('  rm [name] - remove a file or empty directory');
                printLine('  cat [file] - display file content');
                printLine('  vi [file] - simulate a text editor');
                printLine('  ping [host] - simulate network ping');
                printLine('  traceroute [host] - simulate traceroute');
                printLine('  telnet [host] - simulate telnet session');
                printLine('  netcat [host] [port] - simulate netcat session');
                printLine('  nc -z [host] [port] - simulate a port scan');
                printLine('  time [command] - measures the execution time of a command');
                printLine('  date - display the current date and time');
                printLine('  cal - display a calendar for the current month');
                printLine('  df -kh - display disk usage statistics (simulated)');
                printLine('  echo [-e] [text] - print text to the terminal');
                printLine('  printf [format] [arguments] - format and print data');
                printLine('  clear - clear the terminal screen');
                printLine('  exit - exit the terminal session');
                onComplete();
            },
            'ls': (args, onComplete) => {
                const currentDir = getCurrentDirectory();
                if (currentDir) {
                    const items = Object.keys(currentDir.children);
                    if (items.length > 0) {
                        const outputLine = items.map(item => {
                            const itemType = currentDir.children[item].type;
                            if (itemType === 'directory') {
                                return `<span style="color: #00ffff">${item}</span>`;
                            } else {
                                return item;
                            }
                        }).join('&nbsp;&nbsp;');
                        printLine(outputLine, '#e0e0e0', false, true);
                    } else {
                        printLine('No items in this directory.');
                    }
                } else {
                    printLine('Error: Invalid directory structure.', '#ff0000');
                }
                onComplete();
            },
            'cd': (args, onComplete) => {
                const newDir = args[0];
                const currentDir = getCurrentDirectory();
                if (!newDir || newDir === '/') {
                    currentPath = ['home'];
                } else if (newDir === '..') {
                    if (currentPath.length > 1) {
                        currentPath.pop();
                    }
                } else {
                    if (currentDir && currentDir.children[newDir] && currentDir.children[newDir].type === 'directory') {
                        currentPath.push(newDir);
                    } else {
                        printLine(`cd: no such file or directory: ${newDir}`, '#ff0000');
                    }
                }
                onComplete();
            },
            'pwd': (args, onComplete) => {
                const pathString = '/' + currentPath.join('/');
                printLine(pathString);
                onComplete();
            },
            'whoami': (args, onComplete) => {
                printLine('user');
                onComplete();
            },
            'hostname': (args, onComplete) => {
                if (args.length === 0) {
                    printLine('web-terminal');
                } else if (args[0] === '-i') {
                    printLine('127.0.0.1');
                } else if (args[0] === '-f' || args[0] === '--fqdn') {
                    printLine('web-terminal.localdomain');
                } else {
                    printLine(`hostname: unrecognized option '${args[0]}'`, '#ff0000');
                    printLine('Try \'hostname --help\' for more information.');
                }
                onComplete();
            },
            'mkdir': (args, onComplete) => {
                const dirName = args[0];
                const currentDir = getCurrentDirectory();
                if (!dirName) {
                    printLine('mkdir: missing operand', '#ff0000');
                } else if (currentDir.children[dirName]) {
                    printLine(`mkdir: cannot create directory ‘${dirName}’: File exists`, '#ff0000');
                } else {
                    currentDir.children[dirName] = { 'type': 'directory', 'children': {} };
                    printLine(`Directory '${dirName}' created.`);
                }
                onComplete();
            },
            'touch': (args, onComplete) => {
                const fileName = args[0];
                const currentDir = getCurrentDirectory();
                if (!fileName) {
                    printLine('touch: missing file operand', '#ff0000');
                } else if (currentDir.children[fileName]) {
                    printLine(`touch: cannot create file ‘${fileName}’: File exists`, '#ff0000');
                } else {
                    currentDir.children[fileName] = { 'type': 'file', 'content': '' };
                    printLine(`File '${fileName}' created.`);
                }
                onComplete();
            },
            'rm': (args, onComplete) => {
                const itemName = args[0];
                const currentDir = getCurrentDirectory();
                if (!itemName) {
                    printLine('rm: missing operand', '#ff0000');
                } else if (!currentDir.children[itemName]) {
                    printLine(`rm: cannot remove ‘${itemName}’: No such file or directory`, '#ff0000');
                } else if (currentDir.children[itemName].type === 'directory' && Object.keys(currentDir.children[itemName].children).length > 0) {
                    printLine(`rm: cannot remove ‘${itemName}’: Directory not empty`, '#ff0000');
                } else {
                    delete currentDir.children[itemName];
                    printLine(`'${itemName}' removed.`);
                }
                onComplete();
            },
            'cat': (args, onComplete) => {
                const fileName = args[0];
                const currentDir = getCurrentDirectory();
                if (!fileName) {
                    printLine('cat: missing file operand', '#ff0000');
                    onComplete();
                    return;
                }
                const file = currentDir.children[fileName];
                if (file && file.type === 'file') {
                    printLine(file.content || 'File is empty.');
                } else {
                    printLine(`cat: ${fileName}: No such file or directory`, '#ff0000');
                }
                onComplete();
            },
            'vi': (args, onComplete) => {
                const fileName = args[0];
                const currentDir = getCurrentDirectory();
                if (!fileName) {
                    printLine('vi: missing file operand', '#ff0000');
                    onComplete();
                    return;
                }
                const file = currentDir.children[fileName];
                if (file && file.type === 'file') {
                    printLine(file.content || '', '#ffff00');
                    printLine(`"${fileName}" [readonly] --0%--`, '#ffff00');
                    mode = 'vi';
                } else {
                    printLine(`vi: ${fileName}: No such file or directory`, '#ff0000');
                }
                onComplete();
            },
            'echo': (args, onComplete) => {
                let isStyled = false;
                if (args.length > 0 && args[0] === '-e') {
                    isStyled = true;
                    args.shift();
                }
                const textToEcho = args.join(' ').replace(/\\e/g, '\u001b');
                printLine(textToEcho, '#e0e0e0', isStyled);
                onComplete();
            },
            'printf': (args, onComplete) => {
                if (args.length === 0) {
                    printLine('printf: missing operand', '#ff0000');
                } else {
                    const outputText = args.join(' ').replace(/\\n/g, '\n');
                    printLine(outputText);
                }
                onComplete();
            },
            'clear': (args, onComplete) => {
                outputDiv.innerHTML = '';
                onComplete();
            },
            'exit': (args, onComplete) => {
                printLine('Exiting terminal session...');
                printLine('This would typically return you to the previous page in your browser.');
				if (window.history.length > 1) {
      				window.history.back();
    			} 
				else {
      			// If there's no previous page, you can do something else,
      			// like redirecting to a home page.
      			console.log("No previous page to go back to.");
      			// Example: window.location.href = '/'; // redirect to the homepage
    			}
                onComplete();
            },
            'ping': (args, onComplete) => {
                const host = args[0] || 'google.com';
                const ip = '172.217.160.142';
                printLine(`PING ${host} (${ip}) 56(84) bytes of data.`);
                let count = 0;
                const interval = setInterval(() => {
                    if (count < 4) {
                        const time = (Math.random() * 50).toFixed(2);
                        printLine(`64 bytes from ${ip}: icmp_seq=${count + 1} ttl=115 time=${time} ms`);
                        count++;
                    } else {
                        clearInterval(interval);
                        printLine(`\n--- ${host} ping statistics ---`);
                        printLine(`4 packets transmitted, 4 received, 0% packet loss, time 3003ms`);
                        printLine('');
                        onComplete();
                    }
                }, 1000);
            },
            'telnet': (args, onComplete) => {
                const host = args[0] || 'localhost';
                printLine(`Trying ${host}...`);
                setTimeout(() => {
                    printLine(`Connected to ${host}.`);
                    printLine(`Escape character is '^]'.`);
                    printLine(`Type 'exit' to quit.`);
                    printLine('');
                    telnetSession = true;
                    onComplete();
                }, 1500);
            },
            'netcat': (args, onComplete) => handleNetcatCommandAlias(args, onComplete),
            'nc': (args, onComplete) => handleNetcatCommandAlias(args, onComplete),
            'traceroute': (args, onComplete) => {
                const host = args[0] || 'google.com';
                printLine(`traceroute to ${host} (172.217.160.142), 30 hops max, 60 byte packets`);
                const maxHops = 10;
                let hop = 1;
                const traceInterval = setInterval(() => {
                    if (hop <= maxHops) {
                        const ip = `10.${hop}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                        const time1 = (Math.random() * 20).toFixed(3);
                        const time2 = (Math.random() * 20).toFixed(3);
                        const time3 = (Math.random() * 20).toFixed(3);
                        printLine(`${hop} ${ip} ${time1} ms ${time2} ms ${time3} ms`);
                        hop++;
                    } else {
                        clearInterval(traceInterval);
                        printLine('');
                        onComplete();
                    }
                }, 700);
            },
            'time': (args, onComplete) => {
                handleTimeCommand(args, onComplete);
            },
            'date': (args, onComplete) => {
                const now = new Date();
                const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
                const dateString = now.toLocaleString('en-US', options);
                printLine(dateString);
                onComplete();
            },
            'cal': (args, onComplete) => {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const numDays = lastDay.getDate();
                const firstDayOfWeek = firstDay.getDay();

                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                printLine(`     ${monthNames[month]} ${year}`);
                printLine('Su Mo Tu We Th Fr Sa');

                let line = '';
                for (let i = 0; i < firstDayOfWeek; i++) {
                    line += '   ';
                }

                for (let day = 1; day <= numDays; day++) {
                    line += day.toString().padStart(2, ' ') + ' ';
                    if ((firstDayOfWeek + day) % 7 === 0 || day === numDays) {
                        printLine(line.trim());
                        line = '';
                    }
                }
                onComplete();
            },
            'df': (args, onComplete) => {
                if (args.length === 1 && args[0] === '-kh') {
                    printLine('Filesystem      Size  Used Avail Use% Mounted on');
                    printLine('udev            3.9G     0  3.9G   0% /dev');
                    printLine('tmpfs           798M  1.4M  797M   1% /run');
                    printLine('/dev/sda1        40G   20G   18G  53% /');
                    printLine('tmpfs           3.9G  130M  3.8G   4% /dev/shm');
                    printLine('tmpfs           5.0M  4.0K  5.0M   1% /run/lock');
                    printLine('tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup');
                    printLine('tmpfs           798M     0  798M   0% /run/user/1000');
                } else {
                    printLine('df: invalid usage. Try \'df -kh\' to view disk usage.', '#ff0000');
                }
                onComplete();
            }
        };

        function handleInput(event) {
            const currentInputSpan = document.querySelector('.prompt-line .current-input');
            currentInputSpan.textContent = hiddenInput.value;
        }

        function handleKeydown(event) {
            const currentInputSpan = document.querySelector('.prompt-line .current-input');

            if (mode !== 'normal') {
                if (event.key === 'Enter') {
                    const command = hiddenInput.value;
                    if (telnetSession) {
                        handleTelnetCommand(command);
                    } else if (netcatSession) {
                        handleNetcatCommand(command);
                    } else if (mode === 'vi') {
                        handleViCommand(command);
                    }
                    hiddenInput.value = '';
                    currentInputSpan.textContent = '';
                    historyIndex = -1;
                }
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                const fullCommandText = hiddenInput.value.trim();
                const currentPromptLine = currentInputSpan.parentElement;

                const cursorElement = currentPromptLine.querySelector('.cursor');
                if (cursorElement) {
                    cursorElement.remove();
                }

                if (fullCommandText !== '') {
                    commandHistory.push(fullCommandText);
                    handleCommand(fullCommandText, createPromptLine);
                } else {
                    createPromptLine();
                }
                historyIndex = -1;
                hiddenInput.value = '';
                currentInputSpan.textContent = '';
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (commandHistory.length > 0) {
                    historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                    const text = commandHistory[commandHistory.length - 1 - historyIndex];
                    currentInputSpan.textContent = text;
                    hiddenInput.value = text;
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (commandHistory.length > 0) {
                    historyIndex = Math.max(historyIndex - 1, -1);
                    if (historyIndex === -1) {
                        currentInputSpan.textContent = '';
                        hiddenInput.value = '';
                    } else {
                        const text = commandHistory[commandHistory.length - 1 - historyIndex];
                        currentInputSpan.textContent = text;
                        hiddenInput.value = text;
                    }
                }
            } else if (event.key === 'Tab') {
                event.preventDefault();
                handleAutocomplete(hiddenInput.value);
                hiddenInput.value = currentInputSpan.textContent;
            } else if (event.ctrlKey && event.key === 'l') {
                event.preventDefault();
                commands['clear'](null, createPromptLine);
            }
        }

        function handlePaste(event) {
            event.preventDefault();
            const pastedText = event.clipboardData.getData('text');
            hiddenInput.value += pastedText;
            const currentInputSpan = document.querySelector('.prompt-line .current-input');
            currentInputSpan.textContent = hiddenInput.value;
        }

        function createPromptLine() {
            const oldPromptLine = document.querySelector('.prompt-line');
            if (oldPromptLine) {
                oldPromptLine.classList.remove('prompt-line');
            }

            const promptLine = document.createElement('div');
            promptLine.classList.add('line', 'prompt-line');

            const promptText = document.createElement('span');
            promptText.classList.add('prompt-text');
            promptLine.appendChild(promptText);

            const inputContainer = document.createElement('span');
            inputContainer.classList.add('input-container');

            const currentInput = document.createElement('span');
            currentInput.classList.add('current-input');
            inputContainer.appendChild(currentInput);

            const cursor = document.createElement('span');
            cursor.classList.add('cursor');
            inputContainer.appendChild(cursor);

            promptLine.appendChild(inputContainer);

            outputDiv.appendChild(promptLine);
            updatePrompt();
            outputDiv.scrollTop = outputDiv.scrollHeight;

            hiddenInput.focus();
        }

        function updatePrompt() {
            const pathString = currentPath.join('/');
            const promptText = document.querySelector('.prompt-line .prompt-text');
            if (promptText) {
                promptText.textContent = `user@new-terminal:~/${pathString}$`;
            }
        }

        function getCurrentDirectory() {
            let current = fileSystem;
            for (const dir of currentPath) {
                if (current.children && current.children[dir]) {
                    current = current.children[dir];
                } else {
                    return null;
                }
            }
            return current;
        }

        const ansiCodeToCss = {
            0: 'color: inherit; background-color: inherit;',
            30: 'color: black;', 31: 'color: red;', 32: 'color: limegreen;', 33: 'color: yellow;',
            34: 'color: deepskyblue;', 35: 'color: mediumpurple;', 36: 'color: cyan;', 37: 'color: white;',
            40: 'background-color: black;', 41: 'background-color: red;', 42: 'background-color: limegreen;',
            43: 'background-color: yellow;', 44: 'background-color: deepskyblue;', 45: 'background-color: mediumpurple;',
            46: 'background-color: cyan;', 47: 'background-color: white;',
        };

        function printLine(text, color = '#e0e0e0', isStyled = false, isHtml = false) {
            const line = document.createElement('div');
            line.classList.add('line');

            if (isStyled) {
                const ansiRegex = /\u001b\[([0-9;]*)m/g;
                let lastIndex = 0;
                let match;
                let htmlContent = '';
                let currentStyle = '';

                while ((match = ansiRegex.exec(text)) !== null) {
                    const contentBefore = text.substring(lastIndex, match.index);
                    if (contentBefore) {
                        htmlContent += `<span style="${currentStyle}">${contentBefore}</span>`;
                    }

                    const codes = match[1].split(';');
                    let newStyle = '';

                    if (codes.includes('0')) {
                        currentStyle = '';
                    } else {
                        codes.forEach(code => {
                            const css = ansiCodeToCss[parseInt(code, 10)];
                            if (css) {
                                newStyle += css;
                            }
                        });
                        currentStyle = newStyle;
                    }
                    lastIndex = ansiRegex.lastIndex;
                }

                const remainingContent = text.substring(lastIndex);
                if (remainingContent) {
                    htmlContent += `<span style="${currentStyle}">${remainingContent}</span>`;
                }

                line.innerHTML = htmlContent;

            } else if (isHtml) {
                line.innerHTML = text;
            } else {
                line.textContent = text;
                line.style.color = color;
            }

            outputDiv.appendChild(line);
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }

        function handleAutocomplete(inputValue) {
            const parts = inputValue.split(' ');
            const lastPart = parts.pop();
            const currentInputSpan = document.querySelector('.prompt-line .current-input');

            if (inputValue.indexOf(' ') === -1) {
                const commandList = Object.keys(commands);
                const possibleCommands = commandList.filter(cmd => cmd.startsWith(inputValue));

                if (possibleCommands.length === 1) {
                    currentInputSpan.textContent = possibleCommands[0] + ' ';
                } else if (possibleCommands.length > 1) {
                    printLine(possibleCommands.join('\t'));
                }
            } else {
                const currentDir = getCurrentDirectory();
                if (!currentDir) return;

                const possibleFiles = Object.keys(currentDir.children).filter(file => file.startsWith(lastPart));

                if (possibleFiles.length === 1) {
                    const completePath = parts.join(' ') + ' ' + possibleFiles[0];
                    currentInputSpan.textContent = completePath;
                } else if (possibleFiles.length > 1) {
                    printLine(possibleFiles.join('\t'));
                }
            }
        }

        function handleCommand(fullCommand, onComplete) {
            const parts = fullCommand.match(/"[^"]*"|'[^']*'|\S+/g) || [];
            const command = parts[0];
            const args = parts.slice(1).map(arg => {
                if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
                    return arg.slice(1, -1);
                }
                return arg;
            });

            if (commands[command]) {
                commands[command](args, onComplete);
            } else {
                printLine(`Command not found: ${command}`, '#ff0000');
                printLine('');
                onComplete();
            }
        }

        function handleTimeCommand(args, onComplete) {
            if (args.length === 0) {
                printLine('time: missing command', '#ff0000');
                onComplete();
                return;
            }

            const commandToTime = args[0];
            const commandArgs = args.slice(1);

            if (commands[commandToTime] && commandToTime !== 'time') {
                commands[commandToTime](commandArgs, () => {
                    setTimeout(() => {
                        printLine('\nreal\t0m0.003s');
                        printLine('user\t0m0.001s');
                        printLine('sys\t0m0.002s');
                        printLine('');
                        onComplete();
                    }, 100);
                });
            } else {
                printLine(`time: command not found: ${commandToTime}`, '#ff0000');
                onComplete();
            }
        }

        function handleNetcatCommandAlias(args, onComplete) {
            if (args.length > 0 && args[0] === '-z') {
                const host = args[1] || 'localhost';
                const port = parseInt(args[2], 10);
                if (isNaN(port)) {
                    printLine('nc: Port number must be a number.', '#ff0000');
                    onComplete();
                    return;
                }
                printLine(`Checking ${host}:${port}...`);
                setTimeout(() => {
                    if (port === 80) {
                        printLine(`Connection to ${host} port ${port} [tcp/http] succeeded!`);
                    } else {
                        printLine(`nc: connect to ${host} port ${port} (tcp) failed: Connection refused`);
                    }
                    onComplete();
                }, 500);
            } else {
                const host = args[0] || 'localhost';
                const port = args[1] || '80';
                printLine(`Connection to ${host} ${port} port [tcp/http] succeeded!`);
                printLine(`Type 'exit' to quit.`);
                printLine('');
                netcatSession = true;
                onComplete();
            }
        }

        function handleTelnetCommand(command) {
            if (command.toLowerCase() === 'exit') {
                printLine(`Connection closed by foreign host.`);
                telnetSession = false;
                printLine('');
                createPromptLine();
            } else {
                printLine(command, '#a9a9a9');
                printLine('Command not recognized by remote host.', '#ff0000');
            }
        }

        function handleNetcatCommand(command) {
            if (command.toLowerCase() === 'exit') {
                printLine(`Connection closed.`);
                netcatSession = false;
                printLine('');
                createPromptLine();
            } else {
                printLine(command);
            }
        }

        function handleViCommand(command) {
            if (command === ':q') {
                printLine('', '#e0e0e0');
                mode = 'normal';
                createPromptLine();
            } else {
                printLine('Command not recognized in read-only mode.', '#ff0000');
            }
        }

        // Event Listeners
        hiddenInput.addEventListener('input', handleInput);
        hiddenInput.addEventListener('keydown', handleKeydown);
        terminalDiv.addEventListener('click', () => {
            hiddenInput.focus();
        });
        document.addEventListener('paste', handlePaste);

        // Initial setup
        window.addEventListener('load', () => {
            createPromptLine();
        });
