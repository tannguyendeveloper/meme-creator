import MemeCreatorInstance from './MemeCreator.js';

export default class FileSelectionModal {
    constructor() {
        this.render();
    }
    
    render() {
        const modal = this.create();
        document.querySelector('body').append(modal);
        $('.ui.modal')
            .modal({
                onShow: () => { 
                    this.bindFileUploadButton();
                    this.bindHiddenFileInput();
                    this.bindImageUrlInput();
                    this.bindUrlSubmitBtn();
                },
                onHidden: () => {
                    $('.ui.modal').remove();
                }
            })
            .modal('show')
    }

    bindImageUrlInput() {
        let urlInput = document.getElementById('image-url-input');
        urlInput.addEventListener('keyup', this.removeError);
    }

    bindUrlSubmitBtn() {
        const urlSubmitBtn = document.getElementById("submit-url-btn");
        urlSubmitBtn.addEventListener('click', async (e) => {
            const imageUrl = document.getElementById('image-url-input').value
            let result = await this.isImageValid(imageUrl);
            if(!result) { 
                this.handleUrlError();
            } else { 
                MemeCreatorInstance.showActionButtons();
                MemeCreatorInstance.showZoomControl();
                this.close();
            }
        })
    }

    removeError() {
        const urlField = document.getElementById('url-field');
        urlField.classList.remove('error');
    }

    handleUrlError() {
        const urlField = document.getElementById('url-field');
        urlField.classList.add('error');
    }

    bindFileUploadButton() {
        const fileUploadButton = document.getElementById('file-upload-button');
        fileUploadButton.addEventListener('click', function() {
            const fileInput = document.getElementById('file-input');
            fileInput.click();
        })
    }

    bindHiddenFileInput() {
        const hiddenFileInput = document.getElementById('file-input');
        hiddenFileInput.addEventListener('change', async (e) => {
            if(e.target.value) {
                const reader = new FileReader();
                reader.addEventListener("load", async () => {
                    // convert image file to base64 string
                    let dataURI = reader.result;
                    let result = await this.isImageValid(dataURI);
                    if(!result) { 
                        this.handleUrlError();
                    } else { 
                        MemeCreatorInstance.showActionButtons();
                        MemeCreatorInstance.showZoomControl();
                    }
                }, false);
                let dataURI = await reader.readAsDataURL(hiddenFileInput.files[0]);
            } else {
                MemeCreatorInstance.hideActionButtons();
                MemeCreatorInstance.hideZoomControls();
                hiddenFileInput.value = '';
            }
            this.close();
        })
    }

    async isImageValid(imageUrl) {
        try {
            const result = await MemeCreatorInstance.canvas.setImage(imageUrl);
            return !!result;
        } catch(e) {
            MemeCreatorInstance.hideActionButtons();
        }
    }

    renderFileSelectionForm() {
        const fileSelectionForm = document.createElement('form');
        fileSelectionForm.classList.add('ui','form');

        const urlFieldGroup = this.renderUrlFieldGroup();

        const divider = document.createElement('div');
        divider.classList.add('ui','horizontal','divider');
        divider.innerText = 'or';

        const fileSelectFieldGroup = this.renderFileSelectFieldGroup();

        fileSelectionForm.append(urlFieldGroup, divider, fileSelectFieldGroup);

        return fileSelectionForm;
    }
    
    renderUrlFieldGroup() {
        const urlField = document.createElement('div');
        urlField.id = 'url-field'
        urlField.classList.add('field');

        const urlInputGroup = document.createElement('div');
        urlInputGroup.classList.add('ui', 'action', 'input');

        const urlInput = document.createElement('input');
        urlInput.id = "image-url-input";
        urlInput.placeholder = 'Enter the URL'
        
        const urlSubmitBtn = document.createElement('button');
        urlSubmitBtn.classList.add('ui', 'button');
        urlSubmitBtn.id = "submit-url-btn";
        urlSubmitBtn.type = "button";
        urlSubmitBtn.innerText = 'Use URL';


        urlInputGroup.append(urlInput, urlSubmitBtn);

        urlField.append(urlInputGroup);
        return urlField;
    }

    renderFileSelectFieldGroup() {
        const fileSelectFieldGroup = document.createElement('div');
        fileSelectFieldGroup.classList.add('field');

        const fileUploadButton = document.createElement('button');
        fileUploadButton.type = 'button';
        fileUploadButton.id = 'file-upload-button';
        fileUploadButton.classList.add('ui', 'icon', 'button');
        fileUploadButton.innerHTML = '<i class="upload icon"></i> Upload Image';
        
        const hiddenFileInput = document.createElement('input');
        hiddenFileInput.id = "file-input"
        hiddenFileInput.type = "file";
        hiddenFileInput.accept = "image/png, image/jpeg, image/gif";
        hiddenFileInput.style.display = 'none';

        fileSelectFieldGroup.append(hiddenFileInput, fileUploadButton);
        return fileSelectFieldGroup;
    }

    create() {
        const modal = document.createElement('div');
        modal.classList.add('ui','small','modal');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('header');
        modalHeader.innerHTML = 'Image Selection';

        const modalContent = document.createElement('div');
        modalContent.classList.add('ui','basic', 'center', 'aligned', 'segment', 'content')
        modalContent.style.marginTop = 0;
        modalContent.append(this.renderFileSelectionForm());

        modal.append(modalHeader, modalContent);

        return modal;
    }

    close() {
        $('.ui.modal')
            .modal('hide')
            .remove()
    }

}