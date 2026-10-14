

const HELP_ICON_SVG = '<svg class="icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true"><path d="M8 1C5.419 1 2.75 2.964 2.75 6.25C2.75 8.167 3.637 9.184 4.224 9.856C4.408 10.067 4.598 10.285 4.628 10.398L5.568 13.889C5.744 14.543 6.34 14.999 7.017 14.999H8.984C9.662 14.999 10.257 14.542 10.432 13.889L11.372 10.397C11.402 10.285 11.593 10.067 11.776 9.856C12.363 9.183 13.25 8.167 13.25 6.25C13.25 3.355 10.895 1 8 1ZM9.467 13.63C9.408 13.848 9.209 14 8.984 14H7.017C6.791 14 6.593 13.848 6.534 13.63L6.095 12H9.906L9.467 13.63ZM11.022 9.199C10.741 9.522 10.497 9.802 10.407 10.137L10.175 10.999H5.826L5.594 10.138C5.503 9.801 5.26 9.522 4.977 9.199C4.43 8.572 3.75 7.792 3.75 6.25C3.75 3.59 5.911 2 8 2C10.344 2 12.25 3.907 12.25 6.25C12.25 7.792 11.569 8.572 11.022 9.199Z"/></svg>';

let WHO_IS_PLAYING_NOW = 'player1'
let DICE_FACE_POINT = 0
let IS_CONTINUE = false
let IS_DICE_LOCKED = false
let LOGGER_MESSAGE_LEVEL = 'IWE'
let GAME_PROGRESS_DATA_KEY = 'ASLUDOSAVEDATA'
let GAME_PROGRESS_DATA_VALUE = ''
let WINNER_LIST = ''
let PLAYER_NAME = {}

let DEBUG_ENABLED = false
let DEBUG_SHOW_CELLNUMBER = true;
let DEBUG_DICE_FACE_OVERRIDE = 6;

const PLAYER_LIST = ['player1', 'player2', 'player3', 'player4']

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const APP_KEY = 'webgame_ludoBuddy'
const APP_VERSION = '001.001'
const boardHomePlayer1 = document.querySelector('#boardHomePlayer1');
const boardHomePlayer2 = document.querySelector('#boardHomePlayer2');
const boardHomePlayer3 = document.querySelector('#boardHomePlayer3');
const boardHomePlayer4 = document.querySelector('#boardHomePlayer4');
const boardPathPlayer1 = document.querySelector('#boardPathPlayer1');
const boardPathPlayer2 = document.querySelector('#boardPathPlayer2');
const boardPathPlayer3 = document.querySelector('#boardPathPlayer3');
const boardPathPlayer4 = document.querySelector('#boardPathPlayer4');
const BOARD_HOME = {
  player1: boardHomePlayer1,
  player2: boardHomePlayer2,
  player3: boardHomePlayer3,
  player4: boardHomePlayer4,
}
const BOARD_PATH = {
  player1: boardPathPlayer1,
  player2: boardPathPlayer2,
  player3: boardPathPlayer3,
  player4: boardPathPlayer4,
}
const boardDiceRollerDice = document.querySelector('#boardDiceRoller .boardDice');
const alertContainer = document.querySelector('#alertContainer');
const btnShare = document.querySelector('#btnShare');
const btnHelp = document.querySelector('#btnHelp');
const btnSettings = document.querySelector('#btnSettings');

const modalApi = Buddy.modal.init();
const openModal = modalApi.open;
const closeModal = modalApi.close;
function openSettingsModal() {
  Buddy.settings.open(APP_KEY, openModal, closeModal, { appVersion: APP_VERSION })
}

