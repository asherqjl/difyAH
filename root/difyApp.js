document.getElementById('fetchData').addEventListener('click', function() {
    fetchData();
});

document.getElementById('knowledgeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    createKnowledge();
});

document.getElementById('hideData').addEventListener('click', function() {
    hideData();
});


// Constant API token
const API_TOKEN = 'dataset-03Z9UFsnQMyzR9Z6ToG4RgMK';

function fetchData() {
    const apiUrl = 'http://13.212.220.128/v1/datasets?page=1&limit=20';

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,  // Use Bearer token for authorization
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
    .then(data => {
        pData = data.data;
        displayData(pData);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('data').innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function displayData(data) {
    const dataContainer = document.getElementById('data');
    dataContainer.innerHTML = '';
    const hideButton = document.getElementById('hideData');
    hideButton.classList.add('btn');
    hideButton.classList.add('btn-light');

    data.forEach(item => {
        
        const itemRow = document.createElement('tr');
        const itemDiv = document.createElement('td')
        const itemColdel = document.createElement('td')
        const itemColupl = document.createElement('td')
        const itemColViewDoc = document.createElement('td')

        // knowledge name
        itemDiv.innerHTML = `<td>${item.name}</td>`;
        dataContainer.appendChild(itemRow);
        itemRow.appendChild(itemDiv);

        
        // view / no view doc button
        
        const viewButton = document.createElement('button');
        
        viewButton.classList.add('btn')
        viewButton.classList.add('btn-secondary')
        if(item.document_count > 0){
            viewButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"></path></svg> View Document`
            viewButton.id = 'viewDoc';
            viewButton.addEventListener('click', function(event) {
                event.preventDefault();
                fetchKnowledgeDocumentList(item.id);
                modalFunc()
                
            });
            itemColViewDoc.appendChild(viewButton)
            
        } else {
            viewButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"></path></svg>No Document';
            viewButton.disabled = true;
            itemColViewDoc.appendChild(viewButton)
        }
        itemRow.appendChild(itemColViewDoc);

        //  delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-outline-danger');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path></svg>`;
        deleteButton.onclick = () => deleteItem(item.id); 
        itemColdel.appendChild(deleteButton)

        // upload doc
        const uploadInput = document.createElement('input');
        uploadInput.id = 'file';
        uploadInput.type = 'file';
        uploadInput.classList.add('form-control');
        uploadInput.classList.add('border-0');
        uploadInput.style.backgroundColor = '#f8f9fa';
        const uploadForm = document.createElement('form');
        uploadForm.classList.add('upload-form');
        uploadForm.classList.add('form-inline');
        
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // var filePath = uploadInput.files[0].name;
            uploadDocument(item.id, uploadInput);
        });
        
        uploadForm.appendChild(uploadInput);

        // upl button
        const uploadButton = document.createElement('button');
        uploadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"></path></svg>`;
        uploadButton.classList.add('btn');
        uploadButton.classList.add('btn-primary');
        uploadButton.type = 'submit';

        uploadForm.appendChild(uploadButton);
        itemColupl.appendChild(uploadForm)

        itemRow.appendChild(itemColupl);
        itemRow.appendChild(itemColdel);


    });
    dataContainer.classList.add('show');
    hideButton.style.display = 'inline-block';
}

function fetchKnowledgeDocumentList(id){
    
    const apiUrl = 'http://13.212.220.128/v1/datasets';
    fetch(`${apiUrl}/${id}/documents`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
    .then(data => {
        pData = data.data;
        displayKnoDocData(pData);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('data').innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function displayKnoDocData(data) {
    const modal = document.getElementById('showDoc');
    data.forEach(doc => {
        const docRow = document.createElement('tr');
        docRow.id = 'documents';
        docRow.innerHTML = `<td>${doc.name}</td>`;
        modal.appendChild(docRow);
        clearDoc();
    });
}

function clearDoc(){
    const clearDocButton = document.getElementById('clear');
    clearDocButton.addEventListener('click', function(event) {
        // event.preventDefault();
        const clearDocuments = document.getElementById('documents');
        if (clearDocuments && clearDocuments.parentNode){
            clearDocuments.parentNode.removeChild(clearDocuments);
        }
    });

}

function modalFunc(){
    $("#exampleModal").modal('toggle')
}

function hideData() {
    const dataContainer = document.getElementById('data');
    const hideButton = document.getElementById('hideData');
    
    // Hide the data container and the hide button
    dataContainer.classList.remove('show');
    hideButton.style.display = 'none';
}

function createKnowledge() {
    // Replace with your API URL
    const apiUrl = 'http://13.212.220.128/v1/datasets';

    const name = document.getElementById('name').value;
    
    const newItem = {
        name: name,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,  // Use Bearer token for authorization
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Knowledge created successfully!');
        document.getElementById('knowledgeForm').reset(); 
        fetchData(); // Optionally refresh the data
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert(`Error: ${error.message}`);
    });
}

function deleteItem(id) {
    const apiUrl = 'http://13.212.220.128/v1/datasets/';

    fetch(apiUrl+id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,  // Use Bearer token for authorization
            'Content-Type': 'application/json'
        }
    })
    .then(response => { 
        if (!response.status === 204) {
            throw new Error('Network response was not ok');
        }
    })
    .then(() => {
        alert('Item deleted successfully!');
        fetchData(); // Refresh the data to reflect the deletion
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert(`Error: ${error.message}`);
    });
}

function uploadDocument(itemId, file) {    
    
    if (!file) {
        console.error('No file selected');
        return;
    }
    const fileNow = file.files[0]; // Get the selected file

    const formData = new FormData();
    formData.append('data', JSON.stringify({
        indexing_technique: "high_quality",
        process_rule: {
        rules: {
            pre_processing_rules: [
            { id: "remove_extra_spaces", enabled: true },
            { id: "remove_urls_emails", enabled: true }
            ],
            segmentation: { separator: "###", max_tokens: 500 }
        },
        mode: "custom"
        }
    }));

    formData.append('file', file);

    if (file && file.files.length > 0) {
        formData.append('file', file.files[0]);
    } else {
        console.error('File not found');
        return;
    }
    // formData.append('file', file);
    // console.log(file)
    const API_URL = 'http://13.212.220.128/v1/datasets'
    fetch(`${API_URL}/${itemId}/document/create_by_file`, { 
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`
        },
        body: formData
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        alert('Document uploaded successfully!');
        fetchData()
    })
    .catch(error => {
        console.error('There was a problem with the upload operation:', error);
        alert(`Error: ${error.message}`);
    });
}