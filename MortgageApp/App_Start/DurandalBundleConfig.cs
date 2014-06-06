using System;
using System.Web.Optimization;

namespace MortgageApp {
  public class DurandalBundleConfig {
    public static void RegisterBundles(BundleCollection bundles) {
      bundles.IgnoreList.Clear();
      AddDefaultIgnorePatterns(bundles.IgnoreList);

	  bundles.Add(
		new ScriptBundle("~/Scripts/vendor.js")
			.Include("~/Scripts/jquery-{version}.js")
			.Include("~/Scripts/bootstrap.js")
			.Include("~/Scripts/knockout-{version}.js")
            .Include("~/Scripts/knockout-extensions.js")
            .Include("~/Scripts/accounting.js")
            .Include("~/Scripts/toastr.js")
            .Include("~/Scripts/knockout.dirtyFlag.js")
            .Include("~/Scripts/knockout.command.js")
            .Include("~/Scripts/knockout.activity.js")
            .Include("~/Scripts/flot/jquery.flot.js")
            .Include("~/Scripts/flot/jquery.flot.pie.js")
		);

      bundles.Add(
        new StyleBundle("~/Content/css")
          .Include("~/Content/ie10mobile.css")
          .Include("~/Content/bootstrap.min.css")
          .Include("~/Content/bootstrap-responsive.min.css")
          .Include("~/Content/font-awesome.min.css")
          .Include("~/Content/toastr.css")
		  .Include("~/Content/durandal.css")
          .Include("~/Content/starterkit.css")
        );
    }

    public static void AddDefaultIgnorePatterns(IgnoreList ignoreList) {
      if(ignoreList == null) {
        throw new ArgumentNullException("ignoreList");
      }

      ignoreList.Ignore("*.intellisense.js");
      ignoreList.Ignore("*-vsdoc.js");
      ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
      //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
      //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
    }
  }
}