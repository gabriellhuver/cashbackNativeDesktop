<template>
  <div>
    <h1 class="h2">All Cashbacks find</h1>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Cod</th>
            <th>Cashback</th>
            <th>Url</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" v-bind:key="index">
            <td>{{item.name}}</td>
            <td>{{item.price}}</td>
            <td>{{item.cod}}</td>
            <td>{{item.cashback}}</td>
            <td>
              <a @click="open(item.url)" href="#">Url</a>
            </td>

            <td style="width:36px">
              <button type="button" class="btn btn-danger" @click="removeItem(index)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const database = require("./database/database");
import { shell } from "electron";
import { setInterval } from "timers";
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    open(url) {
      shell.openExternal(url);
    },
    async removeItem(index) {
      this.items.splice(index, 1);
      await database.saveToJson("cashbacks.json", this.items);
    },
    async showItens() {
      this.items = await database.getAllCashbacks();
    }
  },
  mounted: function() {
    this.$nextTick(async function() {
      this.showItens();
    });
  },
  created: function() {
    setInterval(this.showItens,1000)
  }
};
</script>

<style>
</style>
