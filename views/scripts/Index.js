const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');
const thumbnailsContainer = document.getElementById('thumbnails');
const imagePopup = document.getElementById('imagePopup');
const popupImage = document.getElementById('popupImage');

const btn = document.getElementById('btn');
const closeBtn = document.querySelector('#imagePopup .close');
let selectedFiles = [];

btn.addEventListener('click', () => {
    if (selectedFiles.length === 0) {
        alert('Выберите хотя бы один файл.');
        return;
    }

    const formData = new FormData();

    for (const file of selectedFiles) {
        formData.append('images', file);
    }
    fetch('/', {
        method: 'POST',
        enctype: 'multipart/form-data',
        body: formData
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log('Успешно отправлено, но не было перенаправления');
        }
    })

});

uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length === 0) {
        return;
    }

    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const reader = new FileReader();

        reader.onload = () => {
            const thumbnail = createThumbnailElement(reader.result, file);

            const deleteButton = thumbnail.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                removeFile(file);
                thumbnail.remove();
            });

            const imageElement = thumbnail.querySelector('img');
            imageElement.addEventListener('click', () => {
                showFullSizeImage(imageElement.src);
            });

            thumbnailsContainer.appendChild(thumbnail);
            selectedFiles.push(file);
        };
        reader.readAsDataURL(file);
    }
});

thumbnailsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('thumbnail')) {
        const imageElement = event.target.querySelector('img');
        showFullSizeImage(imageElement.src);
    }
});

closeBtn.addEventListener('click', () => {
    hideImagePopup();
});

function showFullSizeImage(imageUrl) {
    popupImage.src = imageUrl;
    showImagePopup();
}

function showImagePopup() {
    imagePopup.style.display = 'flex';
    fadeIn(imagePopup);
    fadeIn(popupImage);
}

function hideImagePopup() {
    fadeOut(imagePopup);
    fadeOut(popupImage, () => {
        imagePopup.style.display = 'none';
    });
}

function fadeIn(element) {
    let opacity = 0;

    const interval = setInterval(() => {
        opacity += 0.1;
        element.style.opacity = opacity;

        if (opacity >= 1) {
            clearInterval(interval);
        }
    }, 30);
}

function fadeOut(element, callback) {
    let opacity = 1;

    const interval = setInterval(() => {
        opacity -= 0.1;
        element.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }, 30);
}

function createThumbnailElement(imageSrc, file) {
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');

    const img = document.createElement('img');
    img.src = imageSrc;
    thumbnail.appendChild(img);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&times;';
    thumbnail.appendChild(deleteButton);

    thumbnail.setAttribute('data-file-name', file.name);

    return thumbnail;
}

function removeFile(file) {
    const index = selectedFiles.indexOf(file);
    if (index !== -1) {
        selectedFiles.splice(index, 1);
    }
}

function isFileSelected(file) {
    return selectedFiles.some((selectedFile) => selectedFile.name === file.name);
}