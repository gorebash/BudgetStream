using BudgetStream.Services.Models;
using Dynamitey.DynamicObjects;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace BudgetStream.Services.Functions
{
    public class ActivityFunctions
    {
        [FunctionName(nameof(FetchTransactions))]
        public static async Task<List<Transaction>> FetchTransactions([ActivityTrigger] ILogger log)
        {
            var client = new HttpClient();
            var result = await client.GetFromJsonAsync<PlaidResult>(
                Environment.GetEnvironmentVariable("FAKE_PLAID_API"),
                new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    
                });


            return result.Transactions;
        }


        //[FunctionName(nameof(SaveNewTransactions))]
        //public static void SaveNewTransactions([ActivityTrigger] List<Transaction> transactions, ILogger log,
        //    [CosmosDB(
        //        databaseName: "ToDoItems",
        //        collectionName: "Items",
        //        ConnectionStringSetting = "CosmosDBConnection")]out dynamic document)
        //{
        //    // todo: filter to only new transactions, or...
        //    // todo: use plaid webhook to call instead w/o need to filter
        //    // todo: maybe just add the output binding to the retrieval activity and combine?

        //    document = transactions;
        //}
    }
}