function openHelpModal() {
  const html =
    '<div class="modal-message">' +
    '<ul class="help-list">' +
    '<li>Take turns rolling the dice — roll a 6 to bring a coin out of home and onto the board.</li>' +
    '<li>Move a coin forward by the number rolled. Land exactly on the last cell of your path to bring it home.</li>' +
    '<li>Land on an opponent&rsquo;s coin to send it back to their home — except on a starred safe cell, where coins can&rsquo;t be captured.</li>' +
    '<li>Rolling a 6, capturing a coin, or getting a coin all the way home earns you another roll.</li>' +
    '<li>Get all 4 of your coins home to finish. The first three players to finish take gold, silver, and bronze.</li>' +
    '</ul>' +
    '</div>' +
    '<div class="modal-actions">' +
    '<button type="button" class="btn btn-primary" id="btnCloseHelp">Got it</button>' +
    '</div>';

  openModal('How to Play', html, function (body) {
    body.querySelector('#btnCloseHelp').addEventListener('click', closeModal);
  }, { autoSize: true });
}

const NICKNAME_MAX_LENGTH = 10
function limitNicknameLength(e) {
  logger('D', 'LUDO_D_099 ', 'Function - limitNicknameLength')
  const el = e.target
  if (el.innerText.length <= NICKNAME_MAX_LENGTH) {
    return
  }
  el.innerText = el.innerText.slice(0, NICKNAME_MAX_LENGTH)
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

function blockNicknameEnterKey(e) {
  if (e.key !== 'Enter') {
    return
  }
  logger('D', 'LUDO_D_099 ', 'Function - blockNicknameEnterKey')
  e.preventDefault()
  e.target.blur()
}

function getPlayerName() {
  logger('I', 'LUDO_D_099 ', 'Function - getPlayerName')
  PLAYER_LIST.forEach((p) => {
    let name = BOARD_HOME[p].querySelector('.boardHomeNickName').innerText.trim().replace(/\n/g, ' ')
    PLAYER_NAME[p] = name == '' ? ('Player ' + p.slice(-1)) : name
  })
}

function setPlayerName() {
  logger('I', 'LUDO_D_099 ', 'Function - setPlayerName')
  PLAYER_LIST.forEach((p) => {
    BOARD_HOME[p].querySelector('.boardHomeNickName').innerText = PLAYER_NAME[p]
  })
}

function rollDice() {
  logger('D', 'LUDO_D_099 ', 'Function - rollDice')
  if (IS_DICE_LOCKED) {
    showAlert('Hey ' + PLAYER_NAME[WHO_IS_PLAYING_NOW] + '! First move your coin', 'info')
    return
  }
  if (WINNER_LIST.trim().length == 4) {
    showAlert('ALL DONE', 'info')
    return
  }
  setDiceColor()
  DICE_FACE_POINT = Math.floor(Math.random() * 6 + 1);
  if (DEBUG_ENABLED) {
    DICE_FACE_POINT = DEBUG_DICE_FACE_OVERRIDE;
  }
  if (DICE_FACE_POINT == 6) {
    IS_CONTINUE = true
  } else {
    IS_CONTINUE = false
  }
  boardDiceRollerDice.classList = 'boardDice'
  setTimeout(function() {
    boardDiceRollerDice.classList.add("roll-face" + DICE_FACE_POINT);
  },1);
  logger('D', 'LUDO_I_001 ', 'Who - ' + PLAYER_NAME[WHO_IS_PLAYING_NOW] + ' / boardDice Face - ' + DICE_FACE_POINT)
  toggleDiceLock()








  setTimeout(activateCoin, 50)
}

function toggleDiceLock() {
  logger('D', 'LUDO_D_099 ', 'Function - toggleDiceLock')
  IS_DICE_LOCKED = !IS_DICE_LOCKED
  boardDiceRollerDice.classList.toggle('lock')
  logger('D', 'LUDO_I_002 ', 'boardDice Locked = ' + IS_DICE_LOCKED)
}

function refreshCell(pathCell) {
  logger('D', 'LUDO_D_099 ', 'Function - refreshCell')
  let player1Coin = parseInt(pathCell.dataset.coinPlayer1)
  let player2Coin = parseInt(pathCell.dataset.coinPlayer2)
  let player3Coin = parseInt(pathCell.dataset.coinPlayer3)
  let player4Coin = parseInt(pathCell.dataset.coinPlayer4)
  let totalCoin = player1Coin + player2Coin + player3Coin + player4Coin
  let displayCount = ''
  if (totalCoin > 0) {
    if (totalCoin > 1 && ((totalCoin - player1Coin == 0) || (totalCoin - player2Coin == 0) || (totalCoin - player3Coin == 0) || (totalCoin - player4Coin == 0))) {
      displayCount = totalCoin
    }
    pathCell.innerHTML = '<span class="boardPathCoin" style="' +
        '--player1Coin:' + (player1Coin / totalCoin * 100).toFixed(2) + '%; ' +
        '--player2Coin:' + (player2Coin / totalCoin * 100).toFixed(2) + '%; ' +
        '--player3Coin:' + (player3Coin / totalCoin * 100).toFixed(2) + '%; ' +
        '--player4Coin:' + (player4Coin / totalCoin * 100).toFixed(2) + '%;' +
        '">' + displayCount +
      '</span>'
  } else {
    pathCell.innerHTML = ''
  }
}

function showCellNumber() {
  logger('D', 'LUDO_D_099 ', 'Function - showCellNumber')
  if (!DEBUG_SHOW_CELLNUMBER || !DEBUG_ENABLED) {
    return
  }
  PLAYER_LIST.forEach((p) => {
    let i = 0
    BOARD_PATH[p].querySelectorAll('.boardPartCell').forEach(e => {
      i++
      if (e.innerHTML == '') {
        e.innerHTML = p.slice(-1) + '.' + i.toString().padStart(2, '0')
      }
    });
  })
}

function activateCoin() {
  logger('D', 'LUDO_D_099 ', 'Function - activateCoin')
  deactivateCoin();
  let noValidMove = true
  const current = WHO_IS_PLAYING_NOW
  const suffix = capitalize(current)

  document.querySelectorAll('.boardPathCoin').forEach((e) => {
    let newE = e.cloneNode(true);
    if (parseInt(e.parentElement.dataset['coin' + suffix]) > 0) {
      let nextPosition = checkCoinNext(parseInt(e.parentElement.dataset['path' + suffix]));
      if (nextPosition > 0) {
        noValidMove = false
        newE.classList.add('active')
        newE.addEventListener('click', (x) => {
          moveCoinNext(newE, nextPosition)
          toggleDiceLock()
          deactivateCoin()
          moveUserNext()
          showCellNumber()
        })
      } else {
        newE.addEventListener('click', (e) => {showAlert('No valid move for point ' + DICE_FACE_POINT, 'failed')})
      }
    } else {
      newE.addEventListener('click', (e) => {showAlert('Hey ' + PLAYER_NAME[current] + '! This is not your coin', 'failed')})
    }
    e.parentElement.replaceChild(newE, e)
  });

  BOARD_HOME[current].querySelectorAll('.boardHomeCoin:not(.done)').forEach((e) => {
    let newE = e.cloneNode(true);
    let nextPosition = checkCoinNext(0);
    if (nextPosition > 0) {
      noValidMove = false
      newE.classList.add('active')
      newE.addEventListener('click', (x) => {
        moveCoinNext(newE, nextPosition)
        toggleDiceLock()
        deactivateCoin()
        moveUserNext()
        showCellNumber()
      })
    } else {
      newE.addEventListener('click', (e) => {showAlert('No valid move for point ' + DICE_FACE_POINT, 'failed')})
    }
    e.parentElement.replaceChild(newE, e)
  });

  PLAYER_LIST.filter((p) => p !== current).forEach((p) => {
    BOARD_HOME[p].querySelectorAll('.boardHomeCoin').forEach((e) => {
      let newE = e.cloneNode(true);
      newE.addEventListener('click', (e) => {showAlert('Hey ' + PLAYER_NAME[current] + '! This is not your coin', 'failed')})
      e.parentElement.replaceChild(newE, e)
    });
  });

  if(noValidMove) {
    IS_CONTINUE = false
    showAlert('Sorry ' + PLAYER_NAME[WHO_IS_PLAYING_NOW] + '! No valid move for ' + DICE_FACE_POINT + ', skip to next', 'info')
    deactivateCoin()
    toggleDiceLock()
    moveUserNext()
    showCellNumber()
    saveBoard()
  }
}

function deactivateCoin() {
  logger('D', 'LUDO_D_099 ', 'Function - deactivateCoin')
  document.querySelectorAll('.boardPathCoin').forEach((e) => {
    newE = e.cloneNode(true);
    newE.classList.remove('active');
    newE.addEventListener('click', (e) => {showAlert('Hey ' + PLAYER_NAME[WHO_IS_PLAYING_NOW] + '! Roll the dice first', 'failed')})
    e.parentElement.replaceChild(newE, e)
  });
  document.querySelectorAll('.boardHome span').forEach((e) => {
    newE = e.cloneNode(true);
    newE.classList.remove('active')
    if (newE.classList.contains('boardHomeCoin')) {
      if (newE.classList.contains('done')) {
        newE.addEventListener('click', (e) => {showAlert('This coin alredy completed it\'s cycle', 'info')})
      } else {
        newE.addEventListener('click', (e) => {showAlert('Hey ' + PLAYER_NAME[WHO_IS_PLAYING_NOW] + '! Roll the dice first', 'failed')})
      }
    }
    e.parentElement.replaceChild(newE, e)
  });
}

function setDiceColor() {
  logger('D', 'LUDO_D_099 ', 'Function - setDiceColor')
  setCssVariable('--board-boardDice-dot-color', getCssVariable('--' + WHO_IS_PLAYING_NOW + '-color'))
  setCssVariable('--board-boardDice-border-color', getCssVariable('--' + WHO_IS_PLAYING_NOW + '-color'))
  setCssVariable('--active-glow-color', getCssVariable('--' + WHO_IS_PLAYING_NOW + '-color'))
}

function getCssVariable(variable) {
  return window.getComputedStyle(document.body).getPropertyValue(variable);
}

function setCssVariable(variable, value) {
  document.documentElement.style.setProperty(variable, value);
}

function checkCoinNext(location) {
  logger('D', 'LUDO_D_099 ', 'Function - checkCoinNext');
  if (location == 0) {
    if (DICE_FACE_POINT == 6) {
      return 1
    }
  } else {
    if ((location + DICE_FACE_POINT) <= 57 ) {
      return location + DICE_FACE_POINT
    }
  }
  return -1;
}

function animateSlide(fromRect, toEl) {
  var reducedMotion = (window.Buddy && Buddy.theme) ? Buddy.theme.isMotionReduced() : window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fromRect || !toEl || reducedMotion) {
    return
  }
  const flipId = 'flip' + Date.now() + Math.random().toString(36).slice(2)
  toEl.dataset.flipId = flipId
  requestAnimationFrame(() => {
    const el = document.querySelector('[data-flip-id="' + flipId + '"]')
    if (!el) {
      return
    }
    const toRect = el.getBoundingClientRect()
    const dx = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2)
    const dy = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2)
    const duration = Math.min(.6, Math.max(.2, Math.hypot(dx, dy) / 1400))
    el.style.zIndex = 10
    el.style.transition = 'none'
    el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)'
    el.getBoundingClientRect()
    requestAnimationFrame(() => {
      el.style.transition = 'transform ' + duration + 's cubic-bezier(.22,1,.36,1)'
      el.style.transform = ''
      el.addEventListener('transitionend', () => {
        el.style.transition = ''
        el.style.zIndex = ''
        delete el.dataset.flipId
      }, { once: true })
    })
  })
}

