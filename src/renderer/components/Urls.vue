<template class="urls">
  <div id="Urls">
    <h1 class="h2">URL List</h1>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Url</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" v-bind:key="index">
            <td style="width:230px">{{item.url}}</td>
            <td style="width:36px">
              <button type="button" class="btn btn-danger" @click="removeItem(index)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="input-group">
      <input
        type="text"
        class="form-control input-url"
        placeholder="Insert a url"
        aria-label="Insert a url"
        aria-describedby="button-addon4"
        v-model="url"
      >
      <div class="input-group-append" id="button-addon4">
        <button class="btn btn-success" type="button" @click="addItem()">Adcionar a lista</button>
        <button class="btn btn-primary" type="button" @click="saveData()">Salvar configuração</button>
      </div>
    </div>
  </div>
</template>

<script>
const Database = require("./database/database");
export default {
  name: "Urls",
  data() {
    return {
      items: [],
      url: ""
    };
  },
  methods: {
    addItem() {
      this.items.push({
        url: this.url
      });
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    async saveData() {
      await Database.saveToJson("urls.json", this.items);
      this.items = await Database.getUrlsFromDatabase();
      alert('database saved')
    }
  },
  mounted: function() {
    this.$nextTick(async function() {
      this.items = await Database.getUrlsFromDatabase();
    });
  }
};
</script>

<style>
.input-url {
  max-width: 60%;
}
.urls {
  max-width: 90%;
}
</style>
