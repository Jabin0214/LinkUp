using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Data;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendController : ControllerBase
    {
        private readonly UserContext _context;

        public FriendController(UserContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        // GET: api/Friend
        [HttpGet]
        public async Task<ActionResult<object>> GetFriends(
            [FromQuery] int page = 1,
            [FromQuery] int size = 20,
            [FromQuery] string? search = null)
        {
            var currentUserId = GetCurrentUserId();

            var query = _context.Friends
                .Where(f => f.UserId == currentUserId || f.FriendUserId == currentUserId)
                .Include(f => f.User)
                .Include(f => f.FriendUser)
                .AsQueryable();

            var friendsData = await query.ToListAsync();

            // Extract unique friend users and avoid duplicates
            var friendUsers = friendsData
                .Select(f => f.UserId == currentUserId ? f.FriendUser : f.User)
                .GroupBy(u => u.Id)
                .Select(g => g.First())
                .ToList();

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                friendUsers = friendUsers.Where(u =>
                    u.Username.Contains(search) ||
                    u.FirstName.Contains(search) ||
                    u.LastName.Contains(search)).ToList();
            }

            var totalCount = friendUsers.Count();
            var friends = friendUsers
                .Skip((page - 1) * size)
                .Take(size)
                .Select(u => new FriendInfo
                {
                    Id = u.Id,
                    Username = u.Username,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    University = u.university,
                    FriendSince = friendsData.First(f =>
                        (f.UserId == currentUserId && f.FriendUserId == u.Id) ||
                        (f.FriendUserId == currentUserId && f.UserId == u.Id)).CreatedAt,
                    IsOnline = false // TODO: Implement online status
                })
                .OrderBy(f => f.Username)
                .ToList();

            return Ok(new
            {
                friends,
                pagination = new
                {
                    currentPage = page,
                    pageSize = size,
                    totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / size)
                }
            });
        }

        // POST: api/Friend/request
        [HttpPost("request")]
        public async Task<ActionResult<object>> SendFriendRequest([FromBody] SendFriendRequestDto dto)
        {
            var currentUserId = GetCurrentUserId();

            if (dto.ReceiverId == currentUserId)
            {
                return BadRequest("You cannot send a friend request to yourself");
            }

            // Check if receiver exists
            var receiver = await _context.Users.FindAsync(dto.ReceiverId);
            if (receiver == null || !receiver.IsActive)
            {
                return NotFound("User not found");
            }

            // Check if already friends
            var existingFriendship = await _context.Friends
                .FirstOrDefaultAsync(f =>
                    (f.UserId == currentUserId && f.FriendUserId == dto.ReceiverId) ||
                    (f.UserId == dto.ReceiverId && f.FriendUserId == currentUserId));

            if (existingFriendship != null)
            {
                return BadRequest("You are already friends with this user");
            }

            // Check if there's already a pending request
            var existingRequest = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    ((fr.SenderId == currentUserId && fr.ReceiverId == dto.ReceiverId) ||
                     (fr.SenderId == dto.ReceiverId && fr.ReceiverId == currentUserId)) &&
                    fr.Status == "Pending");

            if (existingRequest != null)
            {
                if (existingRequest.SenderId == currentUserId)
                {
                    return BadRequest("You have already sent a friend request to this user");
                }
                else
                {
                    return BadRequest("This user has already sent you a friend request");
                }
            }

            // Create new friend request
            var friendRequest = new FriendRequest
            {
                SenderId = currentUserId,
                ReceiverId = dto.ReceiverId,
                Message = dto.Message,
                Status = "Pending"
            };

            _context.FriendRequests.Add(friendRequest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request sent successfully" });
        }

        // GET: api/Friend/requests
        [HttpGet("requests")]
        public async Task<ActionResult<object>> GetFriendRequests([FromQuery] string type = "received")
        {
            var currentUserId = GetCurrentUserId();

            IQueryable<FriendRequest> query;

            if (type == "sent")
            {
                query = _context.FriendRequests
                    .Where(fr => fr.SenderId == currentUserId)
                    .Include(fr => fr.Receiver);
            }
            else
            {
                query = _context.FriendRequests
                    .Where(fr => fr.ReceiverId == currentUserId && fr.Status == "Pending")
                    .Include(fr => fr.Sender);
            }

            var requests = await query
                .OrderByDescending(fr => fr.CreatedAt)
                .Select(fr => new FriendRequestInfo
                {
                    Id = fr.Id,
                    SenderId = fr.SenderId,
                    SenderUsername = type == "sent" ? fr.Receiver.Username : fr.Sender.Username,
                    SenderFirstName = type == "sent" ? fr.Receiver.FirstName : fr.Sender.FirstName,
                    SenderLastName = type == "sent" ? fr.Receiver.LastName : fr.Sender.LastName,
                    SenderUniversity = type == "sent" ? fr.Receiver.university : fr.Sender.university,
                    Message = fr.Message,
                    Status = fr.Status,
                    CreatedAt = fr.CreatedAt
                })
                .ToListAsync();

            return Ok(new { requests });
        }

        // POST: api/Friend/respond
        [HttpPost("respond")]
        public async Task<ActionResult<object>> RespondToFriendRequest([FromBody] RespondFriendRequestDto dto)
        {
            var currentUserId = GetCurrentUserId();

            var friendRequest = await _context.FriendRequests
                .Include(fr => fr.Sender)
                .FirstOrDefaultAsync(fr => fr.Id == dto.RequestId && fr.ReceiverId == currentUserId);

            if (friendRequest == null)
            {
                return NotFound("Friend request not found");
            }

            if (friendRequest.Status != "Pending")
            {
                return BadRequest("This friend request has already been responded to");
            }

            if (dto.Action.ToLower() != "accept" && dto.Action.ToLower() != "reject")
            {
                return BadRequest("Action must be 'accept' or 'reject'");
            }

            // Update request status
            friendRequest.Status = dto.Action.ToLower() == "accept" ? "Accepted" : "Rejected";
            friendRequest.ResponsedAt = DateTime.UtcNow;

            // If accepted, create friendship (bidirectional)
            if (dto.Action.ToLower() == "accept")
            {
                var friendship1 = new Friend
                {
                    UserId = currentUserId,
                    FriendUserId = friendRequest.SenderId
                };

                var friendship2 = new Friend
                {
                    UserId = friendRequest.SenderId,
                    FriendUserId = currentUserId
                };

                _context.Friends.AddRange(friendship1, friendship2);
            }

            await _context.SaveChangesAsync();

            var message = dto.Action.ToLower() == "accept"
                ? "Friend request accepted successfully"
                : "Friend request rejected";

            return Ok(new { message });
        }

        // DELETE: api/Friend/{friendId}
        [HttpDelete("{friendId}")]
        public async Task<ActionResult<object>> RemoveFriend(int friendId)
        {
            var currentUserId = GetCurrentUserId();

            // Find the friendship (bidirectional)
            var friendships = await _context.Friends
                .Where(f =>
                    (f.UserId == currentUserId && f.FriendUserId == friendId) ||
                    (f.UserId == friendId && f.FriendUserId == currentUserId))
                .ToListAsync();

            if (!friendships.Any())
            {
                return NotFound("Friendship not found");
            }

            _context.Friends.RemoveRange(friendships);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend removed successfully" });
        }

        // GET: api/Friend/mutual/{userId}
        [HttpGet("mutual/{userId}")]
        public async Task<ActionResult<object>> GetMutualFriends(int userId)
        {
            var currentUserId = GetCurrentUserId();

            // Get current user's friends (both directions)
            var currentUserFriends = await _context.Friends
                .Where(f => f.UserId == currentUserId || f.FriendUserId == currentUserId)
                .Select(f => f.UserId == currentUserId ? f.FriendUserId : f.UserId)
                .Distinct()
                .ToListAsync();

            // Get target user's friends (both directions)
            var targetUserFriends = await _context.Friends
                .Where(f => f.UserId == userId || f.FriendUserId == userId)
                .Select(f => f.UserId == userId ? f.FriendUserId : f.UserId)
                .Distinct()
                .ToListAsync();

            // Find mutual friends
            var mutualFriendIds = currentUserFriends.Intersect(targetUserFriends).ToList();

            var mutualFriends = await _context.Users
                .Where(u => mutualFriendIds.Contains(u.Id))
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FirstName,
                    u.LastName,
                    u.university
                })
                .ToListAsync();

            return Ok(new { mutualFriends, count = mutualFriends.Count });
        }
    }
}