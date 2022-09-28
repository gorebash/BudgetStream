using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BudgetStream.Services.Models
{
    public class PlaidResult
    {
        //public int Id { get; set; }
        //public string? Category { get; set; } = null;
        //public string Description { get; set; }


        public List<Transaction> Transactions { get; set; }

    }

    public class Transaction
    {
        [JsonPropertyName("account_id")]
        public string AccountId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        [JsonPropertyName("merchant_name")]
        public string MerchantName { get; set; }
        //[JsonPropertyName("category")]
        //public List<string> Categories { get; set; }

    }
}
