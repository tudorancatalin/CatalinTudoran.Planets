using CatalinTudoran.Planets.Domain;
using System.Collections.Generic;

namespace CatalinTudoran.Planets.ViewModels
{
    public class UpdatePlanetViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string ImageUrl { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }

        public string CaptainId { get; set; }

        public string LastCaptainId { get; set; }

        public List<Robot> Robots { get; set; }

        public List<Robot> RobotsToSetAvailable { get; set; }
    }
}
