'use strict'

// Pieces Types
const PAWN_BLACK = '♟'
const ROOK_BLACK = '♜'
const KNIGHT_BLACK = '♞'
const BISHOP_BLACK = '♝'
const QUEEN_BLACK = '♛'
const KING_BLACK = '♚'
const PAWN_WHITE = '♙'
const ROOK_WHITE = '♖'
const KNIGHT_WHITE = '♘'
const BISHOP_WHITE = '♗'
const QUEEN_WHITE = '♕'
const KING_WHITE = '♔'

// The Chess Board
var gBoard
var gSelectedElCell = null

function onRestartGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    // build the board 8 * 8
    var board = []
    for (var i = 0; i < 8; i++) {
        board[i] = []
        for (var j = 0; j < 8; j++) {
            board[i][j] = ''
            if (i === 1) board[i][j] = PAWN_BLACK
            else if (i === 6) board[i][j] = PAWN_WHITE
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK
    board[0][1] = board[0][6] = KNIGHT_BLACK
    board[0][2] = board[0][5] = BISHOP_BLACK
    board[0][3] = QUEEN_BLACK
    board[0][4] = KING_BLACK

    board[7][0] = board[7][7] = ROOK_WHITE
    board[7][1] = board[7][6] = KNIGHT_WHITE
    board[7][2] = board[7][5] = BISHOP_WHITE
    board[7][3] = QUEEN_WHITE
    board[7][4] = KING_WHITE

    // console.table(board)
    console.log(board)
    return board

}

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        strHtml += '<tr>'
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black'
            var tdId = `cell-${i}-${j}`
            strHtml += `<td id="${tdId}" onclick="cellClicked(this)"
            class="${className}">${cell}</td>`
        }
        strHtml += '</tr>'
    }
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function cellClicked(elCell) {
    // console.log('elCell', elCell)
    // console.log('gSelectedElCell', gSelectedElCell)
    // console.log('elCell.id', elCell.id)

    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard()
        return
    }

    cleanBoard()

    elCell.classList.add('selected')
    gSelectedElCell = elCell

    var cellCoord = getCellCoord(elCell.id)
    // console.log('cellCoord', cellCoord)
    var piece = gBoard[cellCoord.i][cellCoord.j]
    // console.log('piece', piece)

    var possibleCoords = []
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord)
            break
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord)
            break
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord)
            break
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE)
            break

    }
    markCells(possibleCoords)
}

function movePiece(elFromCell, elToCell) {
    // console.log('elFromCell', elFromCell)
    // console.log('elToCell', elToCell)
    // use: getCellCoord to get the coords, move the piece
    var fromCoord = getCellCoord(elFromCell.id)
    var toCoord = getCellCoord(elToCell.id)
    // console.log('fromCoord', fromCoord)
    // console.log('toCoord', toCoord)
    // update the MODEl
    var piece = gBoard[fromCoord.i][fromCoord.j]
    gBoard[toCoord.i][toCoord.j] = piece
    gBoard[fromCoord.i][fromCoord.j] = ''

    // update the DOM
    elToCell.innerText = piece
    elFromCell.innerText = ''
}

function markCells(coords) {
    // console.log('coords', coords)
    // query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i] // {i: 5, j: 2}
        // console.log('coord', coord)
        var selector = getSelector(coord) // #cell-5-2
        // console.log('selector', selector)
        var elCell = document.querySelector(selector)
        // console.log('elCell', elCell)
        elCell.classList.add('mark')
    }
}

// Gets a string such as: 'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-') // ['cell' , '2' , '7']
    coord.i = +parts[1] // 2
    coord.j = +parts[2] // 7
    return coord // {i:2, j:7}
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected')
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected')
    }
}

function getSelector(coord) {
    return `#cell-${coord.i}-${coord.j}`
}

function isEmptyCell(coord) {
    console.log('isempty', coord);
    return !gBoard[coord.i][coord.j]
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    // console.log('pieceCoord', pieceCoord)
    // console.log('isWhite', isWhite)
    var res = []
    // handle PAWN find the nextCoord use isEmptyCell()
    var diff = isWhite ? -1 : 1
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    // console.log('nextCoord', nextCoord)
    if (isEmptyCell(nextCoord)) res.push(nextCoord)
    else return res

    if (pieceCoord.i === 1 && !isWhite || pieceCoord.i === 6 && isWhite) {
        diff *= 2
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
        if (isEmptyCell(nextCoord)) res.push(nextCoord)
    }
    return res
}

function getAllPossibleCoordsRook(pieceCoord) {
    var res = []
    for (var i = pieceCoord.i - 1; i >= 0; i--) {
        var nextCoord = { i: i, j: pieceCoord.j }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }
    for (var i = pieceCoord.i + 1; i < 8; i++) {
        var nextCoord = { i: i, j: pieceCoord.j }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }
    for (var j = pieceCoord.j + 1; j < 8; j++) {
        var nextCoord = { i: pieceCoord.i, j: j }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }
    for (var j = pieceCoord.j - 1; j >= 0; j--) {
        var nextCoord = { i: pieceCoord.i, j: j }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }
    return res
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = []
    var i = pieceCoord.i - 1
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }
    i = pieceCoord.i - 1
    for (var idx = pieceCoord.j - 1; i >= 0 && idx < 8; idx--) {
        var coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }
    i = pieceCoord.i + 1
    for (var idx = pieceCoord.j - 1; i >= 0 && i < 8 && idx < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }
    i = pieceCoord.i + 1
    for (var idx = pieceCoord.j + 1; i >= 0 && i < 8 && idx < 8 && idx >= 0; idx++) {
        var coord = { i: i++, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }

    // TODO: 3 more directions - the Bishop
    return res
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = []
    var jDiff = 1
    for (var i = 0; i < 2; i++) {
        var coord = { i: pieceCoord.i + 2, j: pieceCoord.j + jDiff }
        jDiff = -jDiff
        if (coord.i > 7 || coord.j > 7 || coord.i < 0 || pieceCoord.j < 0) continue
        if (!isEmptyCell(coord)) continue
        res.push(coord)
    }
    for (var i = 0; i < 2; i++) {
        var coord = { i: pieceCoord.i - 2, j: pieceCoord.j + jDiff }
        jDiff = -jDiff
        if (coord.i > 7 || coord.j > 7 || coord.i < 0 || pieceCoord.j < 0) continue
        if (!isEmptyCell(coord)) continue
        res.push(coord)
    }
    for (var i = 0; i < 2; i++) {
        var coord = { i: pieceCoord.i + jDiff, j: pieceCoord.j + 2 }
        jDiff = -jDiff
        if (coord.i > 7 || coord.j > 7 || coord.i < 0 || pieceCoord.j < 0) continue
        if (!isEmptyCell(coord)) continue
        res.push(coord)
    }
    for (var i = 0; i < 2; i++) {
        var coord = { i: pieceCoord.i + jDiff, j: pieceCoord.j - 2 }
        jDiff = -jDiff
        if (coord.i > 7 || coord.j > 7 || coord.i < 0 || pieceCoord.j < 0) continue
        if (!isEmptyCell(coord)) continue
        res.push(coord)
    }
    console.log(res);
    return res
}
