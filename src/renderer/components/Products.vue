<template>
  <div>
    <h1 class="h2">All Products find</h1>
    <button @click="removeAll()">Remove all</button>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Cod</th>
            <th>Cashback</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" v-bind:key="index">
            <td>{{item.name}}</td>
            <td>{{item.price}}</td>
            <td>{{item.cod}}</td>
            <td>{{item.cashback}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const database = require("./database/database");
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    async removeAll() {
      this.items = [];
      await database.saveToJson("productsMetadata.json", this.items);
    },
    async showItens() {
      this.items = await database.getAllProducts();
    }
  },
  mounted: function() {
    this.$nextTick(async function() {
      this.items = await database.getAllProducts();
    });
  },
  created: function() {
    setInterval(this.showItens, 1000);
  }
};
</script>

<style>
</style>
