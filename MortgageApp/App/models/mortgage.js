define(function (require) {
    // represents a mortgage model and all of the necessary calculations involved
    var Mortgage = function (data) {
        this.id = ko.observable(data.id || 0);
        this.name = ko.observable(data.name || "");
        this.purchasePrice = ko.observable(data.purchasePrice || 0).numeric(0);
        this.downPayment = ko.observable(data.downPayment || 0).numeric(0);
        this.rate = ko.observable(data.rate || 0).numeric(3);
        this.term = ko.observable(data.term || 0).numeric(0);
        this.propertyTax = ko.observable(data.propertyTax || 0).numeric(0);
        this.pmi = ko.observable(data.pmi || 0).numeric(0);
        this.dues = ko.observable(data.dues || 0).numeric(0);

        this.propertyTaxPerMonth = ko.computed(function () {
            return this.propertyTax() / 12;
        }, this);

        this.termInMonths = ko.computed(function () {
            return this.term() * 12;
        }, this);

        this.monthlyPayment = ko.computed(function () {
            var r = this.rate() / 100 / 12,
                p = this.purchasePrice() - this.downPayment(),
                n = this.termInMonths(),
                c = (p * r) * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            return c;
        }, this);

        this.monthlyPaymentWithTaxesAndFees = ko.computed(function () {
            return this.monthlyPayment() + this.propertyTaxPerMonth() + this.pmi() + this.dues();
        }, this);

        this.totalPrincipal = ko.computed(function () {
            return this.purchasePrice() - this.downPayment();
        }, this);

        this.ltv = ko.computed(function () {
            return Math.round(this.totalPrincipal() / this.purchasePrice() * 100);
        }, this);

        this.totalInterest = ko.computed(function () {
            return this.monthlyPayment() * this.termInMonths() - this.totalPrincipal();
        }, this);

        this.totalTaxes = ko.computed(function () {
            return this.propertyTax() * this.term();
        }, this);

        this.totalPmi = ko.computed(function () {
            return this.pmi() * this.termInMonths();
        }, this);

        this.totalDues = ko.computed(function () {
            return this.dues() * this.termInMonths();
        }, this);

        this.totalCost = ko.computed(function () {
            return this.totalPrincipal() + this.totalInterest() + this.totalTaxes() + this.totalPmi() + this.totalDues();
        }, this);
    };

    function calcMonthlyAmortization(mortgage) {
        var principal = mortgage.totalPrincipal(),
            months = mortgage.termInMonths(),
            rate = mortgage.rate() / 100 / 12,
            results = [];
        for (var i = 1; i <= months; i++) {

            var payment = mortgage.monthlyPayment(),
                interest = Math.round(principal * rate * 100) / 100;

            var data = {
                period: i,
                payment: payment,
                principal: payment - interest,
                interest: interest,
                balance: principal - (payment - interest)
            };

            principal -= data.principal;

            results.push(data);
        }

        return results;
    }

    function calcYearlyAmortization(mortgage) {
        var amortization = calcMonthlyAmortization(mortgage),
            results = [],
            payments = 0,
            principal = 0,
            interest = 0;

        for (var i = 1; i <= amortization.length; i++) {
            var data = amortization[i - 1];
            payments += data.payment;
            principal += data.principal;
            interest += data.interest;

            if ((i % 12) === 0) {
                var yearData = {
                    period: i / 12,
                    payment: payments,
                    principal: principal,
                    interest: interest,
                    balance: data.balance
                };

                results.push(yearData);

                payments = principal = interest = 0;
            }
        }

        return results;
    }

    // this function builds a table of amortization data for each of the payment periods
    Mortgage.prototype.buildAmortizationData = function (yearly) {
        if (yearly) {
            return calcYearlyAmortization(this);
        }

        return calcMonthlyAmortization(this);
    };

    return Mortgage;
});