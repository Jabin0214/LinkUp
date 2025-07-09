using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        // 使用ConcurrentDictionary避免线程安全问题
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, int> _userConnections = new();
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<int, HashSet<string>> _userConnectionIds = new();

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId.HasValue)
            {
                var connectionId = Context.ConnectionId;
                _userConnections[connectionId] = userId.Value;

                // 管理用户的所有连接
                _userConnectionIds.AddOrUpdate(userId.Value,
                    new HashSet<string> { connectionId },
                    (key, existing) =>
                    {
                        existing.Add(connectionId);
                        return existing;
                    });

                await Clients.All.SendAsync("UserConnected", userId.Value);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (userId.HasValue)
            {
                var connectionId = Context.ConnectionId;
                _userConnections.TryRemove(connectionId, out _);

                // 清理用户连接记录
                if (_userConnectionIds.TryGetValue(userId.Value, out var connectionIds))
                {
                    connectionIds.Remove(connectionId);
                    if (connectionIds.Count == 0)
                    {
                        _userConnectionIds.TryRemove(userId.Value, out _);
                    }
                }

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
            return _userConnectionIds.ContainsKey(userId);
        }

        public static IEnumerable<int> GetOnlineUsers()
        {
            return _userConnectionIds.Keys;
        }

        // 添加连接统计方法
        public static int GetTotalConnections()
        {
            return _userConnections.Count;
        }

        public static int GetOnlineUserCount()
        {
            return _userConnectionIds.Count;
        }
    }
}