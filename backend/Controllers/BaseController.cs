using Microsoft.AspNetCore.Mvc;
using Models;
using System.Security.Claims;

namespace Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        protected string GetCurrentUsername()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
        }

        protected IActionResult Success<T>(T data, string message = "Operation successful")
        {
            var response = ApiResponse<T>.SuccessResponse(data, message);
            response.RequestId = HttpContext.TraceIdentifier;
            return Ok(response);
        }

        protected IActionResult Success(string message = "Operation successful")
        {
            var response = ApiResponse.SuccessResponse(message);
            response.RequestId = HttpContext.TraceIdentifier;
            return Ok(response);
        }

        protected IActionResult PagedSuccess<T>(T data, PaginationInfo pagination, string message = "Operation successful")
        {
            var response = PagedApiResponse<T>.SuccessResponse(data, pagination, message);
            response.RequestId = HttpContext.TraceIdentifier;
            return Ok(response);
        }

        protected IActionResult BadRequest(string message, List<string>? errors = null)
        {
            var response = ApiResponse.ErrorResponse(message, errors);
            response.RequestId = HttpContext.TraceIdentifier;
            return base.BadRequest(response);
        }

        protected IActionResult BadRequest(string message, string error)
        {
            var response = ApiResponse.ErrorResponse(message, error);
            response.RequestId = HttpContext.TraceIdentifier;
            return base.BadRequest(response);
        }

        protected IActionResult NotFound(string message = "Resource not found")
        {
            var response = ApiResponse.ErrorResponse(message);
            response.RequestId = HttpContext.TraceIdentifier;
            return base.NotFound(response);
        }

        protected IActionResult Unauthorized(string message = "Unauthorized access")
        {
            var response = ApiResponse.ErrorResponse(message);
            response.RequestId = HttpContext.TraceIdentifier;
            return base.Unauthorized(response);
        }

        protected IActionResult Forbidden(string message = "Access forbidden")
        {
            var response = ApiResponse.ErrorResponse(message);
            response.RequestId = HttpContext.TraceIdentifier;
            return StatusCode(403, response);
        }

        protected IActionResult InternalServerError(string message = "Internal server error")
        {
            var response = ApiResponse.ErrorResponse(message);
            response.RequestId = HttpContext.TraceIdentifier;
            return StatusCode(500, response);
        }

        protected IActionResult ValidationError(List<string> errors)
        {
            var response = ApiResponse.ErrorResponse("Validation failed", errors);
            response.RequestId = HttpContext.TraceIdentifier;
            return base.BadRequest(response);
        }
    }
}