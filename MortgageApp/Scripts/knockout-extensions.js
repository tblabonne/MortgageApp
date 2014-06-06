ko.bindingHandlers.money = {
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        var formatted = accounting.formatMoney(value);
        ko.bindingHandlers.text.update(element, function () { return formatted; });
    }
};

// basic pie chart binding handler - the data bound should be the data to flot
ko.bindingHandlers.pieChart = {
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        $.plot(element, value, {
            series: {
                pie: {
                    show: true
                }
            },
            legend: {
                show: false
            }
        });
    }
};

ko.observable.fn.numeric = function (precisionOrOptions) {
    var options = { defaultValue: 0, precision: 0 };
    if ($.isPlainObject(precisionOrOptions)) {
        options = precisionOrOptions;
    }
    else if ($.isNumeric(precisionOrOptions)) {
        options.precision = precisionOrOptions;
    }

    // value that shows precision digits
    this.value = ko.computed({
        read: function () {
            return accounting.toFixed(this(), options.precision);
        },
        write: function (newValue) {
            var current = this(),
                roundingMultiplier = Math.pow(10, options.precision),
                newValueAsNum = isNaN(newValue) ? options.defaultValue : parseFloat(+newValue),
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            //only write if it changed
            if (valueToWrite !== current) {
                this(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    this.notifySubscribers(valueToWrite);
                }
            }
        },
        owner: this
    });

    //initialize with current value
    this.value(this());
    return this;
};

ko.subscribable.fn.throttle = function (delay) {
    delay = delay || 1;
    this.extend({ throttle: delay });
    return this;
}

// maps a list of data items to model objects
ko.observableArray.fn.map = function (data, ctor) {
    var mapped = ko.utils.arrayMap(data, function (item) {
        return new ctor(item);
    });

    this(mapped);

    return this;
};