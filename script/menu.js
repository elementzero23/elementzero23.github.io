class Menu {
    constructor(editor) {
        this.editor = editor
    }

    new() {
        this.openSaveDialog()
        this.editor.reset()
    }

    open() {

    }

    export() {
        var pixels = this.editor.getPixels()

        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(pixels)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'tile.json';
        a.click();
    }

    openSaveDialog() {

    }

    showHelpPage() {

    }

    showAboutPage() {
        
    }
}