function confettiColors() {
  return PLAYER_LIST.map((p) => getCssVariable('--' + p + '-color'))
}

function moveCoinNext(e, next) {
  logger('D', 'LUDO_D_099 ', 'Function - moveCoinNext')
  const current = WHO_IS_PLAYING_NOW
  const suffix = capitalize(current)
  const startRect = e.getBoundingClientRect()
  let nextCell;
  let homeSlot;
  if (!e.classList.contains('boardHomeCoin')) {
    e.parentElement.dataset['coin' + suffix] = parseInt(e.parentElement.dataset['coin' + suffix]) - 1;
  }
  if (next != 57) {
    nextCell = document.querySelector('[data-path-' + current + '="' + next + '"]')
    nextCell.dataset['coin' + suffix] = parseInt(nextCell.dataset['coin' + suffix]) + 1;
  } else {
    homeSlot = BOARD_HOME[current].querySelector('span:not(.boardHomeCoin):not(.done)')
    homeSlot.classList.add('boardHomeCoin', 'done')
  };
  if (e.classList.contains('boardHomeCoin')) {
    e.classList.remove('boardHomeCoin')
  } else {
    refreshCell(e.parentElement)
  }
  if (next != 57) {
    killOther(nextCell)
    refreshCell(nextCell)
    animateSlide(startRect, nextCell.querySelector('.boardPathCoin'))
  } else {
    animateSlide(startRect, homeSlot)
    Buddy.spawnConfetti(confettiColors())
    checkForWinner()
    showWinner()
    if (!WINNER_LIST.includes(current.slice(-1).toUpperCase())) {
      showAlert('Good work ' + PLAYER_NAME[current] + '! Your 1 coin maked completed', 'success')
      IS_CONTINUE = true
    } else {
      Buddy.spawnConfetti(confettiColors(), 160)
      switch (WINNER_LIST.indexOf(current.slice(-1).toUpperCase())) {
        case 0 :
          showAlert('WELL DONE ' + PLAYER_NAME[current] + '! Your won! 1st prize GOLD', 'success')
          break;
        case 1 :
          showAlert('WELL DONE ' + PLAYER_NAME[current] + '! Your won! 2nd prize SILVER', 'success')
          break;
        case 2 :
          showAlert('WELL DONE ' + PLAYER_NAME[current] + '! Your won! 3rd prize BRONZE', 'success')
          break;
      }
    }

  }
  saveBoard()
}

