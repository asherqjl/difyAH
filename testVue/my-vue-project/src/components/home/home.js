export default {
  name: "HomeView",
  data() {
    return {
      API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      API_URL:'http://localhost:3000/api',
      itemName: '',
      itemDesc: '',
      itemList: [],
      currentDocs: [],
      isModalVisible: false,
      showData: false
    };
  },
  methods: {
    fetchData() {
      fetch(this.API_URL+'/items', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if(data.message){
            this.showData = false;
          } else {
            this.itemList = data.items;
            this.showData = true;
            this.itemDesc = '';
            this.itemName = '';
          }
          
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    hideData() {
      this.showData = false;
    },
    createItem() {
      const newItem = { name: this.itemName, description: this.itemDesc};
      fetch(this.API_URL+'/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
        .then(response => response.json())
        .then(() => {
          alert('Item created successfully!');

          this.fetchData();
        })
        .catch(error => {
          console.error('Error creating Item:', error);
        });
    },
    deleteItem(id) {
      const apiUrl = `http://13.212.220.128/v1/datasets/${id}`;
      fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
        .then(() => {
          alert('Item deleted successfully!');
          this.fetchData();
        })
        .catch(error => {
          console.error('Error deleting item:', error);
        });
    },
    fetchItemDocumentList(id, name) {
      const apiUrl = `http://13.212.220.128/v1/datasets/${id}/documents`;
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          this.currentDocs = data.data;
          this.isModalVisible = true;
          this.name = name;
        })
        .catch(error => {
          console.error('Error fetching documents:', error);
        });
    },
    uploadDocument(itemId, file) {
      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = `http://13.212.220.128/v1/datasets/${itemId}/document/create_by_file`;
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`
        },
        body: formData
      })
        .then(() => {
          alert('Document uploaded successfully!');
          this.fetchData();
        })
        .catch(error => {
          console.error('Error uploading document:', error);
        });
    }
  }
};
