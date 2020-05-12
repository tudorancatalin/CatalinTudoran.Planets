using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CatalinTudoran.Planets.Database;
using CatalinTudoran.Planets.Domain;
using CatalinTudoran.Planets.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CatalinTudoran.Planets.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class PlanetsController : Controller
    {
        private readonly AppDbContext appDbContext;

        public PlanetsController(AppDbContext appDbContextParam)
        {
            appDbContext = appDbContextParam;
        }

        [HttpGet]
        public IActionResult GetAllPlanets()
        {
            try
            {
                List<Planet> planets = appDbContext.Planets.Select(p => p)
                    .Include(p => p.Status)
                    .Include(p => p.ExplorersTeam)
                    .Include(p => p.ExplorersTeam.Captain)
                    .ToList();

                foreach (Planet planet in planets)
                {
                    if (planet.ExplorersTeam != null)
                    {
                        List<Robot> robots = appDbContext.Robots.Where(r => r.ExplorersTeam.Id == planet.ExplorersTeam.Id).ToList();
                        planet.ExplorersTeam.Robots = robots;
                    }
                }

                return new ObjectResult(planets)
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
        [Route("statuses")]
        [Authorize(Policy = "RobotApiUser")]
        public IActionResult GetPlanetStatuses()
        {
            try
            {
                List<Status> statuses = appDbContext.Statuses.ToList();

                return new ObjectResult(statuses)
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        [Authorize(Policy = "CaptainApiUser")]
        public IActionResult CreatePlanet([FromBody]AddPlanetViewModel planetViewModel)
        {
            try
            {
                Status status = appDbContext.Statuses.Where(s => s.Id == planetViewModel.StatusId).FirstOrDefault();
                Captain captain = appDbContext.Captains.Where(c => c.Id == planetViewModel.CaptainId.ToString()).FirstOrDefault();
                List<Robot> robots = appDbContext.Robots.ToList();
                ExplorersTeam explorersTeam = new ExplorersTeam();
                var robotsOfNewPlanet = new List<Robot>();

                if (captain != null)
                {
                    foreach (Robot robot in planetViewModel.Robots)
                    {
                        var robotToAdd = robots.Where(r => r.Id == robot.Id).FirstOrDefault();
                        robotToAdd.IsAvailable = false;

                        robotsOfNewPlanet.Add(robotToAdd);
                    }

                    captain.IsAvailable = false;
                    explorersTeam = new ExplorersTeam
                    {
                        Captain = captain,
                        Robots = robotsOfNewPlanet
                    };
                }
                else
                {
                    explorersTeam.Captain = null;
                    explorersTeam.Robots = null;
                }

                Planet planet = new Planet
                {
                    Name = planetViewModel.Name,
                    ImageUrl = planetViewModel.ImageUrl,
                    Description = planetViewModel.Description,
                    Status = status,
                    ExplorersTeam = explorersTeam
                };

                appDbContext.Planets.Add(planet);
                appDbContext.SaveChanges();

                return new OkObjectResult("Planet succesfully added.");
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            };
        }



        [HttpPut("{id}")]
        [Authorize(Policy = "RobotApiUser")]
        public IActionResult UpdatePlanet(int id, [FromBody]UpdatePlanetViewModel planetViewModel)
        {
            try
            {
                Planet planetToUpdate = appDbContext.Planets.Where(p => p.Id == id)
                    .Include(p => p.ExplorersTeam)
                    .ThenInclude(p => p.Captain)
                    .Include(p => p.ExplorersTeam)
                    .ThenInclude(p => p.Robots)
                    .FirstOrDefault();

                Status status = appDbContext.Statuses.Where(s => s.Id == planetViewModel.StatusId).FirstOrDefault();
                ExplorersTeam explorersTeam = null;

                IfCaptainHasChangedSetLastCaptainAvaialable(planetViewModel.CaptainId, planetViewModel.LastCaptainId);
                SetRobotsAvailable(planetViewModel.RobotsToSetAvailable);

                Captain captain = appDbContext.Captains.Where(c => c.Id == planetViewModel.CaptainId.ToString()).FirstOrDefault();
                if (captain != null)
                {
                    captain.IsAvailable = false;
                    explorersTeam = UpdateExplorersTeam(planetViewModel.Robots, captain);
                    planetToUpdate.ExplorersTeam = explorersTeam;
                }
                else
                {
                    planetToUpdate.ExplorersTeam.Captain = null;
                    planetToUpdate.ExplorersTeam.Robots = null;
                }

                planetToUpdate.Name = planetViewModel.Name;
                planetToUpdate.ImageUrl = planetViewModel.ImageUrl;
                planetToUpdate.Description = planetViewModel.Description;
                planetToUpdate.Status = status;
            
                appDbContext.SaveChanges();

                return new OkObjectResult("Planet succesfully added.");
            }
            catch (Exception exc)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            };
        }

        private void IfCaptainHasChangedSetLastCaptainAvaialable(string captainId, string lastCaptainId)
        {
            if (captainId != lastCaptainId && lastCaptainId != "")
            {
                Captain captainToSetAvailable = appDbContext.Captains.Where(c => c.Id == lastCaptainId.ToString()).FirstOrDefault();
                captainToSetAvailable.IsAvailable = true;
            }
        }

        private ExplorersTeam UpdateExplorersTeam(List<Robot> robots, Captain captain)
        {
            ExplorersTeam explorersTeam = appDbContext.ExplorersTeams.Where(et => et.Captain.Id == captain.Id).FirstOrDefault();
            List<Robot> robotsInDb = appDbContext.Robots.ToList();
            List<Robot> planetRobots = new List<Robot>();

            foreach (Robot robot in robots)
            {
                var robotToAdd = robotsInDb.Where(r => r.Id == robot.Id).FirstOrDefault();
                robotToAdd.IsAvailable = false;

                planetRobots.Add(robotToAdd);
            }

            if (explorersTeam == null)
            {
                explorersTeam = new ExplorersTeam
                {
                    Captain = captain,
                    Robots = planetRobots
                };
            }

            explorersTeam.Robots = planetRobots;

            return explorersTeam;
        }

        private void SetRobotsAvailable(List<Robot> robotsToSetAvailable)
        {
            foreach (Robot robotToSetAvaialable in robotsToSetAvailable)
            {
                var robot = appDbContext.Robots.Where(r => r.Id == robotToSetAvaialable.Id).FirstOrDefault();
                robot.IsAvailable = true;
            }
        }
    }
}