function killOther(cell) {
  logger('D', 'LUDO_D_099 ', 'Function - killOther')
  if (cell.classList.contains('stamp')) {
    return
  }
  const current = WHO_IS_PLAYING_NOW
  const startRect = cell.getBoundingClientRect()
  let msg = 'Good work ' + PLAYER_NAME[current] + '! You have killed'
  let totalKilled = 0
  PLAYER_LIST.filter((p) => p !== current).forEach((p) => {
    const suffix = capitalize(p)
    let coinCount = parseInt(cell.dataset['coin' + suffix])
    cell.dataset['coin' + suffix] = 0
    for (let i = 0; i < coinCount; i++) {
      let slot = BOARD_HOME[p].querySelector('span:not(.boardHomeCoin):not(.done)')
      slot.classList.add('boardHomeCoin')
      animateSlide(startRect, slot)
    }
    if (coinCount > 0) {
      totalKilled += coinCount
      if (coinCount == 1) {
        msg += ' 1 ' + PLAYER_NAME[p] + '\'s coin'
      } else {
        msg += ' ' + coinCount + ' ' + PLAYER_NAME[p] + '\'s coins'
      }
    }
  })
  if (totalKilled > 0) {
    IS_CONTINUE = true
    showAlert(msg, 'success')
    Buddy.spawnConfetti(confettiColors())
  }
}

