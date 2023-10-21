const { exec, spawnSync } = require('child_process');
const fs = require("fs")
const os = require('os');
const platform = os.platform();
const readline = require("readline-sync")
const axios = require("axios")
const appp = require("express")()
let port3 = 3000;
const url = require("url")
const minimist = require("minimist")
const args = minimist(process.argv.slice(2));
const nodeversion = "v20.5.1";
const version = "v1.0.0"
const printer = require('node-printer');

function compile(code) {

    const system = {
        shutdown: () => {
            if (platform === 'win32') {
                // Sistema Windows
                exec('shutdown /s /f /t 0', (error, stdout, stderr) => { });
            } else if (platform === 'linux' || platform === 'darwin') {
                // Sistemi Unix (Linux, macOS)
                exec('shutdown -h now', (error, stdout, stderr) => { })
            }

        },
        restart: () => {

            if (platform === 'win32') {
                // Sistema Windows
                exec('shutdown /r /t 0', (error, stdout, stderr) => { });
            } else if (platform === 'linux' || platform === 'darwin') {
                // Sistemi Unix (Linux, macOS)
                throw new Error("Operating system not supported")
            }
        },
        sleep: () => {

            if (platform === 'win32') {
                // Sistema Windows
                exec('shutdown /h', (error, stdout, stderr) => { });
            } else if (platform === 'linux' || platform === 'darwin') {
                // Sistemi Unix (Linux, macOS)
                throw new Error("Operating system not supported")
            }
        }
    }

    function font(text, style) {
        if (style == "red") {
            return `\x1b[31m${text}\x1b[0m`
        }
        if (style == "green") {
            return `\x1b[32m${text}\x1b[0m`
        }
        if (style == "blue") {
            return `\x1b[34m${text}\x1b[0m`
        }
        if (style == "yellow") {
            return `\x1b[33m${text}\x1b[0m`
        }
        if (style == "bold") {
            return `\x1b[1m${text}\x1b[0m`
        }
        if (style == "ul") {
            return `\x1b[4m${text}\x1b[0m`
        }
    }
    console.execute = function (cmd) {
        exec(cmd, (error, stdout, stderr) => { });
    }
    console.warn = function (content) {
        console.log(font("WARNING: " + content, "yellow"))
    }

    console.info = function(content) {console.log(font("INFO: " + content, "blue"))}
    console.input = function (question) {
        return readline.question(question);
    }
    function sleep(milliseconds) {
        return new Promise((resolve) => {
          setTimeout(resolve, milliseconds);
        });
      }
    function random(min, max) {
        if (min == undefined || min == NaN) {
            return Math.floor(Math.random() * max)
        }
        if (!min && !max) {
            return Math.random();
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;

    }

    function fetch(url, headers) {
        return axios.get(url, { headers: headers }).then((response) => {
            return response.data
        }).catch(err => {
            throw new Error("Fetch Error: " + err)
        })
    }
     function readFile(file) {
        return fs.readFileSync(file, "utf-8")
    }
     function writeFile(file, text) {
        try {
        fs.writeFileSync(file, text, { encoding: "utf-8" })
        } catch(err) {throw new Error(err)}
    }
     function delFile(file) {
        try {
        fs.unlinkSync(file);
    } catch(err) {throw new Error(err)}
    }
     function mkdir(file) {
        try { 
        fs.mkdirSync(file)
        } catch(err) {throw new Error(err)}
    }
     function rmdir(file) {
        try {
        fs.rmdirSync(file)
    } catch(err) {throw new Error(err)}
    }

    function getpackage() {
        let data = fs.readFileSync("./package.json", "utf-8")

        let json = JSON.parse(data);
        return json;
    }
    require.json = function(file) {
        let data = fs.readFileSync(file, "utf-8")
        let json = JSON.parse(data);
        return json;
    }
    class Server {
        constructor(port) {
            port3 = port
        }

        Send = (page, html) => {
            appp.get(page, (req, res) => {
                res.send(html);
            })
        }
        Start = () => {
            appp.listen(port3, () => {
                return true
            })
        }

    }

    function print(file, printername) {
       new printer(printername).printFile(file);
    }
    let npm = {
        install: (pkg) => {
            console.execute("npm i " + pkg)
        },
        uninstall: (pkg) => {
            console.execute("npm uninstall " + pkg)
        },
        global: {
            install: (pkg) => {
                console.execute("npm i " + pkg + " -g")
            },
            uninstall: (pkg) => {
                console.execute("npm uninstall " + pkg + " -g")
            },
        }
    }
    function parseBool (bool) {
        if(bool == "true") {
            return true
        } else if(bool == "false"){ return false }
        else if(bool == 0) {
            return false
        } else if(bool == 1) { return true} else {
            return undefined
        }
    }
    function MessageBox(content, title, buttons, icon) {
        spawnSync("powershell.exe", [`
Add-Type -AssemblyName PresentationCore,PresentationFramework;
[System.Windows.MessageBox]::Show('${content}', '${title}', ${buttons}, ${icon});
`]);
    }
    eval(code);
    exec("npm cache clean --force")
}

if (args.help) {
    console.log('Welcome to better node! digit "bnode --help" for help!');
    console.log('bnode --version : See the Node and Bnode version')
    console.log('bnode --eval <code> : Run a piece of code of betternode')
    console.log('bnode <file> : Run a piece of code of betternode')
    console.log('bnode --compile <file> : Transform a nodejs file in .exe (pkg service)')
    console.log("-- Created by Infinix / Tsaz")
  } else if (args.version) {
    console.log('Bnode version: ' + version);
    console.log('Node version: ' + nodeversion)
  } else if (args.eval) {
    compile(args.eval)
  } else if(args._.length === 1) {
    const nomeFile = args._[0];
    if(nomeFile == ".") {
        let data = fs.readFileSync("./package.json", "utf-8")

        let json = JSON.parse(data);
        fs.readFile(json.main, "utf-8", (err, data) => {
            if(err) throw new Error("No file found")
        compile(data)
        })
        
    }
        fs.readFile(nomeFile, "utf-8", (err, data) => {
            if(err) throw new Error("No file found")
        compile(data)
        })
        
  } 
  else if(args.compile) {
    exec("npm i os fs readline-sync axios express url minimist node-printer")
    exec("npm i -g pkg")
    exec("npm i pkg")
    let file = args.compile
    let content = fs.readFileSync(file, "utf8");
    fs.writeFile("./compiling.js", `const { exec, spawnSync } = require('child_process');
    const fs = require("fs")
    const os = require('os');
    const platform = os.platform();
    const readline = require("readline-sync")
    const axios = require("axios")
    const appp = require("express")()
    let port3 = 3000;
    const url = require("url")
    const minimist = require("minimist")
    const args = minimist(process.argv.slice(2));
    const nodeversion = "v20.5.1";
    const version = "v1.0.0"
    const printer = require('node-printer');
    
    const system = {
        shutdown: () => {
            if (platform === 'win32') {
                // Sistema Windows
                exec('shutdown /s /f /t 0', (error, stdout, stderr) => { });
            } else if (platform === 'linux' || platform === 'darwin') {
                // Sistemi Unix (Linux, macOS)
                exec('shutdown -h now', (error, stdout, stderr) => { })
            }
    
        },
        restart: () => {
    
            if (platform === 'win32') {
                // Sistema Windows
                exec('shutdown /r /t 0', (error, stdout, stderr) => { });
            } else if (platform === 'linux' || platform === 'darwin') {
                // Sistemi Unix (Linux, macOS)
                throw new Error("Operating system not supported")
            }
        },
        sleep: () => {
    
            if (platform === 'win32') {
                // Sistema Windows
                exec('shutdown /h', (error, stdout, stderr) => { });
            } else if (platform === 'linux' || platform === 'darwin') {
                // Sistemi Unix (Linux, macOS)
                throw new Error("Operating system not supported")
            }
        }
    }
    
    function font(text, style) {
        if (style == "red") {
            return \`\x1b[31m\${text}\x1b[0m\`
        }
        if (style == "green") {
            return \`\x1b[32m\${text}\x1b[0m\`
        }
        if (style == "blue") {
            return \`\x1b[34m\${text}\x1b[0m\`
        }
        if (style == "yellow") {
            return \`\x1b[33m\${text}\x1b[0m\`
        }
        if (style == "bold") {
            return \`\x1b[1m\${text}\x1b[0m\`
        }
        if (style == "ul") {
            return \`\x1b[4m\${text}\x1b[0m\`
        }
    }
    console.execute = function (cmd) {
        exec(cmd, (error, stdout, stderr) => { });
    }
    console.warn = function (content) {
        console.log(font("WARNING: " + content, "yellow"))
    }
    
    console.info = function(content) {console.log(font("INFO: " + content, "blue"))}
    console.input = function (question) {
        return readline.question(question);
    }
    function sleep(milliseconds) {
        return new Promise((resolve) => {
          setTimeout(resolve, milliseconds);
        });
      }
    function random(min, max) {
        if (min == undefined || min == NaN) {
            return Math.floor(Math.random() * max)
        }
        if (!min && !max) {
            return Math.random();
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    
    }
    
    function fetch(url, headers) {
        return axios.get(url, { headers: headers }).then((response) => {
            return response.data
        }).catch(err => {
            throw new Error("Fetch Error: " + err)
        })
    }
     function readFile(file) {
        return fs.readFileSync(file, "utf-8")
    }
     function writeFile(file, text) {
        fs.writeFileSync(file, text, { encoding: "utf-8" })
    }
     function delFile(file) {
        fs.unlinkSync(file);
    }
     function mkdir(file) {
        fs.mkdirSync(file)
    }
     function rmdir(file) {
        fs.rmdirSync(file)
    }
    
    function getpackage() {
        let data = fs.readFileSync("./package.json", "utf-8")
    
        let json = JSON.parse(data);
        return json;
    }
    require.json = function(file) {
        let data = fs.readFileSync(file, "utf-8")
        let json = JSON.parse(data);
        return json;
    }
    class Server {
        constructor(port) {
            port3 = port
        }
    
        Send = (page, html) => {
            appp.get(page, (req, res) => {
                res.send(html);
            })
        }
        Start = () => {
            appp.listen(port3, () => {
                return true
            })
        }
    
    }
    
    function print(file, printername) {
       new printer(printername).printFile(file);
    }
    let npm = {
        install: (pkg) => {
            console.execute("npm i " + pkg)
        },
        uninstall: (pkg) => {
            console.execute("npm uninstall " + pkg)
        },
        global: {
            install: (pkg) => {
                console.execute("npm i " + pkg + " -g")
            },
            uninstall: (pkg) => {
                console.execute("npm uninstall " + pkg + " -g")
            },
        }
    }
    function parseBool (bool) {
        if(bool == "true") {
            return true
        } else if(bool == "false"){ return false }
        else if(bool == 0) {
            return false
        } else if(bool == 1) { return true} else {
            return undefined
        }
    }
    function MessageBox(content, title, buttons, icon) {
        spawnSync("powershell.exe", [\`
    Add-Type -AssemblyName PresentationCore,PresentationFramework;
    [System.Windows.MessageBox]::Show('\${content}', '\${title}', \${buttons}, \${icon});
    \`]);
    };\n${content}`, (err) => {
        exec(require("./pkgdefault.json").def + " compiling.js --output" +file ).on("close", () => {
            fs.unlinkSync("./compiling.js")
        })
        
    })
  } else if(args.clearcache) {
    exec("npm cache clean --force")
  }
  else {
    
    console.log('Unknown command, try again.');
  }

