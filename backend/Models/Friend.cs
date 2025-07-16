using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Friend
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int FriendUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual User FriendUser { get; set; } = null!;
    }

    public class FriendRequest
    {
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; }

        [Required]
        public int ReceiverId { get; set; }

        [StringLength(500)]
        public string? Message { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResponsedAt { get; set; }

        // Navigation properties
        public virtual User Sender { get; set; } = null!;
        public virtual User Receiver { get; set; } = null!;
    }

    // DTOs for API responses
    public class FriendInfo
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? University { get; set; }
        public DateTime FriendSince { get; set; }
        public bool IsOnline { get; set; } = false;
    }

    public class FriendRequestInfo
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderUsername { get; set; } = string.Empty;
        public string SenderFirstName { get; set; } = string.Empty;
        public string SenderLastName { get; set; } = string.Empty;
        public string? SenderUniversity { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class UserPublicProfile
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? University { get; set; }
        public DateTime JoinedAt { get; set; }
        public bool IsFriend { get; set; } = false;
        public bool HasPendingRequest { get; set; } = false;
        public string? FriendRequestStatus { get; set; } // "sent", "received", null
        public SkillBoardInfo? SkillBoard { get; set; }
    }



    public class SendFriendRequestDto
    {
        [Required]
        public int ReceiverId { get; set; }

        [StringLength(500)]
        public string? Message { get; set; }
    }

    public class RespondFriendRequestDto
    {
        [Required]
        public int RequestId { get; set; }

        [Required]
        [StringLength(20)]
        public string Action { get; set; } = string.Empty; // "accept" or "reject"
    }
}