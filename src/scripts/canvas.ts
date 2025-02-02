import { Globals } from './globals';
import { CanvasCoords } from './../core/canvas/CanvasCoords';
import { NetzlerTool } from './netzlertypes';
import { selectionTool, moveTool, deleteTool, cableTool, togglePopup, switchTool, showError } from './NetzlerFunctions';

import './levels/level1';
Globals.canvas.render();
switchTool('selection');

document.querySelectorAll('.toolbar-item').forEach((item: HTMLElement) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-item').forEach((item: HTMLElement) => item.classList.remove('selected'));
    if (item.id == 'reset') {
      if (!confirm('Möchtest du wirklich zum letzten Speicherpunkt zurückkehren? Alle bis dahin getätigten Schritte, gehen verloren!')) return;
      Globals.currentLevel.reset();
      return;
    }
    item.classList.add('selected');
    switchTool(<NetzlerTool>item.id);
  });
});

document.querySelectorAll('.popup-close-element').forEach((item: HTMLElement) => {
  item.addEventListener('click', () => togglePopup());
});

document.querySelector('.button-success').addEventListener('click', () => {
  const popup: HTMLElement = <HTMLElement>document.getElementById('popup');
  Globals.currentPopupNetzlerElement.settings.clear();
  popup.querySelector('.popup-body').querySelectorAll('.netzler-popup-item').forEach((item: HTMLElement) => {
    Globals.currentPopupNetzlerElement.settings.set(item.getAttribute('name'), item['value'] || item.getAttribute('value'));
  });
  Globals.currentPopupNetzlerElement = undefined;
  togglePopup();
});

document.querySelector('#character-message-box').addEventListener('click', () => {
  if (Globals.finished) return;
  try {
    Globals.currentLevel.triggerNewAction();
  } catch (e) {
    showError('Du musst die Aufgabe beenden, damit es weiter geht!');
  }
});

// Cheats
document.body.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.shiftKey && e.ctrlKey && e.altKey && e.key === 'S') {
    Globals.currentLevel.switchToNextLevel();
  }
});

Globals.canvasElement.addEventListener('click', (ev: MouseEvent) => {
  const mousecoords: CanvasCoords = Globals.canvas.getCanvasMouseCoords(ev);
  const toolMethods: Map<NetzlerTool, Function> = new Map<NetzlerTool, Function>([
    ['selection', selectionTool],
    ['move', moveTool],
    ['delete', deleteTool],
    ['cable', cableTool],
  ]);
  toolMethods.get(Globals.selectedTool)(mousecoords);
});

const levelFinishedInterval: NodeJS.Timeout = setInterval(() => {
  if (Globals.currentLevel.isLevelFinished()) {
    try {
      Globals.currentLevel.switchToNextLevel();
    } catch(err) {
      console.warn(err.message);
      clearInterval(levelFinishedInterval);
    }
  }
}, 200);