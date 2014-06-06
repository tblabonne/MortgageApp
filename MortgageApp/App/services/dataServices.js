define(function (require) {
    var Mortgage = require('models/mortgage');

    function get(url) {
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json"
        });
    }

    function postOrPut(method, url, json) {
        return $.ajax({
            url: url,
            type: method,
            data: json,
            dataType: "json",
            contentType: "application/json"
        });
    }

    // gets a single Mortgage instance from an id
    function getMortgage(id) {
        return get("/api/mortgage/" + id).then(function (data) {
            return new Mortgage(data);
        });
    }

    // gets all mortgages
    function getMortgages() {
        return get("/api/mortgage").then(function (data) {
            var items = [];
            data.forEach(function (item) {
                items.push(new Mortgage(item));
            });
            return items;
        });
    }

    // gets a new mortgage with defaults set
    function getDefaultMortgage() {
        var defer = new $.Deferred(),
            defaults = {
                purchasePrice: 200000,
                downPayment: 40000,
                term: 30,
                rate: 4.5,
                propertyTax: 2000,
                name: "New Mortgage"
            };

        var mortgage = new Mortgage(defaults);
        // immediately resolve the promise so this function acts asynchronously even though
        // it really isn't
        return defer.resolve(mortgage);
    }

    // saves a mortgage to the server
    function saveMortgage(mortgage) {
        var url = "/api/mortgage",
            method;
        if (mortgage.id() === 0) {
            method = "POST";
        }
        else {
            url += "/" + mortgage.id();
            method = "PUT";
        }

        return postOrPut(method, url, ko.toJSON(mortgage)).then(function (data) {
            mortgage.id(data.id); // persist id as it may have been assigned by server
            return mortgage;
        });
    }

    // deletes a mortgage
    function deleteMortgage(id) {
        return $.ajax({
            url: "/api/mortgage/" + id,
            type: "DELETE"
        });
    }

    return {
        getMortgage: getMortgage,
        getMortgages: getMortgages,
        getDefaultMortgage: getDefaultMortgage,
        saveMortgage: saveMortgage,
        deleteMortgage: deleteMortgage
    };
});