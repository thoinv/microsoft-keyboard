/**
 * Before runing the simulator you will have to manually run "npm build" so that the latest
 * js file is compiled. XCode consumes the state of the js file when you start the XCode build process. Additionally,
 * make sure to include the updated js file in your changes so that the build machines have it.
 */
const editorInstanceName = "editorInstance";
let guppy;
/** Safe wrapper for post message */
const myPostMessage = (event, data) => {
    const message = JSON.stringify({ event: event, data: data });
    if (window && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(message);
    }
};
/** When the page loads, looks at a few signals to update the theme */
const detectColorScheme = () => {
    var theme = "light";
    if (localStorage.getItem("theme") &&
        localStorage.getItem("theme") === "dark") {
        theme = "dark";
    }
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
    }
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
};
/** Updates the DOM to change the theme of the page. Called by native code */
const applyTheme = (theme) => {
    if (theme === "light") {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    else if (theme === "dark") {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
};
/** Tells the native code to search for the expression */
const sendSearchMessage = () => {
    processSystemsOfEquationsBeforeSubmit();
    myPostMessage("#SEARCH", guppy.latex());
};
/** Keyboard button function to insert a simple string */
window.editorInsertString = (value) => {
    guppy.activate();
    guppy.engine.insert_string(value);
    guppy.render(true);
};
/**  Removes blank nodes from the syntax tree*/
const removeBlanks = (node) => {
    if (node === "blank") {
        return undefined;
    }
    if (!Array.isArray(node)) {
        return node;
    }
    for (let i = node.length - 1; i >= 0; i--) {
        const child = node[i];
        const newChild = removeBlanks(child);
        if (newChild === undefined) {
            node.splice(i, 1);
        }
    }
    if (node.length === 0) {
        return undefined;
    }
    return node;
};
/** Mapping of system of equation functions to determine next function for enter key */
const equationSystemFunctions = {
    esone: { nextFunc: "estwo", count: 1 },
    estwo: { nextFunc: "esthree", count: 2 },
    esthree: { nextFunc: "esfour", count: 3 },
    esfour: { nextFunc: "esfive", count: 4 },
    esfive: { nextFunc: "essix", count: 5 },
    essix: { nextFunc: "esseven", count: 6 },
    esseven: { nextFunc: "eseight", count: 7 },
    eseight: { nextFunc: "esnine", count: 8 },
    esnine: { nextFunc: "esten", count: 9 },
    esten: { count: 10 }
};
/**
 * If the current state of the input field is a system of equations, this function removes
 * all of the empty lines. Because the keyboard doesn't support deleteing lines, this will
 * make a partial system valid for the solver.
 */
const processSystemsOfEquationsBeforeSubmit = () => {
    try {
        let syntaxTree = JSON.parse(guppy.syntax_tree());
        syntaxTree = removeBlanks(syntaxTree);
        let didChange = false;
        if (syntaxTree &&
            syntaxTree.length > 1 &&
            Object.keys(equationSystemFunctions).indexOf(syntaxTree[0]) > -1) {
            // The input is a system of equations. Remove empty lines by downgrading the function to a lesser system
            if (Array.isArray(syntaxTree[1])) {
                const count = syntaxTree[1].length;
                for (const k in equationSystemFunctions) {
                    if (equationSystemFunctions[k].count === count) {
                        didChange = syntaxTree[0] !== k;
                        syntaxTree[0] = k;
                    }
                }
            }
            if (didChange) {
                guppy.import_syntax_tree(syntaxTree);
            }
        }
    }
    catch (e) { }
};
/** Creates a system of equations or adds another line to it */
const enter = () => {
    guppy.activate();
    // An empty system with two rows
    const emptyTwoRows = ["estwo"];
    let syntaxTree;
    let moveCursorSecondTime = false;
    try {
        syntaxTree = JSON.parse(guppy.syntax_tree());
    }
    catch (e) {
        return;
    }
    syntaxTree = removeBlanks(syntaxTree);
    if (syntaxTree && syntaxTree.length > 0) {
        if (syntaxTree[0] === "blank") {
            // The tree is empty
            syntaxTree = emptyTwoRows;
            moveCursorSecondTime = true;
        }
        else if (equationSystemFunctions[syntaxTree[0]]) {
            // The tree is already a system of equations. Increase the number of rows
            if (!equationSystemFunctions[syntaxTree[0]].nextFunc) {
                // It's already 10 equations and we don't support more
                return;
            }
            syntaxTree[0] = equationSystemFunctions[syntaxTree[0]].nextFunc;
        }
        else {
            // The tree is some expression. Make it the first row of a new system.
            syntaxTree = ["estwo", [syntaxTree]];
        }
    }
    else {
        syntaxTree = emptyTwoRows;
        moveCursorSecondTime = true;
    }
    try {
        guppy.import_syntax_tree(syntaxTree);
    }
    catch (e) {
    }
    guppy.engine.end();
    guppy.engine.left();
    if (moveCursorSecondTime) {
        guppy.engine.left();
    }
    guppy.render(true);
};
window.enterDerivativeXSymbol = () => {
    guppy.activate();
    guppy.engine.insert_symbol("derivX");
    guppy.engine.right();
    guppy.render(true);
};
window.editorInsertSymbol = (value) => {
    guppy.activate();
    guppy.engine.insert_symbol(value);
    guppy.render(true);
};
window.editorSetContent = (value) => {
    guppy.activate();
    guppy.engine.set_content(value);
    guppy.render(true);
};
window.editorUndo = () => {
    guppy.activate();
    guppy.engine.undo();
    guppy.render(true);
};
window.editorRedo = () => {
    guppy.activate();
    guppy.engine.redo();
    guppy.render(true);
};
window.editorLeft = () => {
    guppy.activate();
    guppy.engine.left();
    guppy.render(true);
};
const editorRight = () => {
    guppy.activate();
    guppy.engine.right();
    guppy.render(true);
};
window.editorBackspace = () => {
    guppy.activate();
    guppy.engine.backspace();
    guppy.render(true);
};
window.enterPower = (value) => {
    var shouldMoveCursorRight = false;
    var currentNodeValue = guppy.engine.getCurrentNodeValue();
    if (currentNodeValue.trim() !== "" && currentNodeValue.match(/[0-9.]+$|[a-zA-Z]$/)) {
        shouldMoveCursorRight = true;
    }
    guppy.activate();
    guppy.engine.insert_symbol(value);
    if (shouldMoveCursorRight) {
        editorRight();
    }
    guppy.render(true);
};
const editorOnChange = () => {
    setTimeout(function () {
        myPostMessage("#EDITOR_CHANGE", guppy.latex().trim());
    }, 50);
    // var a = document.getElementsByClassName("main_cursor")[0];
    // if (a && !!a.offset & !!a.offset() && a.offset().left) {
    //     document.getElementById(editorInstanceName).scrollLeft = 0;
    //     document.getElementById(editorInstanceName).scrollLeft = a.offset().left;
    // }
    var editorAccessibleText = rendera11ystring(Guppy(editorInstanceName).latex());
    const editorContainer = document.getElementsByClassName("editorContainer")[0];
    if (editorContainer) {
        editorContainer.setAttribute("aria-label", editorAccessibleText);
    }
};
const keyHandler = (e) => {
    // shift + enter to create new line
    if ((e.keyCode === 13 || e.which === 13) && e.shiftKey) {
        enter();
    }
};
window.onload = () => {
    detectColorScheme();
    guppy = new Guppy(editorInstanceName);
    guppy.event("change", editorOnChange);
    guppy.event("done", sendSearchMessage);
    document.addEventListener("keydown", keyHandler);
    /** Update the editor with latex when user taps on edit button */
    document.addEventListener("message", (event) => {
        guppy.activate();
        guppy.import_latex(event.data);
        guppy.engine.end();
        guppy.render(true);
    });
    /** Update the theme when it's updated by native */
    document.addEventListener("theme", (event) => {
        applyTheme(event.data);
    });
    /** */
    document.addEventListener("editorHeight", (event) => {
        document.getElementsByClassName("mathjax-editor-display")[0].style.height = event.data + "px";
    });
    setTimeout(() => {
        // Tell native that the webview is ready for messages
        myPostMessage("#EDITOR_IS_READY", "");
    }, 50);
    setTimeout(() => {
        // Focus guppy so the physical keyboard can type
        guppy.activate();
    }, 200);
};

//# sourceMappingURL=keyboard.js.map
