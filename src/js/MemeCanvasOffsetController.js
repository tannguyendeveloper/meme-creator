export default class MemeCanvasOffsetController {
    constructor(canvas) {
        this.canvas = canvas;
    }

    canvasDragStart(e) {
        this.beginDragCoordinates = this.getMouseCoordinates(e);
        this.initialOffset = this.canvas.image.offset;
    }

    canvasDragOver(e) {
        this.endDragCoordinates = this.getMouseCoordinates(e);
        this.setOffset(this.calculateOffset())
    }

    calculateOffset() {
        let ratio = this.getRatio();
        return {
            x: this.initialOffset.x + ((this.endDragCoordinates.x - this.beginDragCoordinates.x) * ratio),
            y: this.initialOffset.y + ((this.endDragCoordinates.y - this.beginDragCoordinates.y) * ratio)
        }
    }

    getCanvasComputedWidth() {
        return parseInt(window.getComputedStyle(this.canvas.element).width.replace('px',''));
    }

    getRatio() {
        return this.getCanvasComputedWidth()/this.canvas.image.width;
    }

    setEndDragCoordinates(e) {
        this.endDragCoordinates = this.getMouseCoordinates(e);
    }

    setOffset(newOffset) {
        this.canvas.image.offset = newOffset;
    }

    getMouseCoordinates(e) {
        const boundary = this.canvas.element.getBoundingClientRect();
        // (e.clientX, e.clientY)  => Mouse coordinates wrt whole browser
        //  (boundary.left, boundary.top) => Canvas starting coordinate
        return {
          x: e.clientX - boundary.left,  
          y: e.clientY - boundary.top
        };
    }
}