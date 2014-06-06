define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Mortgages', moduleId: 'viewmodels/mortgages', nav: true },
                { route: 'mortgage(/:id)', title: 'Mortgage', moduleId: 'viewmodels/mortgage', nav: true },
                { route: 'compare', title: "Compare", moduleId: 'viewmodels/compare', nav: true }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});