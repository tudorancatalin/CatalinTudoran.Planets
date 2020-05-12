using Microsoft.AspNetCore.Identity;
using CatalinTudoran.Planets.Domain;
using CatalinTudoran.Planets.ViewModels;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets.Services
{
    public class ExplorersService : IExplorersService
    {
        private readonly UserManager<User> userManager;

        public ExplorersService(UserManager<User> userManagerParam)
        {
            userManager = userManagerParam;
        }

        public async Task<IdentityResult> CreateCaptain(Captain captainData, string password)
        {
            User captain = await userManager.FindByNameAsync(captainData.UserName);
            if (captain == null)
            {
                var createResult = await userManager.CreateAsync(captainData, password);
                if (!createResult.Succeeded)
                {
                    return createResult;
                }
                captain = await userManager.FindByNameAsync(captainData.UserName);

                return await userManager.AddToRoleAsync(captain, Constants.Strings.Roles.Captain);
            }
            return IdentityResult.Failed(new IdentityError() { Code = "explorerAlreadyExists", Description = "A captain with this user name already exist." });
        }

        public async Task<IdentityResult> CreateRobot(Robot robotData, string password)
        {
            User captain = await userManager.FindByNameAsync(robotData.UserName);
            if (captain == null)
            {
                return await userManager.CreateAsync(robotData, password);
            }

            return IdentityResult.Failed(new IdentityError() { Code = "explorerAlreadyExists", Description = "A robot with this user name already exist." });
        }

        public async Task<IdentityResult> UpdateExplorer(string id, UpdateExplorerViewModel explorerData)
        {
            User explorer = await userManager.FindByIdAsync(id);
            if (explorer != null)
            {
                explorer.Name = explorerData.Name;
                explorer.UserName = explorerData.UserName;

                return await userManager.UpdateAsync(explorer);
            }

            return IdentityResult.Failed(new IdentityError() { Code = "userNotFound", Description = "user not found" });
        }

        public async Task<IdentityResult> ResetPassword(string id, string newPassword)
        {
            User explorer = await userManager.FindByIdAsync(id);

            if (explorer != null)
            {
                string passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(explorer);

                return await userManager.ResetPasswordAsync(explorer, passwordResetToken, newPassword);
            }

            return IdentityResult.Failed(new IdentityError() { Code = "userNotFound", Description = "user not found" });
        }

        public async Task<IdentityResult> ChangePassword(string id, string currentPassword, string newPassword)
        {
            User explorer = await userManager.FindByIdAsync(id);
            if (explorer != null)
            {
                if (!await userManager.CheckPasswordAsync(explorer, currentPassword))
                {
                    return IdentityResult.Failed(new IdentityError() { Code = "invalid_password", Description = "Current password is invalid." });
                }

                return await ResetPassword(id, newPassword);
            }

            return IdentityResult.Failed(new IdentityError() { Code = "userNotFound", Description = "user not found" });
        }

        public async Task<IdentityResult> DeleteExplorer(string id, bool hasCaptainClaim)
        {
            User explorer = await userManager.FindByIdAsync(id);
            if (explorer == null)
            {
                return IdentityResult.Failed(new IdentityError() { Code = "userNotFound", Description = "user not found" });
            }

            if (await IsCurrentExplorerAndIsCaptain(explorer, hasCaptainClaim))
            {
                return IdentityResult.Failed(new IdentityError() { Code = "cannotDeleteItself", Description = "You can't delete your own account." });
            }

            return await userManager.DeleteAsync(explorer);
        }

        private async Task<bool> IsCurrentExplorerAndIsCaptain(User explorer, bool hasCaptainClaim)
        {
            return await userManager.IsInRoleAsync(explorer, Constants.Strings.Roles.Captain)
                && hasCaptainClaim;
        }
    }
}
