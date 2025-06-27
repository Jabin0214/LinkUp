using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class SkillBoard
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [StringLength(1000)]
        public string Introduction { get; set; } = string.Empty;

        [StringLength(100)]
        public string Direction { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // 导航属性
        public User User { get; set; } = null!;
        public ICollection<SkillItem> Skills { get; set; } = new List<SkillItem>();
        public ICollection<LinkItem> Links { get; set; } = new List<LinkItem>();
    }

    public class SkillItem
    {
        public int Id { get; set; }

        [Required]
        public int SkillBoardId { get; set; }

        [Required]
        [StringLength(50)]
        public string Language { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty; // Beginner、Familiar、Proficient、Expert

        public int Order { get; set; } = 0;

        // 导航属性
        public SkillBoard SkillBoard { get; set; } = null!;
    }

    public class LinkItem
    {
        public int Id { get; set; }

        [Required]
        public int SkillBoardId { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Url { get; set; } = string.Empty;

        public int Order { get; set; } = 0;

        // 导航属性
        public SkillBoard SkillBoard { get; set; } = null!;
    }

    // DTO类
    public class SkillBoardResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Introduction { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<SkillItemDto> Skills { get; set; } = new List<SkillItemDto>();
        public List<LinkItemDto> Links { get; set; } = new List<LinkItemDto>();
    }

    public class SkillItemDto
    {
        public int Id { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int Order { get; set; }
    }

    public class LinkItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int Order { get; set; }
    }

    public class CreateSkillBoardRequest
    {
        [Required]
        [StringLength(1000)]
        public string Introduction { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Direction { get; set; } = string.Empty;

        public List<CreateSkillItemRequest> Skills { get; set; } = new List<CreateSkillItemRequest>();
        public List<CreateLinkItemRequest> Links { get; set; } = new List<CreateLinkItemRequest>();
    }

    public class UpdateSkillBoardRequest
    {
        [Required]
        [StringLength(1000)]
        public string Introduction { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Direction { get; set; } = string.Empty;

        public List<CreateSkillItemRequest> Skills { get; set; } = new List<CreateSkillItemRequest>();
        public List<CreateLinkItemRequest> Links { get; set; } = new List<CreateLinkItemRequest>();
    }

    public class CreateSkillItemRequest
    {
        [Required]
        [StringLength(50)]
        public string Language { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Level { get; set; } = string.Empty;

        public int Order { get; set; } = 0;
    }

    public class CreateLinkItemRequest
    {
        [Required]
        [StringLength(50)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Url { get; set; } = string.Empty;

        public int Order { get; set; } = 0;
    }
}