namespace MortgageApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDues : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Mortgages", "Dues", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Mortgages", "Dues");
        }
    }
}
