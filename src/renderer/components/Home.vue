<template class="home">
  <div>
    <h1>Cashback Scanner</h1>

    <div v-show="!running">
      <h3>Scanner Configuration</h3>
      <br>Page Range (MIN: 2)
      <input class="form-control" type="number" v-model="settings.PAGE_RANGE">
      <br>Cashback value
      <input class="form-control" type="number" v-model="settings.CASHBACK_VALUE">
      <br>Ordenation
      <input class="form-control" type="text" v-model="settings.ORDENATION">
      <br>
    </div>

    <div v-show="running">
      <h4>{{productsFound}} Products found.</h4>
      <h4>{{cashBacksFound}} Cashbacks found (Cashback percent value >= {{settings.CASHBACK_VALUE}}).</h4>
    </div>

    <button class="btn btn-danger" v-show="running" type="button" @click="startStop()">Stop Scanner!</button>
    <button
      class="btn btn-primary"
      v-show="!running"
      type="button"
      @click="startStop()"
    >Start Scanner!</button>

    <br>
    <div class="alert alert-success" v-show="running" role="alert">Scanner is Running !</div>
    <div class="alert alert-danger" v-show="!running" role="alert">Scanner is not Running !</div>

    <div class="jumbotron" v-show="consoleScanner != 'idle'">
      <h4>
        <span>
          Console information:
          <br>
        </span>
        <code>{{consoleScanner}}</code>
      </h4>
    </div>
    <div>
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
            <tr v-for="(item, index) in cashbacks" v-bind:key="index">
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
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
const database = require("./database/database");
const fs = require("fs");

export default {
  data() {
    return {
      running: false,
      consoleScanner: "idle",
      settings: {},
      productsFound: 0,
      cashBacksFound: 0,
      cashbacks: []
    };
  },
  methods: {
    async startStop() {
      if (this.running) {
        this.running = false;
        ipcRenderer.sendSync("running", false);
      } else {
        this.running = true;
        ipcRenderer.sendSync("running", true);
        await database.saveToJson("settings.json", this.settings);
      }
    },
    refresh() {
      try {
        let conRet = ipcRenderer.sendSync("consoleScanner", true);
        if (conRet.msg != this.consoleScanner) {
          if (conRet.msg.includes("cashback localized")) {
            this.cashBacksFound++;
            this.cashbacks.push(conRet.data);
          }
          if (
            conRet.msg.includes("product found") ||
            conRet.msg.includes("cashback localized")
          ) {
            this.productsFound++;
          }

          this.consoleScanner = conRet.msg;
          console.log(this.consoleScanner);
        }
         this.running = ipcRenderer.sendSync("status", true);

      } catch (error) {}
    },
    createJsons() {
      fs.writeFile(
        "teste.json",
        JSON.stringify([{ teste: "teste" }]),
        "utf8",
        err => {
          if (err) {
            alert(err);
          }
          alert("saved");
        }
      );
    }
  },
  mounted: function() {
    this.$nextTick(async function() {
      this.running = ipcRenderer.sendSync("status", true);
      this.settings = await database.loadJson("settings.json");
      console.log(this.settings);

      setInterval(this.refresh, 250);
    });
  },
  created: function() {
    setInterval(this.showConsoleStats, 250);
  }
};
</script>

<style>
.home {
  text-align: center;
  display: inline-block;
}
.div.tabs {
  text-align: center;
}
</style>
