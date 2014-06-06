define(function (require) {
    var router = require('plugins/router'),
        dataServices = require('services/dataServices'),
        Mortgage = require('models/mortgage');

    var mortgages = ko.observableArray([]);

    function activate() {
        return dataServices.getMortgages().then(function (data) {
            mortgages(data);
        });
    }

    return {
        activate: activate,
        mortgages: mortgages,
        createCommand: ko.command({
            execute: function () {
                router.navigate('mortgage');
            }
        })
    };
});