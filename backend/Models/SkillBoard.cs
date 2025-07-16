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
        public ICollection<SkillBoardItem> Items { get; set; } = new List<SkillBoardItem>();

        // 便捷属性 - 分别获取技能和链接
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public IEnumerable<SkillBoardItem> Skills => Items.Where(i => i.Type == "skill");
        
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public IEnumerable<SkillBoardItem> Links => Items.Where(i => i.Type == "link");
    }

    public class SkillBoardItem
    {
        public int Id { get; set; }

        [Required]
        public int SkillBoardId { get; set; }

        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // "skill" or "link"

        [Required]
        [StringLength(200)]
        public string Content { get; set; } = string.Empty; // 技能名称或链接标题

        [StringLength(20)]
        public string? Level { get; set; } // 仅对技能有效: Beginner、Familiar、Proficient、Expert

        [StringLength(500)]
        public string? Url { get; set; } // 仅对链接有效

        public int Order { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 导航属性
        public SkillBoard SkillBoard { get; set; } = null!;
    }

    // 保持向后兼容的DTO
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

    public class SkillBoardItemRequest
    {
        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // "skill" or "link"

        [Required]
        [StringLength(200)]
        public string Content { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Level { get; set; } // 仅技能需要

        [StringLength(500)]
        public string? Url { get; set; } // 仅链接需要

        public int Order { get; set; } = 0;
    }

    public class CreateSkillBoardRequest
    {
        [Required]
        [StringLength(1000)]
        public string Introduction { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Direction { get; set; } = string.Empty;

        public List<SkillBoardItemRequest> Items { get; set; } = new List<SkillBoardItemRequest>();

        // 向后兼容的属性
        public List<SkillItemDto> Skills { get; set; } = new List<SkillItemDto>();
        public List<LinkItemDto> Links { get; set; } = new List<LinkItemDto>();
    }

    public class UpdateSkillBoardRequest
    {
        [Required]
        [StringLength(1000)]
        public string Introduction { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Direction { get; set; } = string.Empty;

        public List<SkillBoardItemRequest> Items { get; set; } = new List<SkillBoardItemRequest>();

        // 向后兼容的属性
        public List<SkillItemDto> Skills { get; set; } = new List<SkillItemDto>();
        public List<LinkItemDto> Links { get; set; } = new List<LinkItemDto>();
    }

    // 用户配置文件中的技能板信息
    public class SkillBoardInfo
    {
        public string Introduction { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public List<SkillItemInfo> Skills { get; set; } = new List<SkillItemInfo>();
        public List<LinkItemInfo> Links { get; set; } = new List<LinkItemInfo>();
    }

    public class SkillItemInfo
    {
        public string Language { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
    }

    public class LinkItemInfo
    {
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}