using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalinTudoran.Planets.Domain
{
    public class Robot : User
    {   
        public ExplorersTeam ExplorersTeam { get; set; }
    }
}