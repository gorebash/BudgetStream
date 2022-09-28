using System.Collections.Generic;
using System.Threading.Tasks;
using BudgetStream.Services.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Host;

namespace BudgetStream.Services.Functions;


public static class OrchestratorFunctions
{
    [FunctionName(nameof(TransactionsOrchestrator))]
    public static async Task<List<Transaction>> TransactionsOrchestrator (
        [OrchestrationTrigger] IDurableOrchestrationContext context)
    {
        var transactions = await context.CallActivityAsync<List<Transaction>>(
            nameof(ActivityFunctions.FetchTransactions), null);


        // save activity..

        return transactions;
    }
}
