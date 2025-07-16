using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Services;
using Models;

namespace Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : BaseController
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            try
            {
                var senderId = GetCurrentUserId();
                if (!senderId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Unauthorized" });
                }

                var message = await _messageService.SendMessageAsync(senderId.Value, request.ReceiverId, request.Content);
                return Ok(new ApiResponse { Success = true, Data = message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse { Success = false, Message = "Failed to send message" });
            }
        }

        [HttpGet("conversation/{userId}")]
        public async Task<IActionResult> GetConversation(int userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Unauthorized" });
                }

                var messages = await _messageService.GetConversationAsync(currentUserId.Value, userId, page, pageSize);
                return Ok(new ApiResponse { Success = true, Data = messages });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse { Success = false, Message = "Failed to get conversation" });
            }
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Unauthorized" });
                }

                var conversations = await _messageService.GetConversationsAsync(currentUserId.Value, page, pageSize);
                return Ok(new ApiResponse { Success = true, Data = conversations });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse { Success = false, Message = "Failed to get conversations" });
            }
        }

        [HttpPost("mark-read/{messageId}")]
        public async Task<IActionResult> MarkAsRead(int messageId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Unauthorized" });
                }

                var success = await _messageService.MarkAsReadAsync(messageId, currentUserId.Value);
                if (!success)
                {
                    return NotFound(new ApiResponse { Success = false, Message = "Message not found" });
                }

                return Ok(new ApiResponse { Success = true, Message = "Message marked as read" });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse { Success = false, Message = "Failed to mark message as read" });
            }
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                if (!currentUserId.HasValue)
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Unauthorized" });
                }

                var count = await _messageService.GetUnreadCountAsync(currentUserId.Value);
                return Ok(new ApiResponse { Success = true, Data = new { count } });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse { Success = false, Message = "Failed to get unread count" });
            }
        }
    }
}