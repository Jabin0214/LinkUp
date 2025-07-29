using System.Text.Json.Serialization;

namespace Models
{
    public class UniversityResponse
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("country")]
        public string Country { get; set; } = string.Empty;

        [JsonPropertyName("web_pages")]
        public string[]? WebPages { get; set; }

        [JsonPropertyName("alpha_two_code")]
        public string? CountryCode { get; set; }

        [JsonPropertyName("state-province")]
        public string? StateProvince { get; set; }

        [JsonPropertyName("domains")]
        public string[]? Domains { get; set; }
    }
}