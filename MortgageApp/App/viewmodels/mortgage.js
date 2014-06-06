define(function (require) {
    var app = require('durandal/app'),
        router = require('plugins/router'),
        Mortgage = require('models/mortgage'),
        dataServices = require('services/dataServices');

    function save(mortgage) {
        var newMortgage = mortgage.id() === 0;
        return dataServices.saveMortgage(mortgage).then(function (mortgage) {
            viewModel.dirtyFlag().reset();
            toastr.info("Saved.");

            // set route if just saved a new mortgage
            if (newMortgage) {
                router.navigate('mortgage/' + mortgage.id(), { replace: true, trigger: false });
            }
        });
    }

    function deleteMortgage(mortgage) {
        if (mortgage.id() === 0) {
            router.navigate('');
            return;
        }

        return app.showMessage("Are you sure you want to delete '" + mortgage.name() + "'?", "Mortgage App", ["Yes", "No"])
           .then(function (dialogResult) {
               if (dialogResult === "Yes") {
                   return dataServices.deleteMortgage(mortgage.id()).then(function () {
                       toastr.info("Mortgage deleted.");
                       router.navigate('');
                   });
               }
           });
    }

    function amortize() {
        var defer = new $.Deferred(),
            yearly = viewModel.amortizationOption() === "YEAR";

        setTimeout(function () {
            var data = viewModel.mortgage().buildAmortizationData(yearly);
            viewModel.amortizationData(data);
            defer.resolve();
        }, 0);

        return defer;
    }

    var viewModel = {
        mortgage: ko.observable(),
        amortizationData: ko.observableArray(),
        amortizationOption: ko.observable("MONTH")
    };

    // dirty flag
    viewModel.dirtyFlag = new ko.DirtyFlag(viewModel.mortgage);

    // fires when the view activates passing parameters to it
    viewModel.activate = function (id, qs) {
        var that = this,
            getter = id ? dataServices.getMortgage : dataServices.getDefaultMortgage;

        return getter(id).then(function (mortgage) {
            // do copying by making it into a new one
            if (qs && qs.hasOwnProperty("copy")) {
                mortgage.id(0);
                mortgage.name("Copy of " + mortgage.name());
            }

            that.mortgage(mortgage);
            // clean on initial load if not a new mortgage
            if (mortgage.id()) {
                that.dirtyFlag().reset();
            }
        });
    };

    // fires just before deactivation - ask if we can save
    viewModel.canDeactivate = function (isClose) {
        if (!viewModel.dirtyFlag().isDirty()) {
            return true;
        }

        return app.showMessage("Do you want to save changes to this mortgage?", "Mortgage App", ["Yes", "No"])
                  .then(function (dialogResult) {
                      if (dialogResult === "No") {
                          return true;
                      }

                      return save(viewModel.mortgage()).then(function () {
                          return true;
                      });
                  });
    };

    viewModel.saveCommand = ko.asyncCommand({
        execute: function (callback) {
            save(this.mortgage()).then(callback);
        },
        canExecute: function (isExecuting) {
            return !isExecuting && viewModel.dirtyFlag().isDirty();
        }
    });

    viewModel.deleteCommand = ko.asyncCommand({
        execute: function (callback) {
            deleteMortgage(this.mortgage()).then(callback);
        },
        canExecute: function (isExecuting) {
            if (viewModel.mortgage()) {
                return !isExecuting && viewModel.mortgage().id() !== 0;
            }

            return false;
        }
    });

    viewModel.copyCommand = ko.command({
        execute: function () {
            router.navigate('mortgage/' + viewModel.mortgage().id() + '?copy');
        }
    });

    viewModel.amortizeCommand = ko.asyncCommand({
        execute: function (callback) {
            amortize().then(callback);
        }
    });

    viewModel.amortizeOptionCommand = ko.asyncCommand({
        execute: function (callback) {
            amortize().then(callback);
        }
    });

    // collect data for the chart to bind to
    viewModel.chartData = ko.computed(function () {
        if (this.mortgage()) {
            var data = [
                { label: "Principal", data: this.mortgage().totalPrincipal() },
                { label: "Interest", data: this.mortgage().totalInterest() },
                { label: "Taxes", data: this.mortgage().totalTaxes() },
                { label: "PMI", data: this.mortgage().totalPmi() },
                { label: "Dues", data: this.mortgage().totalDues() }
            ];
            return data;
        }
        else {
            return [];
        }
    }, viewModel).throttle();

    return viewModel;
});