import MemeCanvas from './MemeCanvas.js';
import FileSelectionModal from './FileSelectionModal.js';

class MemeCreator {
    constructor() {
        this.init();
    }
    
    init() {
        this.canvas = new MemeCanvas('meme-canvas');
        this.initFunctions();
    }

    getUpperText() {
        return document.getElementById('upper-text').value ?? false;
    }

    getLowerText() {
        return document.getElementById('lower-text').value ?? false;
    }

    getOptions() {
        const fontSize = document.getElementById('font-size').value;
        const fontFace = document.getElementById('font-face').value;
        const textColor = document.getElementById('text-color').value;
        const textAlign = document.getElementById('text-align').value;
        const strokeWeight = document.getElementById('stroke-weight').value;
        return {
            fontSize,
            fontFace,
            textColor,
            textAlign,
            strokeWeight
        }
    }

    hideActionButtons() {
        const actionButtons = document.getElementById('action-buttons');
        actionButtons.classList.add('hidden');
    }


    showActionButtons() {
        const actionButtons = document.getElementById('action-buttons');
        actionButtons.classList.remove('hidden');
    }

    hideOptions() {
        const options = document.getElementById('options');
        options.classList.add('hidden');
    }

    downloadImage() {
        const dataURI = this.canvas.canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.download = "meme.jpg";
        link.href= dataURI;
        link.click();
        link.remove();
    }

    toggleOptionsDisplay() {
        const options = document.getElementById('options');
        options.classList.toggle('hidden');
    }

    resetOptionsValues() {
        document.getElementById('upper-text').value = '';
        document.getElementById('lower-text').value = '';
        document.getElementById('font-size').value = 36;
        document.getElementById('font-face').value = 'Impact';
        document.getElementById('text-color').value = 'black';
        document.getElementById('text-align').value = 'center';
        document.getElementById('stroke-weight').value = 5;
    }

    handleInputChange() {        
        this.canvas.drawImage(this.getUpperText(), this.getLowerText(), this.getOptions());
    }

    handleRangeChange(e) {
        const value = e.target.value;
        const dataId = e.target.id;
        document.querySelector(`label[data-type="${dataId}"] span`).innerHTML = value;
    }

    handleSelectImageBtnClick() {
        const modal = new FileSelectionModal();
    }
    
    reset() {
        const selectImageButton = document.getElementById('select-image-button');
        this.canvas.clear();
        this.canvas.canvas.width = '';
        this.canvas.canvas.height = '';
        this.canvas.canvas.style.display = 'none';
        selectImageButton.style.display = 'block';
        this.resetOptionsValues();
        this.hideOptions();
        this.hideActionButtons();
    }

    initFunctions() {
        const _this = this;
        const inputs = document.querySelectorAll(`#meme-text-form input:not([type="range"])`);
        const ranges = document.querySelectorAll(`#meme-text-form input[type="range"]`);
        const selects = document.querySelectorAll(`#meme-text-form select`);
        const selectImageButton = document.getElementById('select-image-button');
        const reselectImageButton = document.getElementById('reselect-image-button');
        const toggleOptionsButton = document.getElementById('toggle-options-button');
        const resetCanvasButton = document.getElementById('reset-canvas-button');
        const downloadImageButton = document.getElementById('download-image-button');

        selectImageButton.addEventListener('click', this.handleSelectImageBtnClick);
        reselectImageButton.addEventListener('click', this.handleSelectImageBtnClick);
        toggleOptionsButton.addEventListener('click', this.toggleOptionsDisplay);
        resetCanvasButton.addEventListener('click', this.reset.bind(this));
        downloadImageButton.addEventListener('click', _this.downloadImage.bind(this));

        bindElementsWithFn(inputs, 'keyup', function() { _this.handleInputChange() })        
        bindElementsWithFn(ranges, 'input', function(e) { 
            _this.handleRangeChange(e);
            _this.handleInputChange();
        })
        bindElementsWithFn(selects, 'change', function() { _this.handleInputChange() })
    }
}

const bindElementsWithFn = function(elements, event, fn) {
    for(let element of elements) {
        element.addEventListener(event, fn);
    }
}

const MemeCreatorInstance = new MemeCreator('meme-canvas');

export default MemeCreatorInstance;