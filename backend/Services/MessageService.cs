using Data;
using Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Hubs;

namespace Services
{
    public interface IMessageService
    {
        Task<MessageDto> SendMessageAsync(int senderId, int receiverId, string content);
        Task<List<MessageDto>> GetConversationAsync(int userId1, int userId2, int page = 1, int pageSize = 50);
        Task<List<ConversationDto>> GetConversationsAsync(int userId, int page = 1, int pageSize = 20);
        Task<bool> MarkAsReadAsync(int messageId, int userId);
        Task<int> GetUnreadCountAsync(int userId);
        Task<bool> AreFriendsAsync(int userId1, int userId2);
    }

    public class MessageService : IMessageService
    {
        private readonly UserContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageService(UserContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<MessageDto> SendMessageAsync(int senderId, int receiverId, string content)
        {
            // 检查是否为好友关系
            if (!await AreFriendsAsync(senderId, receiverId))
            {
                throw new InvalidOperationException("You can only send messages to your friends");
            }

            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // 获取发送者和接收者信息
            var sender = await _context.Users.FindAsync(senderId);
            var receiver = await _context.Users.FindAsync(receiverId);

            var messageDto = new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                SenderName = sender?.Username ?? "",
                ReceiverName = receiver?.Username ?? "",
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                IsRead = message.IsRead,
                ReadAt = message.ReadAt
            };

            // 通过SignalR发送实时消息给接收者
            await _hubContext.Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", senderId, receiverId, content);

            return messageDto;
        }

        public async Task<List<MessageDto>> GetConversationAsync(int userId1, int userId2, int page = 1, int pageSize = 50)
        {
            var messages = await _context.Messages
                .Where(m => (m.SenderId == userId1 && m.ReceiverId == userId2) ||
                           (m.SenderId == userId2 && m.ReceiverId == userId1))
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                SenderName = m.Sender.Username,
                ReceiverName = m.Receiver.Username,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt
            }).ToList();
        }

        public async Task<List<ConversationDto>> GetConversationsAsync(int userId, int page = 1, int pageSize = 20)
        {
            try
            {
                // 获取用户的所有对话，使用更简单的方法
                var userMessages = await _context.Messages
                    .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .ToListAsync();

                // 按对话分组
                var conversationGroups = userMessages
                    .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                    .Select(g => new
                    {
                        OtherUserId = g.Key,
                        Messages = g.OrderByDescending(m => m.CreatedAt).ToList(),
                        UnreadCount = g.Count(m => m.ReceiverId == userId && !m.IsRead)
                    })
                    .Where(g => g.Messages.Any())
                    .OrderByDescending(g => g.Messages.First().CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new List<ConversationDto>();
                foreach (var conv in conversationGroups)
                {
                    var lastMessage = conv.Messages.First();
                    var otherUser = lastMessage.SenderId == userId ? lastMessage.Receiver : lastMessage.Sender;
                    
                    if (otherUser != null)
                    {
                        result.Add(new ConversationDto
                        {
                            UserId = conv.OtherUserId,
                            UserName = otherUser.Username,
                            LastMessage = lastMessage.Content,
                            LastMessageTime = lastMessage.CreatedAt,
                            UnreadCount = conv.UnreadCount
                        });
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                // 记录错误并返回空列表
                Console.WriteLine($"Error in GetConversationsAsync: {ex.Message}");
                return new List<ConversationDto>();
            }
        }

        public async Task<bool> MarkAsReadAsync(int messageId, int userId)
        {
            var message = await _context.Messages
                .FirstOrDefaultAsync(m => m.Id == messageId && m.ReceiverId == userId);

            if (message == null)
                return false;

            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // 通过SignalR通知消息已读
            await _hubContext.Clients.All.SendAsync("MessageRead", messageId, userId);

            return true;
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _context.Messages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        }

        public async Task<bool> AreFriendsAsync(int userId1, int userId2)
        {
            return await _context.Friends
                .AnyAsync(f => (f.UserId == userId1 && f.FriendUserId == userId2) ||
                              (f.UserId == userId2 && f.FriendUserId == userId1));
        }
    }
}