function moveUserNext() {
  logger('D', 'LUDO_D_099 ', 'Function - moveUserNext')
  if (IS_CONTINUE) {
    return
  }
  if (WINNER_LIST.trim().length == 4) {
    showAlert('ALL DONE', 'info')
    return
  }
  PLAYER_LIST.forEach((p) => BOARD_HOME[p].classList.remove('active'))
  let nextIndex = (PLAYER_LIST.indexOf(WHO_IS_PLAYING_NOW) + 1) % PLAYER_LIST.length
  WHO_IS_PLAYING_NOW = PLAYER_LIST[nextIndex]
  BOARD_HOME[WHO_IS_PLAYING_NOW].classList.add('active')
  if (WINNER_LIST.trim().length != 4 && WINNER_LIST.includes(WHO_IS_PLAYING_NOW.slice(-1))) {
    moveUserNext()
  }
}

function logger(level, tag, message) {
  if (LOGGER_MESSAGE_LEVEL.indexOf(level) >= 0) {
    console.log(tag, ' : ', message)
  }
}

function buildProgressPayload() {
  logger('D', 'LUDO_D_099 ', 'Function - buildProgressPayload')
  let position = {}
  PLAYER_LIST.forEach((p) => {
    let pos = ''
    BOARD_HOME[p].querySelectorAll('span').forEach((e) => {
      if (e.classList.contains('boardHomeCoin')) {
        pos += e.classList.contains('done') ? '57' : '00'
      }
    })
    position[p] = pos
  })
  document.querySelectorAll('.boardPathCoin').forEach(e => {
    PLAYER_LIST.forEach((p) => {
      const suffix = capitalize(p)
      let coinCount = parseInt(e.parentNode.dataset['coin' + suffix])
      if (coinCount) {
        position[p] += e.parentNode.dataset['path' + suffix].padStart(2,'0').repeat(coinCount)
      }
    })
  });
  return {
    w: parseInt(WHO_IS_PLAYING_NOW.slice(-1)),
    p: PLAYER_LIST.map((p) => position[p]).join(''),
    win: WINNER_LIST.trim()
  }
}

