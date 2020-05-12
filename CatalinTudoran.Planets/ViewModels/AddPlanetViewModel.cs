using CatalinTudoran.Planets.Domain;
using System.Collections.Generic;

namespace CatalinTudoran.Planets.ViewModels
{
    public class AddPlanetViewModel
    {
        public string Name { get; set; }

        public string ImageUrl { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }

        public string CaptainId { get; set; }

        public List<Robot> Robots { get; set; }
    }
}
