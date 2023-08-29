/* eslint-disable no-cond-assign */
import maxBy from 'lodash/maxBy';

export function getPageRoutes(importMap) {
  const routes = import.meta.glob(['/routes/**/+layout.vue', '/routes/**/+page.vue'], {
    eager: true,
  });

  const c_routes = Object.keys(routes);
  const x_routes = [];

  const hasRootLayout = c_routes.includes('/routes/+layout.vue');

  c_routes.forEach((path) => {
    let level = 0;

    if (hasRootLayout) {
      level += 1;
    }

    const _key = path;
    path = path.replace('/routes', '').replace('layout.vue', '').replace('/+page.vue', '');

    // /(group) ->
    path = path.replace(/\/\(.+?\)/g, '');
    if (!path) path += '/';

    // /[...rest] -> /:rest*
    path = path.replace(/\[\.\.\.([^\]]+)\]/g, ':$1*');

    // /[[id]] -> /:id?
    path = path.replace(/\[\[(.+?)\]\]/g, ':$1?');

    // /[id] -> /:id
    path = path.replace(/\[(.+?)\]/g, ':$1');

    const key = _key
      .replace('/routes', '')
      .replace('+layout.vue', '')
      .replace('+page.vue', '')
      .split('/')
      .filter(Boolean)
      .join('/');

    const component = routes[_key].default;
    const getServerSideProps = routes[_key].getServerSideProps;

    if (path.includes('/+')) {
      x_routes.push({
        route: { path: path.replace('/+', '/*'), component, children: [], getServerSideProps },
        level,
        key,
      });
    } else {
      x_routes.push({ route: { path, component, getServerSideProps }, level, key });
    }
  });

  x_routes.forEach((item) => {
    if (item.key) {
      x_routes
        .filter((route) => route.key && Array.isArray(route.route.children))
        .forEach((route) => {
          if (item.key.startsWith(route.key)) {
            item.level += 1;
          }
        });
    }
  });

  function createRoutes(routes, level = 0, curArr = [], curKeysArr = []) {
    const arr = [];
    const keysArr = [];

    const layouts = routes.filter((r) => Array.isArray(r.route.children));

    let maxLevelOfLayouts = 0;

    if (layouts.length) {
      maxLevelOfLayouts = Number(maxBy(layouts, (item) => item.level)?.level) - level;
    } else {
      return routes.map((r) => r.route);
    }

    if (maxLevelOfLayouts === 0) {
      if (!hasRootLayout) {
        const rootRoutes = routes.filter((r) => r.level === 0).map((r) => r.route);
        return [...rootRoutes, ...curArr];
      }

      return curArr;
    }

    const layoutsMaxLevel = layouts.filter((l) => l.level === maxLevelOfLayouts);

    for (let i = 0; i < layoutsMaxLevel.length; i++) {
      const layout = layoutsMaxLevel[i];

      const cur = {};
      cur.path = layout.route.path;
      cur.component = layout.route.component;

      if (curKeysArr.join(',').includes(layout.key)) {
        const sameLayer = routes
          .filter(
            (r) => r.key.includes(layout.key) && !r.route.children && r.level === maxLevelOfLayouts,
          )
          .map((r) => r.route);

        cur.children = [...curArr, ...sameLayer];
      } else {
        cur.children = routes
          .filter((r) => r.key.includes(layout.key) && !r.route.children)
          .map((r) => r.route);
      }

      arr.push(cur);
      keysArr.push(layout.key);
    }

    return createRoutes(routes, level + 1, arr, keysArr);
  }

  return createRoutes(x_routes);
}

export function createPageManager({ ctx, router, routes, ssr }) {
  return (instance) => {
    const globalProperties = instance.config.globalProperties;
    globalProperties.$error = null;
    if (ssr) {
      // Populate serverSideProps with SSR context data
      globalProperties.$serverSideProps = ctx.serverSideProps;
    } else {
      // Populate serverSideProps with hydrated SSR context data if avilable
      globalProperties.$serverSideProps = window.hydration.serverSideProps;
    }
    // A way to quickly access getServerSideProps by matched path
    const routeMap = Object.fromEntries(
      routes.map(({ path, getServerSideProps }) => {
        return [path, getServerSideProps];
      }),
    );
    // Set up Vue Router hook
    if (!import.meta.env.SSR) {
      router.beforeEach(async (to) => {
        // Ensure hydration is always reset after a page renders
        window.hydration = {};
        // If getServerSideProps is set...
        if (routeMap[to.matched[0].path]) {
          await fetch(`/json${to.path}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.statusCode === 500) {
                globalProperties.$error = data.message;
              } else {
                globalProperties.$serverSideProps = data;
              }
            })
            .catch((error) => {
              globalProperties.$error = error;
            });
        }
      });
    }
  };
}