function encodeProgress(payload) {
  return btoa(JSON.stringify(payload))
}

function decodeProgress(str) {
  try {
    return JSON.parse(atob(str))
  } catch (e) {
    return null
  }
}

function saveBoard() {
  logger('D', 'LUDO_D_099 ', 'Function - saveBoard')
  GAME_PROGRESS_DATA_VALUE = encodeProgress(buildProgressPayload())
  localStorage.setItem(GAME_PROGRESS_DATA_KEY, GAME_PROGRESS_DATA_VALUE)
}

function reloadBoard(data) {
  logger('D', 'LUDO_D_099 ', 'Function - reloadBoard')
  PLAYER_LIST.forEach((p) => BOARD_HOME[p].classList.remove('active'))
  PLAYER_LIST.forEach((p) => {
    BOARD_HOME[p].querySelectorAll('span').forEach((e) => {
      e.classList = ''
    });
  })
  document.querySelectorAll('.boardPathCoin').forEach(e => {
    e.parentNode.innerHTML = ''
  });
  PLAYER_LIST.forEach((player, playerIndex) => {
    const suffix = capitalize(player)
    for (let coin = 0; coin < 4; coin++) {
      let position = data.p.substring(playerIndex * 8 + coin * 2, playerIndex * 8 + coin * 2 + 2)
      let cell;
      if (position == '00' || position == '57') {
        cell = BOARD_HOME[player].querySelector('span:not(.boardHomeCoin)')
        cell.classList.add('boardHomeCoin')
        if (position == '57') {
          cell.classList.add('done')
        }
      } else {
        cell = document.querySelector('[data-path-' + player + '="' + parseInt(position) + '"]')
        cell.dataset['coin' + suffix] = parseInt(cell.dataset['coin' + suffix]) + 1
        refreshCell(cell)
      }
    }
  })
  WHO_IS_PLAYING_NOW = PLAYER_LIST[data.w - 1]
  BOARD_HOME[WHO_IS_PLAYING_NOW].classList.add('active');
  WINNER_LIST = data.win.padEnd(4, ' ')
}

