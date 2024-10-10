<template>
    <div>
      <!-- Side navigation -->
      <div class="sidenav">
        <a href="#">Alexendra Hospital (DIFY)</a>
      </div>
  
      <!-- content -->
      <div class="main pt-5">
        <div class="bg-light border rounded">
          <div class="row m-3">
            <div class="row">
              <div class="col">
                <h2>Item</h2>
              </div>
            </div>
          </div>
          <div class="row m-3">
            <div class="col">
              <form class="form-inline justify-content-end" @submit.prevent="createItem">
                <div class="form-group">
                  <input class="form-control " type="text" v-model="itemName" placeholder="Item Name" required>
                  <input class="form-control " type="text" v-model="itemDesc" placeholder="Item Description" required>
                  <button class="btn btn-outline-primary mx-1" type="submit">Create Item</button>
                </div>
              </form>
            </div>
          </div>
          <div class="row m-3">
            <button class="btn btn-secondary" @click="fetchData">Display Item</button>
            <button class="btn btn-light" id="hideData" v-if="showData" @click="hideData">Hide Item</button>
          </div>
          <div class="row m-3" v-if="showData">
            <table class="table">
              <thead class="thead-light">
                <tr>
                  <th scope="col">Item Name</th>
                  <th scope="col">Item Description</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemList" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <button
                      v-if="item.document_count > 0"
                      class="btn btn-secondary"
                      @click="fetchItemDocumentList(item.id, item.name)"
                    >
                      View Document
                    </button>
                    <button v-else class="btn btn-secondary" disabled>No Document</button>
                  </td>
                  <td>
                    <form @submit.prevent="uploadDocument(item.id, $refs[`fileInput${item.id}`].files[0])">
                      <input ref="fileInput" type="file" class="form-control border-0" />
                      <button class="btn btn-primary" type="submit">Upload</button>
                    </form>
                  </td>
                  <td>
                    <button class="btn btn-outline-danger" @click="deleteItem(item.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      
    </div>
  </template>
  
  <script src="./home.js"></script>
  
  <style scoped src="./home.css"></style>
  