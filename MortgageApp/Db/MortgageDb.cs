using MortgageApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MortgageApp.Db
{
    /// <summary>
    /// Represents the mortgages data context.
    /// </summary>
    public class MortgageDb : DbContext
    {
        public MortgageDb() : base("DefaultConnection") { }

        public DbSet<Mortgage> Mortgages { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Mortgage>().Property(o => o.Rate).HasPrecision(8, 4);
            modelBuilder.Entity<Mortgage>().Property(o => o.Term).HasPrecision(3, 0);
            
            base.OnModelCreating(modelBuilder);
        }
    }
}