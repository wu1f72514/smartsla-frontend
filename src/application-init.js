import VueAxios from "vue-axios";
import OpenPaaS from "vue-openpaas-components";
import Vuetify from "vuetify";
import colors from "vuetify/es5/util/colors";
import VueScrollTo from "vue-scrollto";
import VueClipboard from "vue-clipboard2";

import App from "@/App";
import router from "@/router";
import { api, auth as servicesAuth } from "@/services";
import ApplicationSettings from "@/services/application-settings";
import store from "@/store";
import i18n from "@/i18n";
import moment from "moment-timezone";
import { DEFAULT_TIMEZONE } from "@/constants.js";

moment.tz.setDefault(DEFAULT_TIMEZONE.value);

const defaultTheme = {
  primary: colors.blue
};

// This prevents polluting the global Axios and Vue instances
// See for instance : https://github.com/vuetifyjs/vuetify/issues/4068#issuecomment-446988490
function applicationInit(VueInstance, { axiosInstance = api, auth = servicesAuth, theme = defaultTheme } = {}) {
  VueInstance.use(OpenPaaS);
  VueInstance.use(VueScrollTo);
  VueClipboard.config.autoSetContainer = true;
  VueInstance.use(VueClipboard);
  VueInstance.use(VueAxios, axiosInstance);
  axiosInstance.defaults.baseURL = store.state.applicationConfiguration.baseUrl;

  VueInstance.router = router;

  VueInstance.use(require("@websanova/vue-auth"), auth);

  VueInstance.use(Vuetify, { theme });

  VueInstance.config.productionTip = false;

  VueInstance.prototype.moment = moment;

  return VueInstance;
}

function getApplication(VueInstance) {
  const Application = new VueInstance({
    router,
    store,
    i18n: i18n(VueInstance),
    render: h => h(App)
  }).$mount("#app");

  Application.ApplicationSettings = ApplicationSettings;

  return Application;
}

export { ApplicationSettings, applicationInit, defaultTheme, getApplication };
