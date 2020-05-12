using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CatalinTudoran.Planets.Database;
using CatalinTudoran.Planets.Domain;
using CatalinTudoran.Planets.Services;
using CatalinTudoran.Planets.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ExplorersController : Controller
    {
        private readonly AppDbContext appDbContext;
        private readonly IExplorersService explorersService;

        public ExplorersController(AppDbContext appDbContextParam,
            IExplorersService explorersServiceParam)
        {
            appDbContext = appDbContextParam;
            explorersService = explorersServiceParam;
        }

        [HttpPost]
        [Route("captain")]
        [Authorize(Policy = "CaptainApiUser")]
        public async Task<IActionResult> CreateCaptain([FromBody] ExplorersViewModel captainViewModel)
        {
            try
            {                
                Captain captain = new Captain
                {
                    UserName = captainViewModel.UserName,
                    Name = captainViewModel.Name,
                    IsAvailable = true
                };

                var res = await explorersService.CreateCaptain(captain, captainViewModel.Password);
                if (!res.Succeeded)
                {
                    ModelState.TryAddModelError(res.Errors.FirstOrDefault().Code, res.Errors.FirstOrDefault().Description);
                    return new BadRequestObjectResult(ModelState);
                }

                return new OkObjectResult("Captain succesfully added.");
            }
            catch(Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        [Route("robot")]
        [Authorize(Policy = "CaptainApiUser")]
        public async Task<IActionResult> CreateRobot([FromBody] ExplorersViewModel robotViewModel)
        {
            try
            {
                Robot robot = new Robot
                {
                    UserName = robotViewModel.UserName,
                    Name = robotViewModel.Name,
                    IsAvailable = true
                };

                var res = await explorersService.CreateRobot(robot, robotViewModel.Password);
                if (!res.Succeeded)
                {
                    ModelState.TryAddModelError(res.Errors.FirstOrDefault().Code, res.Errors.FirstOrDefault().Description);
                    return new BadRequestObjectResult(ModelState);
                }

                return new OkObjectResult("Robot succesfully added.");
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("captains")]
        [Authorize(Policy = "CaptainApiUser")]
        public IActionResult GetAllCaptains()
        {
            try
            {
                List<Captain> captains = appDbContext.Captains
                    .OrderByDescending(c => c.IsAvailable)
                    .ThenBy(c => c.Name)
                    .ToList();

                return new ObjectResult(captains)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            catch(Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("availableCaptains")]
        public IActionResult GetAllAvailableCaptains()
        {
            try
            {
                List<Captain> captains = appDbContext.Captains.Where(c => c.IsAvailable == true).ToList();

                return new ObjectResult(captains)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("robots")]
        [Authorize(Policy = "CaptainApiUser")]
        public IActionResult GetAllRobots()
        {
            try 
            {
                List<Robot> robots = appDbContext.Robots
                    .OrderByDescending(r => r.IsAvailable)
                    .ThenBy(c => c.Name)
                    .ToList();

                return new ObjectResult(robots)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            catch(Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("availableRobots")]
        public IActionResult GetAllAvailableRobots()
        {
            try
            {
                int explorersTeamId = Convert.ToInt32(HttpContext.Request.Query["explorersTeamId"]);

                List<Robot> robots = appDbContext.Robots.Where(r => r.IsAvailable == true || r.ExplorersTeam.Id == explorersTeamId).ToList();
                
                return new ObjectResult(robots)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }        

        [HttpPut("explorer/{id}")]
        [Authorize(Policy = "CaptainApiUser")]
        public async Task<IActionResult> UpdateExplorer(string id, [FromBody]UpdateExplorerViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelStateErrors = this.ModelState.Keys.SelectMany(key => this.ModelState[key].Errors);
                    return BadRequest(ModelState);
                }

                var res = await explorersService.UpdateExplorer(id, model);
                if (!res.Succeeded)
                {
                    ModelState.TryAddModelError("NoUser", "Explorer not found.");
                    return new BadRequestObjectResult(ModelState);
                }

                return new OkObjectResult("Captain has been updated succesfully");
            }
            catch (Exception exc)
            {               
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("explorer/{id}")]
        [Authorize(Policy = "CaptainApiUser")]
        public async Task<IActionResult> DeleteExplorer(string id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelStateErrors = this.ModelState.Keys.SelectMany(key => this.ModelState[key].Errors);
                    return BadRequest(ModelState);
                }

                bool hasCaptainClaim = HttpContext.User.HasClaim(Constants.Strings.JwtClaimIdentifiers.Id, id);

                var res = await explorersService.DeleteExplorer(id, hasCaptainClaim);
                if (!res.Succeeded)
                {
                    ModelState.TryAddModelError(res.Errors.FirstOrDefault().Code, res.Errors.FirstOrDefault().Description);
                    return new BadRequestObjectResult(ModelState);
                }

                return new OkObjectResult("Explorer has been deleted succesfully.");
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("resetPassword/{id}")]
        [Authorize(Policy = "CaptainApiUser")]
        public async Task<IActionResult> ResetPassword(string id, [FromBody]ResetPasswordViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelStateErrors = this.ModelState.Keys.SelectMany(key => this.ModelState[key].Errors);
                    return BadRequest(ModelState);
                }

                var res =  await explorersService.ResetPassword(id, model.Password);
                if (!res.Succeeded)
                {
                    ModelState.TryAddModelError(res.Errors.FirstOrDefault().Code, res.Errors.FirstOrDefault().Description);
                    return new BadRequestObjectResult(ModelState);
                }

                return new OkObjectResult("Password reseted succesfully.");
            }
            catch (Exception exc)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("changePassword")]
        [Authorize(Policy = "RobotApiUser")]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordViewModel changePasswordModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelStateErrors = this.ModelState.Keys.SelectMany(key => this.ModelState[key].Errors);
                    return BadRequest(ModelState);
                }
                var httpUser = HttpContext.User;
                Claim idClaim = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == Constants.Strings.JwtClaimIdentifiers.Id);
                if (idClaim == null)
                {
                    ModelState.TryAddModelError("id_inexistent", "The identity of the user cannot be found.");
                    return BadRequest(ModelState);
                }

                var res = await explorersService.ChangePassword(idClaim.Value, changePasswordModel.CurrentPassword, changePasswordModel.NewPassword);
                if (!res.Succeeded)
                {
                    ModelState.TryAddModelError(res.Errors.FirstOrDefault().Code, res.Errors.FirstOrDefault().Description);
                    return new BadRequestObjectResult(ModelState);
                }

                return new OkObjectResult("Password reseted succesfully.");
            }
            catch (Exception exc)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
