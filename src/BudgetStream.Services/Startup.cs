using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//[assembly: FunctionsStartup(typeof(BudgetStream.Services.Startup))]

namespace BudgetStream.Services;



//internal class Startup : FunctionsStartup
//{
//    //public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
//    //{
        
//    //}

//    public override void Configure(IFunctionsHostBuilder builder)
//    {
//        var approot = builder.GetContext().ApplicationRootPath;
//        var config = new ConfigurationBuilder()
//            .SetBasePath(approot)
//            .AddJsonFile("local.settings.json", true, reloadOnChange: true)
//            .AddJsonFile("settings.json", true, reloadOnChange: true)
//            .Build();

//    }
//}
