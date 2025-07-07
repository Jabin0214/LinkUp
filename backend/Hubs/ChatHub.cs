using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static readonly Dictionary<string, int> _userConnections = new();

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId.HasValue)
            {
                _userConnections[Context.ConnectionId] = userId.Value;
                await Clients.All.SendAsync("UserConnected", userId.Value);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (userId.HasValue)
            {
                _userConnections.Remove(Context.ConnectionId);
                await Clients.All.SendAsync("UserDisconnected", userId.Value);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(int receiverId, string content)
        {
            var senderId = GetUserId();
            if (!senderId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Unauthorized");
                return;
            }

            // 发送消息给接收者（不包括发送者自己）
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", senderId.Value, receiverId, content);
        }

        public async Task MarkAsRead(int messageId)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Unauthorized");
                return;
            }

            // 通知消息已读（只通知相关用户）
            await Clients.Caller.SendAsync("MessageRead", messageId, userId.Value);
        }

        private int? GetUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        public static bool IsUserOnline(int userId)
        {
            return _userConnections.Values.Contains(userId);
        }

        public static IEnumerable<int> GetOnlineUsers()
        {
            return _userConnections.Values.Distinct();
        }
    }
}