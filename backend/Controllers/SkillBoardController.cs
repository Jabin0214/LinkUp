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
                .Include(sb => sb.Items.OrderBy(i => i.Order))
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
                Skills = skillBoard.Items
                    .Where(i => i.Type == "skill")
                    .OrderBy(i => i.Order)
                    .Select(s => new SkillItemDto
                    {
                        Id = s.Id,
                        Language = s.Content,
                        Level = s.Level ?? "",
                        Order = s.Order
                    }).ToList(),
                Links = skillBoard.Items
                    .Where(i => i.Type == "link")
                    .OrderBy(i => i.Order)
                    .Select(l => new LinkItemDto
                    {
                        Id = l.Id,
                        Title = l.Content,
                        Url = l.Url ?? "",
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
                .Include(sb => sb.Items.OrderBy(i => i.Order))
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
                Skills = skillBoard.Items
                    .Where(i => i.Type == "skill")
                    .OrderBy(i => i.Order)
                    .Select(s => new SkillItemDto
                    {
                        Id = s.Id,
                        Language = s.Content,
                        Level = s.Level ?? "",
                        Order = s.Order
                    }).ToList(),
                Links = skillBoard.Items
                    .Where(i => i.Type == "link")
                    .OrderBy(i => i.Order)
                    .Select(l => new LinkItemDto
                    {
                        Id = l.Id,
                        Title = l.Content,
                        Url = l.Url ?? "",
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

            // 创建技能板项目列表
            var items = new List<SkillBoardItem>();

            // 处理新的Items属性（优先）
            if (request.Items.Any())
            {
                items.AddRange(request.Items.Select((item, index) => new SkillBoardItem
                {
                    SkillBoardId = skillBoard.Id,
                    Type = item.Type,
                    Content = item.Content,
                    Level = item.Level,
                    Url = item.Url,
                    Order = item.Order > 0 ? item.Order : index
                }));
            }
            else
            {
                // 向后兼容：处理旧的Skills和Links属性
                items.AddRange(request.Skills.Select((skill, index) => new SkillBoardItem
                {
                    SkillBoardId = skillBoard.Id,
                    Type = "skill",
                    Content = skill.Language,
                    Level = skill.Level,
                    Order = skill.Order > 0 ? skill.Order : index
                }));

                items.AddRange(request.Links.Select((link, index) => new SkillBoardItem
                {
                    SkillBoardId = skillBoard.Id,
                    Type = "link",
                    Content = link.Title,
                    Url = link.Url,
                    Order = link.Order > 0 ? link.Order : (request.Skills.Count + index)
                }));
            }

            if (items.Any())
            {
                _context.SkillBoardItems.AddRange(items);
                await _context.SaveChangesAsync();
            }

            // 重新获取包含关联数据的技能板
            var createdSkillBoard = await _context.SkillBoards
                .Include(sb => sb.Items.OrderBy(i => i.Order))
                .FirstAsync(sb => sb.Id == skillBoard.Id);

            var response = new SkillBoardResponse
            {
                Id = createdSkillBoard.Id,
                UserId = createdSkillBoard.UserId,
                Introduction = createdSkillBoard.Introduction,
                Direction = createdSkillBoard.Direction,
                CreatedAt = createdSkillBoard.CreatedAt,
                UpdatedAt = createdSkillBoard.UpdatedAt,
                Skills = createdSkillBoard.Items
                    .Where(i => i.Type == "skill")
                    .OrderBy(i => i.Order)
                    .Select(s => new SkillItemDto
                    {
                        Id = s.Id,
                        Language = s.Content,
                        Level = s.Level ?? "",
                        Order = s.Order
                    }).ToList(),
                Links = createdSkillBoard.Items
                    .Where(i => i.Type == "link")
                    .OrderBy(i => i.Order)
                    .Select(l => new LinkItemDto
                    {
                        Id = l.Id,
                        Title = l.Content,
                        Url = l.Url ?? "",
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
                .Include(sb => sb.Items)
                .FirstOrDefaultAsync(sb => sb.UserId == userId);

            if (skillBoard == null)
            {
                return NotFound(new { message = "SkillBoard not found for this user" });
            }

            // 更新基本信息
            skillBoard.Introduction = request.Introduction;
            skillBoard.Direction = request.Direction;
            skillBoard.UpdatedAt = DateTime.UtcNow;

            // 删除现有的所有项目
            _context.SkillBoardItems.RemoveRange(skillBoard.Items);

            // 创建新的项目列表
            var items = new List<SkillBoardItem>();

            // 处理新的Items属性（优先）
            if (request.Items.Any())
            {
                items.AddRange(request.Items.Select((item, index) => new SkillBoardItem
                {
                    SkillBoardId = skillBoard.Id,
                    Type = item.Type,
                    Content = item.Content,
                    Level = item.Level,
                    Url = item.Url,
                    Order = item.Order > 0 ? item.Order : index
                }));
            }
            else
            {
                // 向后兼容：处理旧的Skills和Links属性
                items.AddRange(request.Skills.Select((skill, index) => new SkillBoardItem
                {
                    SkillBoardId = skillBoard.Id,
                    Type = "skill",
                    Content = skill.Language,
                    Level = skill.Level,
                    Order = skill.Order > 0 ? skill.Order : index
                }));

                items.AddRange(request.Links.Select((link, index) => new SkillBoardItem
                {
                    SkillBoardId = skillBoard.Id,
                    Type = "link",
                    Content = link.Title,
                    Url = link.Url,
                    Order = link.Order > 0 ? link.Order : (request.Skills.Count + index)
                }));
            }

            if (items.Any())
            {
                _context.SkillBoardItems.AddRange(items);
            }

            await _context.SaveChangesAsync();

            // 重新获取更新后的数据
            var updatedSkillBoard = await _context.SkillBoards
                .Include(sb => sb.Items.OrderBy(i => i.Order))
                .FirstAsync(sb => sb.Id == skillBoard.Id);

            var response = new SkillBoardResponse
            {
                Id = updatedSkillBoard.Id,
                UserId = updatedSkillBoard.UserId,
                Introduction = updatedSkillBoard.Introduction,
                Direction = updatedSkillBoard.Direction,
                CreatedAt = updatedSkillBoard.CreatedAt,
                UpdatedAt = updatedSkillBoard.UpdatedAt,
                Skills = updatedSkillBoard.Items
                    .Where(i => i.Type == "skill")
                    .OrderBy(i => i.Order)
                    .Select(s => new SkillItemDto
                    {
                        Id = s.Id,
                        Language = s.Content,
                        Level = s.Level ?? "",
                        Order = s.Order
                    }).ToList(),
                Links = updatedSkillBoard.Items
                    .Where(i => i.Type == "link")
                    .OrderBy(i => i.Order)
                    .Select(l => new LinkItemDto
                    {
                        Id = l.Id,
                        Title = l.Content,
                        Url = l.Url ?? "",
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