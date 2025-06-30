using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Data;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly UserContext _context;

        public ProjectController(UserContext context)
        {
            _context = context;
        }

        // GET: api/project - Get all projects with optional search filters
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetProjects([FromQuery] ProjectSearchQuery query)
        {
            var currentUserId = GetCurrentUserId();
            var projectsQuery = _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(query.Keyword))
            {
                projectsQuery = projectsQuery.Where(p =>
                    p.Title.Contains(query.Keyword) ||
                    p.Description.Contains(query.Keyword));
            }

            if (!string.IsNullOrEmpty(query.Category))
            {
                projectsQuery = projectsQuery.Where(p => p.Category == query.Category);
            }

            if (!string.IsNullOrEmpty(query.Status))
            {
                projectsQuery = projectsQuery.Where(p => p.Status == query.Status);
            }

            if (query.RequiredSkills != null && query.RequiredSkills.Any())
            {
                foreach (var skill in query.RequiredSkills)
                {
                    projectsQuery = projectsQuery.Where(p => p.RequiredSkills.Contains(skill));
                }
            }

            // Order by creation date (newest first)
            projectsQuery = projectsQuery.OrderByDescending(p => p.CreatedAt);

            // Pagination
            var totalCount = await projectsQuery.CountAsync();
            var projects = await projectsQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            var projectResponses = projects.Select(p => ProjectToResponse(p, currentUserId)).ToList();

            return Ok(new
            {
                projects = projectResponses,
                totalCount,
                page = query.Page,
                pageSize = query.PageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize)
            });
        }

        // GET: api/project/my - Get current user's projects
        [HttpGet("my")]
        public async Task<ActionResult<List<ProjectResponse>>> GetMyProjects()
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
                return Unauthorized();

            // Get projects where user is either creator or member
            var projects = await _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .Where(p => p.CreatorId == currentUserId ||
                           p.Members.Any(m => m.UserId == currentUserId))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var projectResponses = projects.Select(p => ProjectToResponse(p, currentUserId)).ToList();
            return Ok(projectResponses);
        }

        // GET: api/project/{id} - Get project details
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProjectResponse>> GetProject(int id)
        {
            var currentUserId = GetCurrentUserId();
            var project = await _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            return Ok(ProjectToResponse(project, currentUserId));
        }

        // POST: api/project - Create new project
        [HttpPost]
        public async Task<ActionResult<ProjectResponse>> CreateProject(CreateProjectRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
                return Unauthorized();

            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                RequiredSkills = string.Join(",", request.RequiredSkills),
                MaxMembers = request.MaxMembers,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                ContactInfo = request.ContactInfo,
                CreatorId = currentUserId.Value,
                Status = "Recruiting"
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Add creator as a member with "Creator" role
            var creatorMember = new ProjectMember
            {
                ProjectId = project.Id,
                UserId = currentUserId.Value,
                Role = "Creator"
            };

            _context.ProjectMembers.Add(creatorMember);
            await _context.SaveChangesAsync();

            // Load the project with related data
            var createdProject = await _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .FirstAsync(p => p.Id == project.Id);

            return CreatedAtAction(nameof(GetProject), new { id = project.Id },
                ProjectToResponse(createdProject, currentUserId));
        }

        // PUT: api/project/{id} - Update project
        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectResponse>> UpdateProject(int id, UpdateProjectRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
                return Unauthorized();

            var project = await _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            if (project.CreatorId != currentUserId)
                return Forbid("Only the project creator can update the project");

            project.Title = request.Title;
            project.Description = request.Description;
            project.Status = request.Status;
            project.Category = request.Category;
            project.RequiredSkills = string.Join(",", request.RequiredSkills);
            project.MaxMembers = request.MaxMembers;
            project.StartDate = request.StartDate;
            project.EndDate = request.EndDate;
            project.ContactInfo = request.ContactInfo;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(ProjectToResponse(project, currentUserId));
        }

        // DELETE: api/project/{id} - Delete project
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
                return Unauthorized();

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            if (project.CreatorId != currentUserId)
                return Forbid("Only the project creator can delete the project");

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/project/{id}/join - Join a project
        [HttpPost("{id}/join")]
        public async Task<ActionResult<ProjectResponse>> JoinProject(int id, JoinProjectRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
                return Unauthorized();

            var project = await _context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            if (project.CreatorId == currentUserId)
                return BadRequest("Project creator cannot join their own project");

            if (project.Status != "Recruiting")
                return BadRequest("Project is not recruiting members");

            // Check if user already joined
            var existingMembership = await _context.ProjectMembers
                .FirstOrDefaultAsync(pm => pm.ProjectId == id && pm.UserId == currentUserId);

            if (existingMembership != null)
                return BadRequest("You have already joined this project");

            // Check if project is full (including creator)
            var currentMemberCount = project.Members.Count();
            if (currentMemberCount >= project.MaxMembers)
                return BadRequest("Project has reached maximum members");

            var projectMember = new ProjectMember
            {
                ProjectId = id,
                UserId = currentUserId.Value,
                Role = "Member",
                JoinMessage = request.JoinMessage
            };

            _context.ProjectMembers.Add(projectMember);
            await _context.SaveChangesAsync();

            // Reload the project with updated member information
            var updatedProject = await _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Members)
                    .ThenInclude(m => m.User)
                .FirstAsync(p => p.Id == id);

            return Ok(ProjectToResponse(updatedProject, currentUserId));
        }

        // DELETE: api/project/{id}/leave - Leave a project
        [HttpDelete("{id}/leave")]
        public async Task<ActionResult> LeaveProject(int id)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
                return Unauthorized();

            var projectMember = await _context.ProjectMembers
                .FirstOrDefaultAsync(pm => pm.ProjectId == id && pm.UserId == currentUserId);

            if (projectMember == null)
                return NotFound("You are not a member of this project");

            if (projectMember.Role == "Creator")
                return BadRequest("Project creator cannot leave the project. Delete the project instead.");

            _context.ProjectMembers.Remove(projectMember);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully left the project" });
        }

        // GET: api/project/categories - Get available project categories
        [HttpGet("categories")]
        [AllowAnonymous]
        public ActionResult<List<string>> GetCategories()
        {
            var categories = new List<string>
            {
                "Web Development",
                "Mobile App",
                "Desktop Application",
                "Game Development",
                "AI/Machine Learning",
                "Data Science",
                "DevOps/Infrastructure",
                "Blockchain",
                "IoT",
                "Cybersecurity",
                "UI/UX Design",
                "Research",
                "Open Source",
                "Startup",
                "Other"
            };

            return Ok(categories);
        }

        // Helper methods
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private ProjectResponse ProjectToResponse(Project project, int? currentUserId)
        {
            var requiredSkills = string.IsNullOrEmpty(project.RequiredSkills)
                ? new List<string>()
                : project.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();

            var members = project.Members.Select(m => new ProjectMemberDto
            {
                Id = m.Id,
                UserId = m.UserId,
                Username = m.User.Username,
                Role = m.Role,
                JoinMessage = m.JoinMessage,
                JoinedAt = m.JoinedAt
            }).ToList();

            // 成员数量应该包括Creator，计算所有成员
            var currentMemberCount = members.Count();
            var hasUserJoined = currentUserId.HasValue &&
                members.Any(m => m.UserId == currentUserId.Value);
            var isCreator = currentUserId.HasValue && project.CreatorId == currentUserId.Value;

            return new ProjectResponse
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatorId = project.CreatorId,
                CreatorName = project.Creator.Username,
                Status = project.Status,
                Category = project.Category,
                RequiredSkills = requiredSkills,
                MaxMembers = project.MaxMembers,
                CurrentMembers = currentMemberCount,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                ContactInfo = project.ContactInfo,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                Members = members,
                HasUserJoined = hasUserJoined,
                IsCreator = isCreator
            };
        }
    }
}