function isValidProgressPayload(data) {
  if (!data || typeof data !== 'object') return false
  if (!Number.isInteger(data.w) || data.w < 1 || data.w > 4) return false
  if (typeof data.p !== 'string' || data.p.length !== 32 || !/^(([0-4][0-9])|5[0-7]){16}$/.test(data.p)) {
    logger('E', 'LUDO_E_099 ', 'Progress payload is not valid. Reason: position string is not matching [00-57]*16')
    return false
  }
  if (typeof data.win !== 'string' || data.win.length > 4 || !/^[1-4]*$/.test(data.win) || new Set(data.win).size !== data.win.length) {
    logger('E', 'LUDO_E_099 ', 'Progress payload is not valid. Reason: winner list is not a valid subset of 1-4')
    return false
  }

  let allHome = true
  for (let i = 0; i < 16; i++) {
    let seg = data.p.substring(i * 2, i * 2 + 2)
    if (seg != '00' && seg != '57') { allHome = false; break }
  }
  if (allHome && data.win.length == 0) {
    logger('E', 'LUDO_E_099 ', 'Progress payload is not valid. Reason: board is untouched, nothing to resume')
    return false
  }

  if (data.win.includes(String(data.w))) {
    logger('E', 'LUDO_E_099 ', 'Progress payload is not valid. Reason: active player ' + data.w + ' cant be a part of already winner ' + data.win)
    return false
  }

  for (let i = 0; i < 4; i++) {
    let playerDigit = String(i + 1)
    let playerPos = data.p.substring(i * 8, i * 8 + 8)
    if (playerPos != '57575757' && data.win.includes(playerDigit)) {
      logger('E', 'LUDO_E_099 ', 'Progress payload is not valid. Player' + playerDigit + ' alredy own coin outside')
      return false
    }
  }

  return true
}

function checkForWinner() {
  logger('D', 'LUDO_D_099 ', 'Function - checkForWinner')
  PLAYER_LIST.forEach((p) => {
    let doneCoins = BOARD_HOME[p].querySelectorAll('.boardHomeCoin.done').length
    let digit = p.slice(-1)
    if (doneCoins == 4 && !WINNER_LIST.includes(digit)) {
      WINNER_LIST = WINNER_LIST.trim() + digit
    }
  })
  WINNER_LIST = WINNER_LIST.trim().padEnd(4, ' ');
}

const WINNER_RANK_CLASS = ['winner1st', 'winner2nd', 'winner3rd']
function showWinner() {
  logger('D', 'LUDO_D_099 ', 'Function - showWinner')
  const trimmed = WINNER_LIST.trim()
  for (let i = 0; i < trimmed.length && i < WINNER_RANK_CLASS.length; i++) {
    let player = 'player' + trimmed.substring(i, i + 1)
    BOARD_HOME[player].classList = 'boardHome ' + WINNER_RANK_CLASS[i] + ' skip';
  }
}

const ALERT_ICONS = { success: 'checkCircle', info: 'alertTriangle', failed: 'xCircle' }
function showAlert(message, type) {
  logger('D', 'LUDO_D_099 ', 'Function - showAlert')
  const alertBox = document.createElement("div");
  alertBox.classList.add("alertBody", type);
  const icon = document.createElement("span");
  icon.className = "alertIcon";
  icon.innerHTML = Buddy.ICONS[ALERT_ICONS[type]] || ''
  const text = document.createElement("span");
  text.className = "alertText";
  text.textContent = message
  alertBox.appendChild(icon)
  alertBox.appendChild(text)
  setTimeout(function () {
    alertContainer.removeChild(alertBox);
  }, 4000);
  alertContainer.insertBefore(alertBox, alertContainer.firstChild)
}

function openLoadSaveModal(data) {
  logger('D', 'LUDO_D_099 ', 'Function - openLoadSaveModal')
  const html =
    '<p class="modal-message">We found a saved data on your system.<br>Do you want to load and start playing from last saved progress?</p>' +
    '<div class="modal-actions">' +
    '<button class="btn btn-ghost" id="loadSaveButtonNo">No</button>' +
    '<button class="btn btn-primary" id="loadSaveButtonYes">Yes</button>' +
    '</div>'
  openModal('Reload Saved Data?', html, function (body) {
    body.querySelector('#loadSaveButtonNo').addEventListener('click', () => {
      saveBoard()
      closeModal()
    })
    body.querySelector('#loadSaveButtonYes').addEventListener('click', () => {
      reloadBoard(data)
      deactivateCoin();
      checkForWinner();
      showWinner();
      closeModal()
      showAlert('Load success', 'success')
    })
  }, { autoSize: true, forceChoice: true })
}

