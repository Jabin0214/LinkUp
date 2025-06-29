using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int CreatorId { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Recruiting"; // Recruiting, InProgress, Completed, Cancelled

        [StringLength(100)]
        public string Category { get; set; } = string.Empty; // Web Development, Mobile App, AI/ML, etc.

        [StringLength(1000)]
        public string RequiredSkills { get; set; } = string.Empty; // Comma-separated skills

        public int MaxMembers { get; set; } = 5;

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [StringLength(500)]
        public string ContactInfo { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User Creator { get; set; } = null!;
        public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
    }

    public class ProjectMember
    {
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "Member"; // Creator, Member, Pending

        [StringLength(500)]
        public string JoinMessage { get; set; } = string.Empty; // Message when applying to join

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Project Project { get; set; } = null!;
        public User User { get; set; } = null!;
    }

    // DTO Classes for API
    public class ProjectResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CreatorId { get; set; }
        public string CreatorName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> RequiredSkills { get; set; } = new List<string>();
        public int MaxMembers { get; set; }
        public int CurrentMembers { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<ProjectMemberDto> Members { get; set; } = new List<ProjectMemberDto>();
        public bool HasUserJoined { get; set; } // Whether current user has joined
        public bool IsCreator { get; set; } // Whether current user is creator
    }

    public class ProjectMemberDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string JoinMessage { get; set; } = string.Empty;
        public DateTime JoinedAt { get; set; }
    }

    public class CreateProjectRequest
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        public List<string> RequiredSkills { get; set; } = new List<string>();

        [Range(1, 50)]
        public int MaxMembers { get; set; } = 5;

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [StringLength(500)]
        public string ContactInfo { get; set; } = string.Empty;
    }

    public class UpdateProjectRequest
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        public List<string> RequiredSkills { get; set; } = new List<string>();

        [Range(1, 50)]
        public int MaxMembers { get; set; } = 5;

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [StringLength(500)]
        public string ContactInfo { get; set; } = string.Empty;
    }

    public class JoinProjectRequest
    {
        [StringLength(500)]
        public string JoinMessage { get; set; } = string.Empty;
    }

    public class ProjectSearchQuery
    {
        public string? Keyword { get; set; }
        public string? Category { get; set; }
        public string? Status { get; set; }
        public List<string>? RequiredSkills { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}