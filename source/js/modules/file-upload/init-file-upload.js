function initFileUpload() {

  function createFileIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M13.375 7H9C8.60218 7 8.22064 6.84196 7.93934 6.56066C7.65804 6.27936 7.5 5.89782 7.5 5.5V1.125C7.5 1.09185 7.48683 1.06005 7.46339 1.03661C7.43995 1.01317 7.40815 1 7.375 1H4.5C3.96957 1 3.46086 1.21071 3.08579 1.58579C2.71071 1.96086 2.5 2.46957 2.5 3V13C2.5 13.5304 2.71071 14.0391 3.08579 14.4142C3.46086 14.7893 3.96957 15 4.5 15H11.5C12.0304 15 12.5391 14.7893 12.9142 14.4142C13.2893 14.0391 13.5 13.5304 13.5 13V7.125C13.5 7.09185 13.4868 7.06005 13.4634 7.03661C13.4399 7.01317 13.4082 7 13.375 7Z');
    path1.setAttribute('fill', '#999999');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M13.1006 5.89359L8.60656 1.39952C8.59782 1.39083 8.58671 1.38492 8.57462 1.38253C8.56253 1.38014 8.55001 1.38138 8.53862 1.38609C8.52723 1.3908 8.51749 1.39877 8.51062 1.409C8.50375 1.41923 8.50005 1.43126 8.5 1.44359V5.50015C8.5 5.63276 8.55268 5.75993 8.64645 5.8537C8.74021 5.94747 8.86739 6.00015 9 6.00015H13.0566C13.0689 6.0001 13.0809 5.9964 13.0911 5.98953C13.1014 5.98266 13.1093 5.97292 13.1141 5.96153C13.1188 5.95014 13.12 5.93762 13.1176 5.92553C13.1152 5.91344 13.1093 5.90232 13.1006 5.89359Z');
    path2.setAttribute('fill', '#999999');

    svg.appendChild(path1);
    svg.appendChild(path2);

    return svg;
  }

  function createRemoveIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '10');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.setAttribute('fill', 'none');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M1 1L9 9M9 1L1 9');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);

    return svg;
  }

  const fileInputs = document.querySelectorAll('.file-input');
  const fileInputImgs = document.querySelectorAll('.file-input-img');
  let fileLabels = [];
  let fileLabelImgs = [];

  fileInputs.forEach(fileInput => {
    if (!(fileInput.dataset.initialized === 'true')) {
      fileInput.setAttribute('data-initialized', 'true');
      fileLabels.push(fileInput.closest('label'));
      fileInput.addEventListener('change', function (e) {
        handleFileSelection(this);
      });
    } else return
  });

  fileInputImgs.forEach(fileInputImg => {
    if (!(fileInputImg.dataset.initialized === 'true')) {
      fileInputImg.setAttribute('data-initialized', 'true');
      fileLabelImgs.push(fileInputImg.closest('label'));
      fileInputImg.addEventListener('change', function (e) {
        handleFileSelection(this);
      });
    } else return
  });

  function createThumbnail(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'file-thumbnail';
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        resolve(img);
      };
      reader.readAsDataURL(file);
    });
  }

  let selectedFiles = new Map();

  async function handleFileSelection(input) {
    const fileInfo = input.closest('.file-upload').querySelector('.file-info');
    const label = input.closest('label');

    if (input.files && input.files.length > 0) {
      if (!input.multiple || fileInfo.children.length === 0) {
        fileInfo.innerHTML = '';
        selectedFiles.set(input, new Map());
      }

      fileInfo.style.display = 'flex';

      if (!input.multiple) {
        label.style.display = 'none';
      }

      const inputFiles = selectedFiles.get(input) || new Map();

      for (const file of Array.from(input.files)) {
        if (inputFiles.has(file.name)) {
          continue;
        }

        inputFiles.set(file.name, file);

        const fileWrapper = document.createElement('div');
        fileWrapper.className = 'file-wrapper';

        let fileIconOrThumbnail;
        if (file.type.startsWith('image/')) {
          fileIconOrThumbnail = await createThumbnail(file);
        } else {
          fileIconOrThumbnail = createFileIcon();
        }

        const fileIconWrapper = document.createElement('span');
        fileIconWrapper.className = 'file-icon';
        fileIconWrapper.appendChild(fileIconOrThumbnail);
        fileWrapper.appendChild(fileIconWrapper);

        const fileNameSpan = document.createElement('span');
        fileNameSpan.className = 'file-name';
        fileNameSpan.textContent = file.name;
        fileWrapper.appendChild(fileNameSpan);

        const removeButton = document.createElement('span');
        removeButton.className = 'remove-file';
        removeButton.appendChild(createRemoveIcon());
        fileWrapper.appendChild(removeButton);

        fileInfo.appendChild(fileWrapper);
        removeButton.addEventListener('click', function (e) {
          fileWrapper.remove();
          inputFiles.delete(file.name);
          updateFileList(input);
          if (fileInfo.children.length === 0) {
            fileInfo.style.display = 'none';
            label.style.display = 'flex';
          }
        });
      }

      selectedFiles.set(input, inputFiles);
      updateFileList(input);
    }
  }

  function updateFileList(input) {
    const dataTransfer = new DataTransfer();
    const inputFiles = selectedFiles.get(input);

    if (inputFiles) {
      for (const file of inputFiles.values()) {
        dataTransfer.items.add(file);
      }
    }

    input.files = dataTransfer.files;
  }

  function updateFileDisplay(input) {
    const fileInfo = input.closest('.file-upload').querySelector('.file-info');
    const label = input.closest('label');

    if (input.files.length > 0) {
      fileInfo.style.display = 'flex';
      label.style.display = 'none';
    } else {
      fileInfo.style.display = 'none';
      label.style.display = 'flex';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    [...fileInputs, ...fileInputImgs].forEach(input => {
      if (input) {
        updateFileDisplay(input);
      }
    });
  });
}

export { initFileUpload }
