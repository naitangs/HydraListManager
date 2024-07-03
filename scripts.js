let listaDownloads = JSON.parse(localStorage.getItem('listaDownloads')) || {
    "name": "Minha lista",
    "downloads": []
};

function addDownload() {
    const title = document.getElementById('title').value;
    const urisInput = document.getElementById('uris').value;
    const uris = urisInput ? urisInput.split(',').map(uri => uri.trim()) : [];
    const uploadDate = document.getElementById('uploadDate').value + ':00.000Z';
    const fileSize = document.getElementById('fileSize').value;
    const newDownload = {
        title,
        uris,
        uploadDate,
        fileSize
    };
    listaDownloads.downloads.push(newDownload);
    updateJSONOutput();
    updateTableFromJson();
    saveToLocalStorage();
    document.getElementById('downloadForm').reset();
}

function removeDownload(index) {
    listaDownloads.downloads.splice(index, 1);
    updateJSONOutput();
    updateTableFromJson();
    saveToLocalStorage();
}

function addDownloadToTable(download, index) {
    const table = document.getElementById('downloadTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.insertCell(0).innerText = download.title;
    row.insertCell(1).innerText = download.uploadDate;
    row.insertCell(2).innerText = download.fileSize;
    const actionsCell = row.insertCell(3);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-all';
    removeBtn.innerText = 'Remover';
    removeBtn.onclick = () => removeDownload(index);
    actionsCell.appendChild(removeBtn);
}

function updateJSONOutput() {
    document.getElementById('jsonOutput').textContent = JSON.stringify(listaDownloads, null, 2);
}

function importJson() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            try {
                const importedJson = JSON.parse(evt.target.result);
                if (importedJson.name && importedJson.downloads) {
                    listaDownloads.name = importedJson.name;
                    listaDownloads.downloads = importedJson.downloads;
                    updateJSONOutput();
                    updateTableFromJson();
                    saveToLocalStorage();
                    document.getElementById('listTitle').value = listaDownloads.name;
                } else {
                    alert('Arquivo JSON inválido.');
                }
            } catch (e) {
                alert('Erro ao importar arquivo JSON.');
            }
        }
        reader.onerror = function (evt) {
            alert('Erro ao ler o arquivo.');
        }
    } else {
        alert('Selecione um arquivo JSON para importar.');
    }
}

function updateTableFromJson() {
    const table = document.getElementById('downloadTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    listaDownloads.downloads.forEach((download, index) => addDownloadToTable(download, index));
}

function editListTitle() {
    const newTitle = document.getElementById('listTitle').value;
    listaDownloads.name = newTitle;
    updateJSONOutput();
    saveToLocalStorage();
}

function promptDownload() {
    const jsonString = JSON.stringify(listaDownloads, null, 2);
    const fileName = prompt('Nome do arquivo JSON:', 'lista_downloads.json');
    if (fileName) {
        downloadJSON(jsonString, fileName);
    }
}

function downloadJSON(jsonString, fileName) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function copyJSON() {
    const jsonString = JSON.stringify(listaDownloads, null, 2);
    navigator.clipboard.writeText(jsonString)
        .then(() => alert('JSON copiado para a área de transferência!'))
        .catch(err => alert('Erro ao copiar JSON: ' + err));
}

function saveToLocalStorage() {
    localStorage.setItem('listaDownloads', JSON.stringify(listaDownloads));
}

function resetApp() {
    localStorage.removeItem('listaDownloads');
    listaDownloads = {
        "name": "Minha lista",
        "downloads": []
    };
    document.getElementById('listTitle').value = listaDownloads.name; 
    updateJSONOutput();
    updateTableFromJson();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('listTitle').value = listaDownloads.name;
    updateJSONOutput();
    updateTableFromJson();
});
