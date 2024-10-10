<template>
    <!-- Modal to show documents-->
    <!-- <b-modal v-model="isModalVisible" title="Documents">
    <table class="table">
        <thead class="thead-light">
        <tr>
            <th scope="col">Document</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="doc in currentDocs" :key="doc.id">
            <td>{{ doc.name }}</td>
        </tr>
        </tbody>
    </table>
    <template v-slot:modal-footer>
        <b-button variant="secondary" @click="isModalVisible = false">Close</b-button>
    </template>
    </b-modal> -->
    <div class="modal fade" id="docModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <thead class="thead-light">
                          <tr>
                            <th scope="col">Document</th>
                          </tr>
                        </thead>
                            <tbody id="showDoc"></tbody>                    
                        </table>  
                </div>
                <div class="modal-footer">
                <button id="clear" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
</template>
<script src="./DocMod.js"></script>
