<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Cashback retrieve</a>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" @click="swapContent('home-page')" href="#">
                  <span data-feather="home"></span>
                  Scanner
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="swapContent('url-scan')" href="#">
                  <span data-feather="layers"></span>
                  Urls to scan
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="swapContent('products')" href="#">
                  <span data-feather="layers"></span>
                  All Products
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="swapContent('cashback')" href="#">
                  <span data-feather="layers"></span>
                  Cashbacks
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="swapContent('system-information')" href="#">
                  <span data-feather="layers"></span>
                  Info
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
          >
          </div>
          <component class="tabs" :is="currentComp"></component>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import Home from "./Home";
import Urls from "./Urls";
import Products from "./Products"
import Cashback from "./Cashback"
export default {
  name: "landing-page",
  components: {
    "system-information": SystemInformation,
    "home-page": Home,
    "url-scan": Urls,
    "products": Products,
    "cashback": Cashback
  },
  data() {
    return {
      currentComp: "home-page"
    };
  },
  methods: {
    swapContent(to) {
      this.currentComp = to;
    }
  }
};
</script>

<style>
.tabs {
  max-width: 70%;

}
button{
  padding:6px
}
</style>
