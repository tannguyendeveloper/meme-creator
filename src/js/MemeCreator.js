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
        const zoom = parseInt(document.getElementById('zoom-range').value);
        return {
            fontSize,
            fontFace,
            textColor,
            textAlign,
            strokeWeight,
            zoom
        }
    }

    hideActionButtons() {
        const actionButtons = document.getElementById('action-buttons');
        actionButtons.classList.add('hidden');
    }

    showActionButtons() {
        const actionButtons = document.getElementById('action-buttons');
        console.log(actionButtons)
        actionButtons.classList.remove('hidden');
        console.log(actionButtons.classList)
    }

    hideZoomControls() {
        const actionButtons = document.getElementById('zoom-controls');
        actionButtons.classList.add('hidden');
    }

    showZoomControl() {
        const actionButtons = document.getElementById('zoom-controls');
        actionButtons.classList.remove('hidden');
    }


    hideOptions() {
        const options = document.getElementById('options');
        options.classList.add('hidden');
    }

    downloadImage() {
        const dataURI = this.canvas.element.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.download = "meme.jpg";
        link.href= dataURI;
        link.click();
        link.remove();
    }

    toggleOptionsDisplay() {
        const options = document.getElementById('options');
        options.classList.toggle('hidden');
        document.querySelector('a[name="options"]').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    resetOptionsValues() {
        document.getElementById('upper-text').value = '';
        document.getElementById('lower-text').value = '';
        document.getElementById('font-size').value = 36;
        document.getElementById('font-face').value = 'Impact';
        document.getElementById('text-color').value = 'black';
        document.getElementById('text-align').value = 'center';
        document.getElementById('stroke-weight').value = 5;
        document.getElementById('zoom-range').value = 100;
    }

    handleInputChange() {        
        this.canvas.renderCanvas(this.getUpperText(), this.getLowerText(), this.getOptions());
    }

    handleRangeChange(e) {
        const value = e.target.value;
        const dataId = e.target.id;
        document.querySelector(`label[data-type="${dataId}"] span`).innerHTML = value;
    }

    handleSelectImageBtnClick() {
        const hiddenFileInput = document.getElementById('file-input');
        hiddenFileInput.click();
    }

    async handleOnFileChange(e) {
        if(e.target.value) {
            const reader = new FileReader();
            reader.addEventListener("load", async () => {
                // convert image file to base64 string
                let dataURI = reader.result;
                let result = await this.isImageValid(dataURI);
                if(result) {
                    this.showActionButtons();
                    this.showZoomControl();
                    this.handleInputChange();
                }
            }, false);
            let dataURI = await reader.readAsDataURL(e.target.files[0]);
        } else {
            // this.hideActionButtons();
            // this.hideZoomControls();
            e.target.value = '';
        }
    }

    async isImageValid(imageUrl) {
        try {
            const result = await this.canvas.setImage(imageUrl);
            return !!result;
        } catch(e) {
            MemeCreatorInstance.hideActionButtons();
        }
    }

    reset() {
        const selectImageButton = document.getElementById('select-image-button');
        this.canvas.clear();
        this.canvas.element.width = '';
        this.canvas.element.height = '';
        this.canvas.element.style.display = 'none';
        selectImageButton.style.display = 'block';
        this.resetOptionsValues();
        this.hideOptions();
        this.hideActionButtons();
        this.hideZoomControls();
    }

    initFunctions() {
        const _this = this;
        const inputs = document.querySelectorAll(`#meme-text-form input:not([type="range"])`);
        const ranges = document.querySelectorAll(`#meme-text-form input[type="range"]`);
        const selects = document.querySelectorAll(`#meme-text-form select`);
        const selectImageButton = document.getElementById('select-image-button');
        const reselectImageButton = document.getElementById('reselect-image-button');
        const zoomRangeInput = document.getElementById('zoom-range');
        const toggleOptionsButton = document.getElementById('toggle-options-button');
        const resetCanvasButton = document.getElementById('reset-canvas-button');
        const downloadImageButton = document.getElementById('download-image-button');
        const hiddenFileInput = document.getElementById('file-input');
        
        this.canvas.element.addEventListener('mousedown', _this.handleCanvasDragStart.bind(this));
        this.canvas.element.addEventListener('mouseup', _this.handleCanvasDragEnd.bind(this));
        this.canvas.element.addEventListener('mouseout', _this.handleCanvasDragEnd.bind(this));


        selectImageButton.addEventListener('click', this.handleSelectImageBtnClick);
        reselectImageButton.addEventListener('click', this.handleSelectImageBtnClick);
        toggleOptionsButton.addEventListener('click', this.toggleOptionsDisplay);
        resetCanvasButton.addEventListener('click', this.reset.bind(this));
        downloadImageButton.addEventListener('click', _this.downloadImage.bind(this));
        hiddenFileInput.addEventListener('change', this.handleOnFileChange.bind(this));

        // zoomRangeInput.addEventListener('input', this.handleInputChange.bind(this));


        bindElementsWithFn(inputs, 'keyup', function() { _this.handleInputChange() })        
        bindElementsWithFn(ranges, 'input', function(e) { 
            _this.handleRangeChange(e);
            _this.handleInputChange();
        })
        bindElementsWithFn(selects, 'change', function() { _this.handleInputChange() })
    }

    handleCanvasDragStart(e) {
        //initial mouse coordinates
        this.canvas.offsetController.canvasDragStart(e);
        this.canvas.element.classList.add('grabbing');
        this.handleCanvasDragOver = this.handleCanvasDragOver.bind(this);
        this.canvas.element.addEventListener('mousemove', this.handleCanvasDragOver)
    }

    handleCanvasDragOver(e) {
        this.canvas.offsetController.canvasDragOver(e);
        this.canvas.renderCanvas(this.getUpperText(), this.getLowerText(), this.getOptions());
    }

    handleCanvasDragEnd(e) {
        this.canvas.element.classList.remove('grabbing');
        this.canvas.element.removeEventListener('mousemove', this.handleCanvasDragOver);
    }

}

const bindElementsWithFn = function(elements, event, fn) {
    for(let element of elements) {
        element.addEventListener(event, fn);
    }
}

const MemeCreatorInstance = new MemeCreator('meme-canvas');
// MemeCreatorInstance.canvas.setImage('https://s.yimg.com/uu/api/res/1.2/Aa31UERVelNJUpRjFRX2dw--~B/Zmk9c3RyaW07aD0yOTk7cHlvZmY9MDtxPTk1O3c9NTczO3NtPTE7YXBwaWQ9eXRhY2h5b24-/https://s.yimg.com/lo/api/res/1.2/nzTjhxM61IN78SzHrqlxMw--~C/Y2g9MTQ2MS4wNDUyNTg2MjA2ODk1O2NyPTE7Y3c9MjU4ODtkeD0wO2R5PTMzNC41NTgxODk2NTUxNzI0O2ZpPXVsY3JvcDs7YXBwaWQ9cHJvZGVzazI-/https://s.yimg.com/os/creatr-images/2020-02/70f41820-5283-11ea-bfdb-b41888e3676f.cf.webp');
export default MemeCreatorInstance;