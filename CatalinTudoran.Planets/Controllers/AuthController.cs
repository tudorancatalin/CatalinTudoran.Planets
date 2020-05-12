using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using CatalinTudoran.Planets.Domain;
using CatalinTudoran.Planets.Services;
using CatalinTudoran.Planets.ViewModels;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtFactory _jwtFactory;
        private readonly JwtIssuerOptions _jwtOptions;

        public AuthController(UserManager<User> userManager,
            IJwtFactory jwtFactory,
            IOptions<JwtIssuerOptions> jwtOptions)
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _jwtOptions = jwtOptions.Value;
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Post([FromBody]CredentialsViewModel credentials)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.FindByNameAsync(credentials.UserName);
                
                var identity = await GetClaimsIdentity(credentials.UserName, credentials.Password);
                if (identity == null)
                {
                    ModelState.TryAddModelError("login_failure", "Nume utilizator sau parola invalida.");
                    return BadRequest(ModelState);
                }

                var jwt = await Tokens.GenerateJwt(identity, _jwtFactory, credentials.UserName, _jwtOptions, new JsonSerializerSettings { Formatting = Formatting.Indented });
                return new OkObjectResult(jwt);
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        private async Task<ClaimsIdentity> GetClaimsIdentity(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return await Task.FromResult<ClaimsIdentity>(null);

            // get the user to verifty
            var userToVerify = await _userManager.FindByNameAsync(userName);

            if (userToVerify == null) return await Task.FromResult<ClaimsIdentity>(null);
            if (userToVerify.UserName != userName) return await Task.FromResult<ClaimsIdentity>(null);

            // check the credentials
            if (await _userManager.CheckPasswordAsync(userToVerify, password))
            {
                bool isCaptain = await _userManager.IsInRoleAsync(userToVerify,
                    Constants.Strings.Roles.Captain);
                return await Task.FromResult(_jwtFactory.GenerateClaimsIdentity(userName,
                    userToVerify.Id, isCaptain));
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult<ClaimsIdentity>(null);
        }
    }
}
