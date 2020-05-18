import MemeCreatorInstance from './MemeCreator.js';
import MemeCanvasOffsetController from './MemeCanvasOffsetController.js';

// const MemeCreatorInstance = MemeCreatorInstance;
export default class MemeCanvas {
    constructor(id) {
        this.id = id;
        this.element = document.getElementById(this.id);
        this.context = this.element.getContext('2d');
        this.offsetController = new MemeCanvasOffsetController(this);
    }

    getLines(text) {
        if(!text) return false;
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
    
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = this.context.measureText(currentLine + " " + word).width;
            if (width < this.element.width) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    async setImage(dataURI) {
        const result =  new Promise((resolve, reject) => {
            this.imageDataURI = dataURI;
            let image = new Image;
            image.crossOrigin = 'anonymous';
            image.src = dataURI;
            image.offset = {x: 0, y: 0}; 
            image.addEventListener('load', async () => {
                const selectImageButton = document.getElementById('select-image-button');
                selectImageButton.style.display = 'none';
                const ratio = image.height/image.width;
                if(image.width > 960) {
                    image.width = 960;
                    image.height = 960 * ratio;
                }
                this.element.width = image.width;
                this.element.height = image.height;
                this.element.style.display = 'block';
                this.context.drawImage(image, 0, 0, image.width, image.height);
                this.image = image;
                resolve(true);
            });
            try {
                image.addEventListener('error', async () => {
                    this.image = false;
                    reject(false);
                })
            } catch(e) {
                reject(false);
            }
        })
        return result;
    }

    clear() {
        this.context.clearRect(0,0,this.element.width, this.element.height);
    }

    setContextOptions(options) {
        this.context.fontSize = options.fontSize;
        this.context.fontFace = options.fontFace;
        this.context.font = `${this.context.fontSize}px ${this.context.fontFace}`;
        this.context.textAlign = options.textAlign;
        this.context.fillStyle = options.textColor;
        this.context.strokeStyle = options.textColor === 'black' ? 'white' : 'black';
        this.context.lineWidth = options.strokeWeight;
        this.context.offsetX =  this.context.textAlign === "left" ? 
                                    0 :
                                this.element.width && this.context.textAlign === "center" ? 
                                    Math.floor(this.element.width/2) :
                                    this.element.width;
    }

    renderUpperText(text) {
        if(!text) return false;
        const lines = this.getLines(text);
        lines.forEach((value, i) => {
            const offsetY = parseInt(this.context.fontSize) * i + parseInt(this.context.fontSize * 1.15);
            this.context.strokeText(value, this.context.offsetX, offsetY);    
            this.context.fillText(value, this.context.offsetX, offsetY);  
        })
    }

    renderLowerText(text) {
        if(!text) return false;
        const lines = this.getLines(text);
        lines.reverse().forEach((value, i) => {
            const offsetY = this.element.height - (parseInt(this.context.fontSize) * i + parseInt(this.context.fontSize/3));
            this.context.strokeText(value, this.context.offsetX, offsetY);    
            this.context.fillText(value, this.context.offsetX, offsetY);  
        })
    }

    renderCanvas(upperText, lowerText, options) {
        const canvasWidth = this.element.width;
        const canvasHeight = this.element.height;
        const imageWidth = Math.floor(this.image.width * options.zoom) / 100;
        const imageHeight = Math.floor(this.image.height * options.zoom) / 100;
        const offset = {
            x: (canvasWidth - imageWidth)/2 + this.image.offset.x,
            y: (canvasHeight - imageHeight)/2 + this.image.offset.y
        }
        // this.image.offset = offset;
        this.context.save();
        this.clear();
        this.setContextOptions(options);
        this.context.drawImage(this.image, offset.x, offset.y, imageWidth, imageHeight);
        this.renderUpperText(upperText);
        this.renderLowerText(lowerText);
        this.context.restore();

    }
}