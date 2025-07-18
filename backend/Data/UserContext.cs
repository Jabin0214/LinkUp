using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options)
            : base(options)
        {
        }

        public DbSet<Models.User> Users { get; set; } = default!;
        public DbSet<Models.SkillBoard> SkillBoards { get; set; } = default!;
        public DbSet<Models.SkillBoardItem> SkillBoardItems { get; set; } = default!;
        public DbSet<Models.Project> Projects { get; set; } = default!;
        public DbSet<Models.ProjectMember> ProjectMembers { get; set; } = default!;
        public DbSet<Models.Friend> Friends { get; set; } = default!;
        public DbSet<Models.FriendRequest> FriendRequests { get; set; } = default!;
        public DbSet<Models.Message> Messages { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.User>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Required fields
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();

                // Optional fields
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.university).HasMaxLength(100);

                // Default values
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.IsActive).HasDefaultValue(true);

                // Indexes for performance and uniqueness
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.IsActive);
                entity.HasIndex(e => e.university); // Add index for university-based queries
            });

            // Friend configuration
            modelBuilder.Entity<Models.Friend>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Foreign key relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.FriendUser)
                    .WithMany()
                    .HasForeignKey(e => e.FriendUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Composite unique constraint: prevent duplicate friendships
                entity.HasIndex(e => new { e.UserId, e.FriendUserId }).IsUnique();

                // Indexes for performance
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.FriendUserId);
                entity.HasIndex(e => e.CreatedAt);
            });

            // FriendRequest configuration
            modelBuilder.Entity<Models.FriendRequest>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("Pending");
                entity.Property(e => e.Message).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Foreign key relationships
                entity.HasOne(e => e.Sender)
                    .WithMany()
                    .HasForeignKey(e => e.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Receiver)
                    .WithMany()
                    .HasForeignKey(e => e.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Composite unique constraint: prevent duplicate requests
                entity.HasIndex(e => new { e.SenderId, e.ReceiverId }).IsUnique();

                // Indexes for performance
                entity.HasIndex(e => e.SenderId);
                entity.HasIndex(e => e.ReceiverId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);
            });

            // SkillBoard配置
            modelBuilder.Entity<Models.SkillBoard>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Introduction).HasMaxLength(1000);
                entity.Property(e => e.Direction).HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                // 一个用户只能有一个技能板
                entity.HasIndex(e => e.UserId).IsUnique();

                // 外键关系 - 一对一关系
                entity.HasOne(e => e.User)
                    .WithOne(u => u.SkillBoard)
                    .HasForeignKey<Models.SkillBoard>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Items)
                    .WithOne(e => e.SkillBoard)
                    .HasForeignKey(e => e.SkillBoardId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // SkillBoardItem配置 - 合并的技能和链接项目
            modelBuilder.Entity<Models.SkillBoardItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Level).HasMaxLength(20); // 可选，仅技能需要
                entity.Property(e => e.Url).HasMaxLength(500); // 可选，仅链接需要
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // 复合索引：技能板ID + 类型 + 顺序
                entity.HasIndex(e => new { e.SkillBoardId, e.Type, e.Order });
                
                // 单独索引：类型和创建时间
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.CreatedAt);

                // 配置表级约束
                entity.ToTable(t =>
                {
                    // Type只能是 'skill' 或 'link'
                    t.HasCheckConstraint("CK_SkillBoardItem_Type", "Type IN ('skill', 'link')");
                    
                    // 如果是技能，Level不能为空；如果是链接，Url不能为空
                    t.HasCheckConstraint("CK_SkillBoardItem_SkillLevel", 
                        "(Type = 'skill' AND Level IS NOT NULL) OR Type != 'skill'");
                    t.HasCheckConstraint("CK_SkillBoardItem_LinkUrl", 
                        "(Type = 'link' AND Url IS NOT NULL) OR Type != 'link'");
                });
            });

            // Project configuration
            modelBuilder.Entity<Models.Project>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Recruiting");
                entity.Property(e => e.Category).HasMaxLength(100);
                entity.Property(e => e.RequiredSkills).HasMaxLength(1000);
                entity.Property(e => e.ContactInfo).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Foreign key relationship with User (Creator)
                entity.HasOne(e => e.Creator)
                    .WithMany()
                    .HasForeignKey(e => e.CreatorId)
                    .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete of projects when user is deleted

                // One-to-many relationship with ProjectMembers
                entity.HasMany(e => e.Members)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes for performance
                entity.HasIndex(e => e.CreatorId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.UpdatedAt);
            });

            // ProjectMember configuration
            modelBuilder.Entity<Models.ProjectMember>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Role).IsRequired().HasMaxLength(50).HasDefaultValue("Member");
                entity.Property(e => e.JoinMessage).HasMaxLength(500);
                entity.Property(e => e.JoinedAt).HasDefaultValueSql("GETUTCDATE()");

                // Foreign key relationships
                entity.HasOne(e => e.Project)
                    .WithMany(e => e.Members)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Composite unique constraint: one user can only join a project once
                entity.HasIndex(e => new { e.ProjectId, e.UserId }).IsUnique();

                // Indexes for performance
                entity.HasIndex(e => e.ProjectId);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Role);
                entity.HasIndex(e => e.JoinedAt);
            });

            // Message configuration
            modelBuilder.Entity<Models.Message>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.IsRead).HasDefaultValue(false);

                // Foreign key relationships
                entity.HasOne(e => e.Sender)
                    .WithMany()
                    .HasForeignKey(e => e.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Receiver)
                    .WithMany()
                    .HasForeignKey(e => e.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Indexes for performance
                entity.HasIndex(e => e.SenderId);
                entity.HasIndex(e => e.ReceiverId);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.IsRead);
                entity.HasIndex(e => new { e.SenderId, e.ReceiverId });
                entity.HasIndex(e => new { e.ReceiverId, e.IsRead });
            });
        }
    }
}