document.addEventListener('DOMContentLoaded', init)

let canvas, ctx
let editor

let isMousedown

let menu
let mouseoutSubmenuFile

function init() {
    init_editor()
    init_menu()
    init_tools()
    init_tiles()
}

function interact(ev) {
    var tileX = parseInt(ev.offsetX / 32)
    var tileY = parseInt(ev.offsetY / 32)
    editor.interact(tileX, tileY)
}

function init_editor() {
    editor = new Editor()

    document.getElementById('editor-tiles').addEventListener('mousedown', (ev) => {
        isMousedown = true
        interact(ev)
    })

    document.getElementById('editor-tiles').addEventListener('mouseup', () => {
        isMousedown = false
    })

    document.getElementById('editor-tiles').addEventListener('mousemove', (ev) => {
        if (isMousedown) {
            interact(ev)
        }
    })

    Array.from(document.getElementsByClassName('editor-controls-color')).forEach((element) => {
        element.addEventListener('click', (ev) => {
            ev.preventDefault()
            if (ev.button == 0) {
                editor.setLColor(ev.target.dataset.color)
            } else if (ev.button == 2) {
                editor.setRColor(ev.target.dataset.color)
            }
        })
    })
}

function init_menu() {
    menu = new Menu(editor)

    document.getElementById('menu-file').addEventListener('click', () => {
        document.getElementById('submenu-file').style.display = 'block'
    })

    document.getElementById('submenu-file').addEventListener('mouseleave', () => {
        document.getElementById('submenu-file').style.display = 'none'
    })

    document.getElementById('submenu-file-new').addEventListener('click', () => {
        menu.new()
    })

    document.getElementById('submenu-file-export').addEventListener('click', () => {
        menu.export()
    })
}

function init_tools() {
    Array.from(document.getElementsByClassName('tools-button')).forEach((element) => {
        element.addEventListener('click', (ev) => {
            document.getElementsByClassName('tools-button-active')[0].classList.remove('tools-button-active')
            element.classList.add('tools-button-active')
            editor.setTool(element.dataset.tool)
        })
    })
}

function init_tiles() {
    var tilesDiv = document.getElementById('tiles')
    for (var i = 0; i < 128; i++) {
        var tileContainer = document.createElement('div')
        tileContainer.classList.add('single-tile-container')
        tileContainer.dataset.tilenumber = i
        var tilenumber = document.createElement('div')
        tilenumber.classList.add('single-tile-number')
        tilenumber.innerHTML = i
        tileContainer.append(tilenumber)
        var tile = document.createElement('canvas')
        tile.classList.add('single-tile')
        tile.id = 'tile-'+i
        tile.width = 32
        tile.height = 32
        tileContainer.append(tile)
        tilesDiv.append(tileContainer)
    }
    document.getElementsByClassName('single-tile-container')[0].classList.add('single-tile-container-active')

    Array.from(document.getElementsByClassName('single-tile-container')).forEach((element) => {
        element.addEventListener('click', (ev) => {
            document.getElementsByClassName('single-tile-container-active')[0].classList.remove('single-tile-container-active')
            element.classList.add('single-tile-container-active')
            editor.setActiveTile(element.dataset.tilenumber)
        })
    })
}