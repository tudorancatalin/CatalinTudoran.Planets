using Microsoft.AspNetCore.Identity;
using CatalinTudoran.Planets.Domain;
using CatalinTudoran.Planets.ViewModels;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets.Services
{
    public interface IExplorersService
    {
        Task<IdentityResult> CreateCaptain(Captain captain, string password);

        Task<IdentityResult> CreateRobot(Robot robot, string password);

        Task<IdentityResult> UpdateExplorer(string id, UpdateExplorerViewModel explorerData);

        Task<IdentityResult> ResetPassword(string id, string newPassword);

        Task<IdentityResult> ChangePassword(string id, string currentPassword, string newPassword);

        Task<IdentityResult> DeleteExplorer(string id, bool hasCaptainClaim);
    }
}
