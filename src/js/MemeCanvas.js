import MemeCreatorInstance from './MemeCreator.js';
// const MemeCreatorInstance = MemeCreatorInstance;
export default class MemeCanvas {
    constructor(id) {
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext('2d');
    }

    getLines(text) {
        if(!text) return false;
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
    
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = this.context.measureText(currentLine + " " + word).width;
            if (width < this.canvas.width) {
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
            let image = new Image;
            image.crossOrigin = 'anonymous';
            image.src = dataURI;
            image.addEventListener('load', async () => {
                const selectImageButton = document.getElementById('select-image-button');
                selectImageButton.style.display = 'none';
                const ratio = image.height/image.width;
                if(image.width > 960) {
                    image.width = 960;
                    image.height = 960 * ratio;
                }
                this.canvas.width = image.width;
                this.canvas.height = image.height;
                this.canvas.style.display = 'block';
                this.context.drawImage(image, 0, 0, image.width, image.height);
                this.image = image;
                MemeCreatorInstance.showActionButtons();
                this.drawImage(MemeCreatorInstance.getUpperText(), MemeCreatorInstance.getLowerText(), MemeCreatorInstance.getOptions());
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
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
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
                                this.canvas.width && this.context.textAlign === "center" ? 
                                    Math.floor(this.canvas.width/2) :
                                    this.canvas.width;
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
            const offsetY = this.canvas.height - (parseInt(this.context.fontSize) * i + parseInt(this.context.fontSize/3));
            this.context.strokeText(value, this.context.offsetX, offsetY);    
            this.context.fillText(value, this.context.offsetX, offsetY);  
        })
    }

    drawImage(upperText, lowerText, options) {
        this.context.save();
        this.setContextOptions(options);
        if(this.image) this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        this.renderUpperText(upperText);
        this.renderLowerText(lowerText);
        this.context.restore();
    }
}