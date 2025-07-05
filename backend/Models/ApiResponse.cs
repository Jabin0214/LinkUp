namespace Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public string? RequestId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> SuccessResponse(T data, string message = "Operation successful")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, string error)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error }
            };
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse SuccessResponse(string message = "Operation successful")
        {
            var response = new ApiResponse();
            response.Success = true;
            response.Message = message;
            return response;
        }

        public static ApiResponse ErrorResponse(string message, List<string>? errors = null)
        {
            var response = new ApiResponse();
            response.Success = false;
            response.Message = message;
            response.Errors = errors;
            return response;
        }

        public static ApiResponse ErrorResponse(string message, string error)
        {
            var response = new ApiResponse();
            response.Success = false;
            response.Message = message;
            response.Errors = new List<string> { error };
            return response;
        }
    }

    public class PagedApiResponse<T> : ApiResponse<T>
    {
        public PaginationInfo? Pagination { get; set; }

        public static PagedApiResponse<T> SuccessResponse(T data, PaginationInfo pagination, string message = "Operation successful")
        {
            return new PagedApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Pagination = pagination
            };
        }
    }

    public class PaginationInfo
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public bool HasPrevious => CurrentPage > 1;
        public bool HasNext => CurrentPage < TotalPages;
    }
}