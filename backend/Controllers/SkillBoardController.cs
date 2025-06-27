using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Models;
using Data;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SkillBoardController : ControllerBase
    {
        private readonly UserContext _context;

        public SkillBoardController(UserContext context)
        {
            _context = context;
        }

        // GET: api/SkillBoard
        [HttpGet]
        public async Task<ActionResult<SkillBoardResponse>> GetSkillBoard()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var skillBoard = await _context.SkillBoards
                .Include(sb => sb.Skills.OrderBy(s => s.Order))
                .Include(sb => sb.Links.OrderBy(l => l.Order))
                .FirstOrDefaultAsync(sb => sb.UserId == userId);

            if (skillBoard == null)
            {
                return NotFound(new { message = "SkillBoard not found for this user" });
            }

            var response = new SkillBoardResponse
            {
                Id = skillBoard.Id,
                UserId = skillBoard.UserId,
                Introduction = skillBoard.Introduction,
                Direction = skillBoard.Direction,
                CreatedAt = skillBoard.CreatedAt,
                UpdatedAt = skillBoard.UpdatedAt,
                Skills = skillBoard.Skills.Select(s => new SkillItemDto
                {
                    Id = s.Id,
                    Language = s.Language,
                    Level = s.Level,
                    Order = s.Order
                }).ToList(),
                Links = skillBoard.Links.Select(l => new LinkItemDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Url = l.Url,
                    Order = l.Order
                }).ToList()
            };

            return Ok(response);
        }

        // GET: api/SkillBoard/user/{userId}
        [HttpGet("user/{userId}")]
        [AllowAnonymous] // 允许匿名访问查看其他用户的技能板
        public async Task<ActionResult<SkillBoardResponse>> GetSkillBoardByUserId(int userId)
        {
            var skillBoard = await _context.SkillBoards
                .Include(sb => sb.Skills.OrderBy(s => s.Order))
                .Include(sb => sb.Links.OrderBy(l => l.Order))
                .FirstOrDefaultAsync(sb => sb.UserId == userId);

            if (skillBoard == null)
            {
                return NotFound(new { message = "SkillBoard not found for this user" });
            }

            var response = new SkillBoardResponse
            {
                Id = skillBoard.Id,
                UserId = skillBoard.UserId,
                Introduction = skillBoard.Introduction,
                Direction = skillBoard.Direction,
                CreatedAt = skillBoard.CreatedAt,
                UpdatedAt = skillBoard.UpdatedAt,
                Skills = skillBoard.Skills.Select(s => new SkillItemDto
                {
                    Id = s.Id,
                    Language = s.Language,
                    Level = s.Level,
                    Order = s.Order
                }).ToList(),
                Links = skillBoard.Links.Select(l => new LinkItemDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Url = l.Url,
                    Order = l.Order
                }).ToList()
            };

            return Ok(response);
        }

        // POST: api/SkillBoard
        [HttpPost]
        public async Task<ActionResult<SkillBoardResponse>> CreateSkillBoard(CreateSkillBoardRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // 检查用户是否已经有技能板
            var existingSkillBoard = await _context.SkillBoards
                .FirstOrDefaultAsync(sb => sb.UserId == userId);

            if (existingSkillBoard != null)
            {
                return BadRequest(new { message = "User already has a skill board. Use PUT to update." });
            }

            var skillBoard = new SkillBoard
            {
                UserId = userId,
                Introduction = request.Introduction,
                Direction = request.Direction,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.SkillBoards.Add(skillBoard);
            await _context.SaveChangesAsync();

            // 添加技能项
            if (request.Skills.Any())
            {
                var skills = request.Skills.Select((skill, index) => new SkillItem
                {
                    SkillBoardId = skillBoard.Id,
                    Language = skill.Language,
                    Level = skill.Level,
                    Order = skill.Order > 0 ? skill.Order : index
                }).ToList();

                _context.SkillItems.AddRange(skills);
            }

            // 添加链接项
            if (request.Links.Any())
            {
                var links = request.Links.Select((link, index) => new LinkItem
                {
                    SkillBoardId = skillBoard.Id,
                    Title = link.Title,
                    Url = link.Url,
                    Order = link.Order > 0 ? link.Order : index
                }).ToList();

                _context.LinkItems.AddRange(links);
            }

            await _context.SaveChangesAsync();

            // 重新获取包含关联数据的技能板
            var createdSkillBoard = await _context.SkillBoards
                .Include(sb => sb.Skills.OrderBy(s => s.Order))
                .Include(sb => sb.Links.OrderBy(l => l.Order))
                .FirstAsync(sb => sb.Id == skillBoard.Id);

            var response = new SkillBoardResponse
            {
                Id = createdSkillBoard.Id,
                UserId = createdSkillBoard.UserId,
                Introduction = createdSkillBoard.Introduction,
                Direction = createdSkillBoard.Direction,
                CreatedAt = createdSkillBoard.CreatedAt,
                UpdatedAt = createdSkillBoard.UpdatedAt,
                Skills = createdSkillBoard.Skills.Select(s => new SkillItemDto
                {
                    Id = s.Id,
                    Language = s.Language,
                    Level = s.Level,
                    Order = s.Order
                }).ToList(),
                Links = createdSkillBoard.Links.Select(l => new LinkItemDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Url = l.Url,
                    Order = l.Order
                }).ToList()
            };

            return CreatedAtAction(nameof(GetSkillBoard), response);
        }

        // PUT: api/SkillBoard
        [HttpPut]
        public async Task<ActionResult<SkillBoardResponse>> UpdateSkillBoard(UpdateSkillBoardRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var skillBoard = await _context.SkillBoards
                .Include(sb => sb.Skills)
                .Include(sb => sb.Links)
                .FirstOrDefaultAsync(sb => sb.UserId == userId);

            if (skillBoard == null)
            {
                return NotFound(new { message = "SkillBoard not found for this user" });
            }

            // 更新基本信息
            skillBoard.Introduction = request.Introduction;
            skillBoard.Direction = request.Direction;
            skillBoard.UpdatedAt = DateTime.UtcNow;

            // 删除现有的技能和链接
            _context.SkillItems.RemoveRange(skillBoard.Skills);
            _context.LinkItems.RemoveRange(skillBoard.Links);

            // 添加新的技能项
            if (request.Skills.Any())
            {
                var skills = request.Skills.Select((skill, index) => new SkillItem
                {
                    SkillBoardId = skillBoard.Id,
                    Language = skill.Language,
                    Level = skill.Level,
                    Order = skill.Order > 0 ? skill.Order : index
                }).ToList();

                _context.SkillItems.AddRange(skills);
            }

            // 添加新的链接项
            if (request.Links.Any())
            {
                var links = request.Links.Select((link, index) => new LinkItem
                {
                    SkillBoardId = skillBoard.Id,
                    Title = link.Title,
                    Url = link.Url,
                    Order = link.Order > 0 ? link.Order : index
                }).ToList();

                _context.LinkItems.AddRange(links);
            }

            await _context.SaveChangesAsync();

            // 重新获取更新后的数据
            var updatedSkillBoard = await _context.SkillBoards
                .Include(sb => sb.Skills.OrderBy(s => s.Order))
                .Include(sb => sb.Links.OrderBy(l => l.Order))
                .FirstAsync(sb => sb.Id == skillBoard.Id);

            var response = new SkillBoardResponse
            {
                Id = updatedSkillBoard.Id,
                UserId = updatedSkillBoard.UserId,
                Introduction = updatedSkillBoard.Introduction,
                Direction = updatedSkillBoard.Direction,
                CreatedAt = updatedSkillBoard.CreatedAt,
                UpdatedAt = updatedSkillBoard.UpdatedAt,
                Skills = updatedSkillBoard.Skills.Select(s => new SkillItemDto
                {
                    Id = s.Id,
                    Language = s.Language,
                    Level = s.Level,
                    Order = s.Order
                }).ToList(),
                Links = updatedSkillBoard.Links.Select(l => new LinkItemDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Url = l.Url,
                    Order = l.Order
                }).ToList()
            };

            return Ok(response);
        }

        // DELETE: api/SkillBoard
        [HttpDelete]
        public async Task<IActionResult> DeleteSkillBoard()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var skillBoard = await _context.SkillBoards
                .FirstOrDefaultAsync(sb => sb.UserId == userId);

            if (skillBoard == null)
            {
                return NotFound(new { message = "SkillBoard not found for this user" });
            }

            _context.SkillBoards.Remove(skillBoard);
            await _context.SaveChangesAsync();

            return Ok(new { message = "SkillBoard deleted successfully" });
        }
    }
}