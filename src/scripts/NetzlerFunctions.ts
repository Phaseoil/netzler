import { CanvasCoords } from "../core/canvas/CanvasCoords";
import { CanvasElement } from "../core/canvas/CanvasElement";
import { NetzlerElement } from "./classes/NetzlerElement";
import { Globals } from "./globals";

export type NetzlerFunction = (mousecoords: CanvasCoords) => void;

let followElement: CanvasElement;

export const moveTool: NetzlerFunction = (mousecoords: CanvasCoords): void => {
  const elements: NetzlerElement[] = Globals.elements;
  if (followElement) {
    Globals.canvasElement.removeEventListener('mousemove', followMouse);
      
    followElement = undefined;
  } else {
    elements.forEach((nelement: NetzlerElement) => {
      const element: CanvasElement = nelement.getCanvasElement();
      if (element.isPointInElement(mousecoords)) {
        followElement = element;
        if (followElement) {
          Globals.canvasElement.addEventListener('mousemove', followMouse);
        } 
      }
    });
  }
};

export const selectionTool: NetzlerFunction = (mousecoords: CanvasCoords): void => {
  console.log(mousecoords, 'selectionTool');
};

export const deleteTool: NetzlerFunction = (mousecoords: CanvasCoords): void => {
  console.log(mousecoords, 'deleteTool');
};

export const cableTool: NetzlerFunction = (mousecoords: CanvasCoords): void => {
  
};

function followMouse(ev: MouseEvent): void {
  const mousecoords: CanvasCoords = Globals.canvas.getCanvasMouseCoords(ev);
  followElement.getCoords().setX(mousecoords.getX() - (followElement.getWidth() / 2));
  followElement.getCoords().setY(mousecoords.getY() - (followElement.getHeight() / 2));
}