using Microsoft.AspNetCore.Identity;
using CatalinTudoran.Planets.Database;
using CatalinTudoran.Planets.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets.Services
{
    public class DBSeeder : IDBSeeder
    {
        private const string captainUserName = "admin";
        private const string captainInitialPassword = "adminCaptain";

        private readonly AppDbContext appDbContext;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public DBSeeder(UserManager<User> userManagerParam,
            RoleManager<IdentityRole> roleManagerParam,
            AppDbContext appDbContextParam)
        {
            appDbContext = appDbContextParam;
            userManager = userManagerParam;
            roleManager = roleManagerParam;
        }

        public async Task EnsureInitialData()
        {
            if (appDbContext.Configs.Count() > 0)
            {
                return;
            }

            await InitializeCaptainAdmin();
            InitStatuses();

            appDbContext.Configs.Add(new Config { Seeded = true });
            appDbContext.SaveChanges();
        }

        private async Task InitializeCaptainAdmin()
        {
            bool captainRoleExists = await roleManager.RoleExistsAsync(Constants.Strings.Roles.Captain);
            if (!captainRoleExists)
            {
                var res = await roleManager.CreateAsync(new IdentityRole(Constants.Strings.Roles.Captain));
                if (!res.Succeeded)
                {
                    throw new Exception($"Eroare in timpul creerii rolului Admin: {res.Errors}");
                }
            }

            User captainAdmin = await userManager.FindByNameAsync(captainUserName);
            if (captainAdmin == null)
            {
                captainAdmin = new Captain
                {
                    Name = "admin",
                    UserName = captainUserName
                };

                var res = await userManager.CreateAsync(captainAdmin, captainInitialPassword);
                if (!res.Succeeded)
                {
                    throw new Exception($"Eroare in timpul creerii capitanului admin {res.Errors}");
                }
                captainAdmin = await userManager.FindByNameAsync(captainUserName);
            }

            IList<string> rolesAttachedToCaptain = await userManager.GetRolesAsync(captainAdmin);
            if (!rolesAttachedToCaptain.Contains(Constants.Strings.Roles.Captain))
            {
                var res = await userManager.AddToRoleAsync(captainAdmin, Constants.Strings.Roles.Captain);
                if (!res.Succeeded)
                {
                    throw new Exception($"Eroare in timpul atasarii  {res.Errors}");
                }
            }
        }

        private void InitStatuses()
        {
            AddStatus("OK");
            AddStatus("!OK");
            AddStatus("En route");
            AddStatus("TODO");
        }

        private void AddStatus(string type)
        {
            appDbContext.Statuses.Add(new Status { Type = type });
        }
    }
}