function getProgressLink(e) {
  logger('D', 'LUDO_D_099 ', 'Function - getProgressLink')
  const payload = buildProgressPayload()
  if (isValidProgressPayload(payload)) {
    let saveProgressUrl = location.protocol + '//' + location.host + location.pathname + '?progress=' + encodeURIComponent(encodeProgress(payload))
    if (e.shiftKey) {
      if (PLAYER_NAME['player1'] != 'Player 1') {
        saveProgressUrl += '&p1=' + encodeURIComponent(PLAYER_NAME['player1'])
      }
      if (PLAYER_NAME['player2'] != 'Player 2') {
        saveProgressUrl += '&p2=' + encodeURIComponent(PLAYER_NAME['player2'])
      }
      if (PLAYER_NAME['player3'] != 'Player 3') {
        saveProgressUrl += '&p3=' + encodeURIComponent(PLAYER_NAME['player3'])
      }
      if (PLAYER_NAME['player4'] != 'Player 4') {
        saveProgressUrl += '&p4=' + encodeURIComponent(PLAYER_NAME['player4'])
      }
    }
    logger('D', 'Saved Progress URL : ' + saveProgressUrl);
    navigator.clipboard.writeText(saveProgressUrl)
    showAlert('Link has been copied to clipboard', 'success')
  } else {
    showAlert('No progress to share', 'failed')
  }
}

window.addEventListener('load', (e) => {
  btnShare.innerHTML = Buddy.ICONS.send
  btnHelp.innerHTML = HELP_ICON_SVG
  btnSettings.innerHTML = Buddy.ICONS.settings
  const urlSearchParms = new URLSearchParams(window.location.search);
  PLAYER_NAME['player1'] = urlSearchParms.get('p1') ?? 'Player 1'
  PLAYER_NAME['player2'] = urlSearchParms.get('p2') ?? 'Player 2'
  PLAYER_NAME['player3'] = urlSearchParms.get('p3') ?? 'Player 3'
  PLAYER_NAME['player4'] = urlSearchParms.get('p4') ?? 'Player 4'
  setPlayerName();
  const urlProgress = urlSearchParms.get('progress');
  if (urlProgress) {
    if (isValidProgressPayload(decodeProgress(urlProgress))) {
      GAME_PROGRESS_DATA_VALUE = urlProgress
      localStorage.setItem(GAME_PROGRESS_DATA_KEY, GAME_PROGRESS_DATA_VALUE)
      showAlert('Loaded saved data from URL', 'success')
    } else {
      showAlert('Not a valid saved data. Skipped', 'failed')
    }
    history.replaceState(null, '', location.protocol + '//' + location.host + location.pathname)
  }
  GAME_PROGRESS_DATA_VALUE = localStorage.getItem(GAME_PROGRESS_DATA_KEY) ?? ''
  const savedProgressData = decodeProgress(GAME_PROGRESS_DATA_VALUE)
  if (isValidProgressPayload(savedProgressData)) {
    openLoadSaveModal(savedProgressData)
  }
  btnSettings.addEventListener('click', openSettingsModal);
  btnHelp.addEventListener('click', openHelpModal);
  btnShare.addEventListener('click', (e) => getProgressLink(e));
  boardDiceRollerDice.addEventListener('click', rollDice);
  document.querySelectorAll('.boardHomeNickName').forEach((e) => {
    e.addEventListener('keydown', blockNicknameEnterKey)
    e.addEventListener('input', limitNicknameLength)
    e.addEventListener('input', getPlayerName)
  })
  deactivateCoin();
  checkForWinner();
  showWinner();
})