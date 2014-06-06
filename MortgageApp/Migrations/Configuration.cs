namespace MortgageApp.Migrations
{
    using MortgageApp.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<MortgageApp.Db.MortgageDb>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(MortgageApp.Db.MortgageDb context)
        {
            //context.Mortgages.AddOrUpdate(x => x.Name,
            //    new Mortgage()
            //    {
            //        Name = "Sample",
            //        DownPayment = 20000m,
            //        PropertyTax = 2000m,
            //        PurchasePrice = 200000m,
            //        Rate = 4.5m,
            //        Term = 30m
            //    });
        }
    }
}
