import { onRequest as __api_contact_js_onRequest } from "/Users/juliestromwall/Projects/technottape/functions/api/contact.js"
import { onRequest as __clients__middleware_js_onRequest } from "/Users/juliestromwall/Projects/technottape/functions/clients/_middleware.js"

export const routes = [
    {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_contact_js_onRequest],
    },
  {
      routePath: "/clients",
      mountPath: "/clients",
      method: "",
      middlewares: [__clients__middleware_js_onRequest],
      modules: [],
    },
  ]