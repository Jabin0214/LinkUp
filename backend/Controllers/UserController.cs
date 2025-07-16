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
    public class UserController : ControllerBase
    {
        private readonly UserContext _context;

        public UserController(UserContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        // GET: api/User/discover
        [HttpGet("discover")]
        public async Task<ActionResult<object>> DiscoverUsers(
            [FromQuery] int page = 1,
            [FromQuery] int size = 20,
            [FromQuery] string? university = null,
            [FromQuery] string? search = null)
        {
            var currentUserId = GetCurrentUserId();
            var query = _context.Users
                .Where(u => u.Id != currentUserId && u.IsActive)
                .AsQueryable();

            // Filter by university if specified
            if (!string.IsNullOrEmpty(university))
            {
                query = query.Where(u => u.university == university);
            }

            // Search by name or username
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.Username.Contains(search) ||
                    u.FirstName.Contains(search) ||
                    u.LastName.Contains(search));
            }

            // Get current user's university for priority sorting
            var currentUser = await _context.Users.FindAsync(currentUserId);
            var currentUserUniversity = currentUser?.university;

            // Sort: same university first, then by join date
            if (!string.IsNullOrEmpty(currentUserUniversity))
            {
                query = query.OrderByDescending(u => u.university == currentUserUniversity)
                           .ThenByDescending(u => u.CreatedAt);
            }
            else
            {
                query = query.OrderByDescending(u => u.CreatedAt);
            }

            var totalCount = await query.CountAsync();
            var usersData = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            // Get friend status for all users in batch
            var userIds = usersData.Select(u => u.Id).ToList();
            var friendships = await _context.Friends
                .Where(f =>
                    (f.UserId == currentUserId && userIds.Contains(f.FriendUserId)) ||
                    (f.FriendUserId == currentUserId && userIds.Contains(f.UserId)))
                .ToListAsync();

            var pendingRequests = await _context.FriendRequests
                .Where(fr =>
                    ((fr.SenderId == currentUserId && userIds.Contains(fr.ReceiverId)) ||
                     (fr.ReceiverId == currentUserId && userIds.Contains(fr.SenderId))) &&
                    fr.Status == "Pending")
                .ToListAsync();

            var users = usersData.Select(u => new
            {
                u.Id,
                u.Username,
                u.FirstName,
                u.LastName,
                u.university,
                JoinedAt = u.CreatedAt,
                IsSchoolmate = u.university == currentUserUniversity && !string.IsNullOrEmpty(currentUserUniversity),
                IsFriend = friendships.Any(f =>
                    (f.UserId == currentUserId && f.FriendUserId == u.Id) ||
                    (f.FriendUserId == currentUserId && f.UserId == u.Id)),
                HasPendingRequest = pendingRequests.Any(pr =>
                    (pr.SenderId == currentUserId && pr.ReceiverId == u.Id) ||
                    (pr.ReceiverId == currentUserId && pr.SenderId == u.Id)),
                FriendRequestStatus = pendingRequests
                    .Where(pr =>
                        (pr.SenderId == currentUserId && pr.ReceiverId == u.Id) ||
                        (pr.ReceiverId == currentUserId && pr.SenderId == u.Id))
                    .Select(pr => pr.SenderId == currentUserId ? "sent" : "received")
                    .FirstOrDefault()
            }).ToList();

            return Ok(new
            {
                users,
                pagination = new
                {
                    currentPage = page,
                    pageSize = size,
                    totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / size)
                }
            });
        }

        // GET: api/User/{id}/profile
        [HttpGet("{id}/profile")]
        public async Task<ActionResult<UserPublicProfile>> GetUserProfile(int id)
        {
            var currentUserId = GetCurrentUserId();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

            SkillBoard? skillBoard = null;
            if (user != null)
            {
                skillBoard = await _context.SkillBoards
                    .Include(s => s.Items)
                    .FirstOrDefaultAsync(s => s.UserId == id);
            }

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Check friendship status
            var friendship = await _context.Friends
                .FirstOrDefaultAsync(f =>
                    (f.UserId == currentUserId && f.FriendUserId == id) ||
                    (f.UserId == id && f.FriendUserId == currentUserId));

            // Check pending friend requests
            var pendingRequest = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    ((fr.SenderId == currentUserId && fr.ReceiverId == id) ||
                     (fr.SenderId == id && fr.ReceiverId == currentUserId)) &&
                    fr.Status == "Pending");

            var profile = new UserPublicProfile
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                University = user.university,
                JoinedAt = user.CreatedAt,
                IsFriend = friendship != null,
                HasPendingRequest = pendingRequest != null,
                FriendRequestStatus = pendingRequest != null
                    ? (pendingRequest.SenderId == currentUserId ? "sent" : "received")
                    : null
            };

            // Include skill board if exists
            if (skillBoard != null)
            {
                profile.SkillBoard = new SkillBoardInfo
                {
                    Introduction = skillBoard.Introduction,
                    Direction = skillBoard.Direction,
                    Skills = skillBoard.Items
                        .Where(i => i.Type == "skill")
                        .OrderBy(i => i.Order)
                        .Select(s => new SkillItemInfo
                        {
                            Language = s.Content,
                            Level = s.Level ?? ""
                        }).ToList(),
                    Links = skillBoard.Items
                        .Where(i => i.Type == "link")
                        .OrderBy(i => i.Order)
                        .Select(l => new LinkItemInfo
                        {
                            Title = l.Content,
                            Url = l.Url ?? ""
                        }).ToList()
                };
            }

            return Ok(profile);
        }

        // GET: api/User/universities
        [HttpGet("universities")]
        public async Task<ActionResult<object>> GetUniversities([FromQuery] string? search = null)
        {
            var query = _context.Users
                .Where(u => u.IsActive && !string.IsNullOrEmpty(u.university))
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.university!.Contains(search));
            }

            var universities = await query
                .GroupBy(u => u.university)
                .Select(g => new
                {
                    name = g.Key,
                    userCount = g.Count()
                })
                .OrderByDescending(u => u.userCount)
                .Take(50)
                .ToListAsync();

            return Ok(universities);
        }

        // GET: api/User/search
        [HttpGet("search")]
        public async Task<ActionResult<object>> SearchUsers([FromQuery] string query, [FromQuery] int limit = 10)
        {
            if (string.IsNullOrEmpty(query) || query.Length < 2)
            {
                return Ok(new { users = new List<object>() });
            }

            var currentUserId = GetCurrentUserId();
            var users = await _context.Users
                .Where(u => u.Id != currentUserId && u.IsActive &&
                    (u.Username.Contains(query) ||
                     u.FirstName.Contains(query) ||
                     u.LastName.Contains(query)))
                .Take(limit)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FirstName,
                    u.LastName,
                    u.university
                })
                .ToListAsync();

            return Ok(new { users });
        }
    }
}