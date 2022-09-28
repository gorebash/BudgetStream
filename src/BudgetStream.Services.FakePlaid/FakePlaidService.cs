using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace BudgetStream.Services.FakePlaid
{
    public static class FakePlaidService
    {
        /**
         * Result json mimics response from plaid transactions/get api.
         * https://plaid.com/docs/api/products/transactions/#transactionsget
         */
        [FunctionName(nameof(TransactionsGet))]
        public static async Task<string> TransactionsGet(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "fake/transactions/get")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var path = Path.Combine(context.FunctionAppDirectory, "Data", "TransactionsGet.json");
            var json = File.ReadAllText(path);

            return json;
        }
    }
}
