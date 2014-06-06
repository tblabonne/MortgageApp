namespace MortgageApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPmi : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Mortgages", "Pmi", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Mortgages", "Pmi");
        }
    }
}
