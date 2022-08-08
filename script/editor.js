class Editor {
    constructor() {
        this.ctx = document.getElementById('editor-tiles').getContext('2d')
        this.ctxPreviewMulti = document.getElementById('editor-preview-multiple').getContext('2d')
        this.ctxPreviewSmall = document.getElementById('editor-preview').getContext('2d')
        if (document.cookie.length > 0) {
            console.log(document.cookie)
            this.pixels = JSON.parse(document.cookie.split(';')[0])
        } else {
            console.log('no cookies set')
            this.pixels = []
            for (var j = 0; j < 128; j++) {
                this.pixels[j] = []
                for (var i = 0; i < 64; i++) {
                    this.pixels[j][i] = 0
                }
            }
            
        }
        this.activeTile = 0;
        this.LColor = 0
        this.RColor = 0
        this.tool = 'paint'
        this.drawGrid()

        // for flood fill
        this.pixelsVisited
    }

    reset() {
        for (var i = 0; i < 64; i++) {
            this.pixels[this.activeTile][i] = 0
        }
        this.uppdateCanvas()
    }

    /**
     * (Re-)draws the whole grid.
     */
    drawGrid() {
        this.ctx.lineWidth = 0.5
        this.ctx.strokeStyle = "#000000"

        for (var i = 0; i <= 8; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(i*32, 0)
            this.ctx.lineTo(i*32, 256)
            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.moveTo(0, i*32)
            this.ctx.lineTo(256, i*32)
            this.ctx.stroke()
        }
    }

    uppdateCanvas() {
        this.ctx.clearRect(0, 0, 256, 256)
        for (var i = 0; i < 64; i++) {
            this.ctx.fillStyle = this.getHexColor(this.pixels[this.activeTile][i])
            this.ctx.fillRect((i%8)*32, (parseInt(i/8)*32), 32, 32)
        }
        this.drawGrid()

        this.ctxPreviewMulti.clearRect(0, 0, 64, 64)
        for (var i = 0; i < 64; i++) {
            this.ctxPreviewMulti.fillStyle = this.getHexColor(this.pixels[this.activeTile][i])
            for (var j = 0; j < 16; j++) {
                this.ctxPreviewMulti.fillRect((i%8)*4+32*parseInt(j/4), (parseInt(i/8)*4+32*(j%4)), 4, 4)
            }
        }

        this.ctxPreviewSmall.clearRect(0, 0, 32, 32)
        for (var i = 0; i < 64; i++) {
            this.ctxPreviewSmall.fillStyle = this.getHexColor(this.pixels[this.activeTile][i])
            this.ctxPreviewSmall.fillRect((i%8)*4, (parseInt(i/8)*4), 4, 4)
        }

        this.updateActiveTile()

        /*
        const d = new Date();
        d.setTime(d.getTime() + 24*60*60*1000);
        let expires = "expires="+ d.toUTCString();
        console.log('pixels=[' + this.pixels + '];' + expires + ';path=/')
        document.cookie = 'pixels=[' + this.pixels + '];' + expires + ';path=/'
        */
    }

    updateActiveTile() {
        var ctxActiveTile = document.getElementById('tile-'+this.activeTile).getContext('2d')
        ctxActiveTile.clearRect(0, 0, 32, 32)
        for (var i = 0; i < 64; i++) {
            ctxActiveTile.fillStyle = this.getHexColor(this.pixels[this.activeTile][i])
            ctxActiveTile.fillRect((i%8)*4, (parseInt(i/8)*4), 4, 4)
        }
    }

    /**
     * Interacts with a single tile, either to paint it or to flood fill.
     * 
     * @param {*} x 
     * @param {*} y 
     */
    interact(x, y) {
        if (this.tool == 'paint') {
            this.paintTile(x,y)
        }
        if (this.tool == 'fill') {
            this.floodFill(x, y)
        }
    }

    /**
     * Paints a single tile in LColor.
     * 
     * @param {*} x 
     * @param {*} y 
     */
    paintTile(x, y) {
        this.pixels[this.activeTile][x+y*8] = this.LColor
        this.uppdateCanvas()
    }

    /**
     * Fills recursively the starting pixel (x, y) and each conneted pixel of the same color as the starting pixel.
     * 
     * @param {*} x 
     * @param {*} y 
     */
    floodFill(x, y) {
        this.pixelsVisited = []
        for (var i = 0; i < 64; i++) {
            this.pixelsVisited[i] = false
        }
        this.pixelsVisited[x+y*8] = true
        this.floodFillRec(x, y, this.pixels[this.activeTile][x+y*8], this.LColor)
    }

    floodFillRec(x, y, oldColor, color) {
        this.pixelsVisited[x+y*8] = true
        this.pixels[this.activeTile][x+y*8] = color
        if (x > 0 && this.pixels[this.activeTile][x-1+y*8] == oldColor && !this.pixelsVisited[x-1+y*8]) {
                this.pixels[this.activeTile][x-1+y*8] = color
                this.floodFillRec(x-1, y, oldColor, color)
        }
        if (x < 7 && this.pixels[this.activeTile][x+1+y*8] == oldColor && !this.pixelsVisited[x+1+y*8]) {
            this.pixels[this.activeTile][x+1+y*8] = color
            this.floodFillRec(x+1, y, oldColor, color)
        }
        if (y > 0 && this.pixels[this.activeTile][x+(y-1)*8] == oldColor && !this.pixelsVisited[x+(y-1)*8]) {
            this.pixels[this.activeTile][x+(y-1)*8] = color
            this.floodFillRec(x, y-1, oldColor, color)
        }
        if (y < 7 && this.pixels[this.activeTile][x+(y+1)*8] == oldColor && !this.pixelsVisited[x+(y+1)*8]) {
            this.pixels[this.activeTile][x+(y+1)*8] = color
            this.floodFillRec(x, y+1, oldColor, color)
        }
        this.uppdateCanvas()
    }

    getHexColor(color) {
        if (color == 3)
            return '#000000'
        if (color == 2)
            return '#808080'
        if (color == 1)
            return '#c0c0c0'
        return '#ffffff'
    }

    setLColor(color) {
        this.LColor = color
        var LColorElement = document.getElementById('editor-controls-L-value')
        LColorElement.style.backgroundColor = this.getHexColor(color)
        if (color == 3) LColorElement.style.color = '#ffffff'; else LColorElement.style.color = '#000000'
        LColorElement.innerHTML = color
    }

    /**
     * Not working yet!
     * 
     * @param {*} color 
     */
    setRColor(color) {
        this.RColor = color
    }

    /**
     * Sets the current tool.
     * Permitted values are:
     *  - 'paint'
     *  - 'fill'
     * 
     * @param {*} tool 
     */
    setTool(tool) {
        this.tool = tool
    }

    setActiveTile(number) {
        this.activeTile = number
        this.uppdateCanvas()
    }

    getPixels() {
        return this.pixels
    }
}