define(function (require) {
    var dataServices = require('services/dataServices');

    function activate() {
        return dataServices.getMortgages().then(function (data) {
            var results = [];
            // wrap the mortgage in a selector proxy
            data.forEach(function (item) {
                var selector = {
                    selected: ko.observable(false),
                    mortgage: item
                };
                results.push(selector);
            });

            allMortgages(results);
        });
    }

    var allMortgages = ko.observableArray([]);

    var selectedMortgages = ko.computed(function () {
        var results = [];
        allMortgages().forEach(function (item) {
            if (item.selected()) {
                results.push(item.mortgage);
            }
        });

        return results;
    });

    var canSelect = ko.computed(function () {
        return selectedMortgages().length < 3;
    });

    var hasSelection = ko.computed(function () {
        return selectedMortgages().length > 1;
    });

    var bestMortgage = ko.computed(function () {
        if (selectedMortgages().length <= 1) {
            return;
        }

        var min = Number.MAX_VALUE, best;
        selectedMortgages().forEach(function (item) {
            if (item.totalCost() < min) {
                best = item;
                min = best.totalCost();
            }
        });

        return best;
    });

    return {
        allMortgages: allMortgages,
        selectedMortgages: selectedMortgages,
        canSelect: canSelect,
        hasSelection: hasSelection,
        bestMortgage: bestMortgage,
        activate: activate,
        clearCommand: ko.command({
            execute: function () {
                allMortgages().forEach(function (item) {
                    item.selected(false);
                });
            }
        })
    };
});